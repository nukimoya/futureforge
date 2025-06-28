const { sequelize } = require('../config/database');
const { Groq } = require('groq-sdk');

const { User } = require('../model/user');
const AptitudeQuestion = require('../model/aptitudeQuestion');
const Response = require('../model/response');
const TestSession = require('../model/testSession');
const CareerRecommendation = require('../model/careerRecommendation')

const generatePersonalityProfile = require('../utils/personalityProfile')
const generateInterestSummary = require('../utils/interestSummary')
const logActivity = require('../utils/logActivity')

require('dotenv').config();

const groq = new Groq({ 
    apiKey: process.env.GROQ_API_KEY
});

const getAptitudeQuestions = async (req, res) => {
  try {
    const questions = await AptitudeQuestion.findAll({
      attributes: [
        'id',
        'question_text',
        'options',
        'question_type',
        'difficulty_level',
        'category'
      ],
      order: [['id', 'ASC']]
    });

    return res.status(200).json({
      success: true,
      count: questions.length,
      questions
    });

  } catch (error) {
    console.error("Error fetching aptitude questions:", error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load aptitude test questions. Please try again later.'
    });
  }
};

const startTestSession = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;

    const existingSession = await TestSession.findOne({
      where: {
        userId,
        completedAt: null
      },
      order: [['startedAt', 'DESC']],
      transaction: t,
      lock: t.LOCK.UPDATE // 🔒 lock rows to prevent race condition
    });

    if (existingSession) {
      await t.commit();
      console.log(`[INFO] User ${userId} already has an open session: ${existingSession.id}`);
      return res.status(200).json({
        message: 'An existing test session was found.',
        sessionId: existingSession.id
      });
    }

    const newSession = await TestSession.create({ userId }, { transaction: t });
    await t.commit();
    await logActivity(userId, 'test_started', { sessionId: newSession.id });

    console.log(`[INFO] New test session created for user ${userId}: ${newSession.id}`);
    return res.status(201).json({
      message: 'New test session started.',
      sessionId: newSession.id
    });

  } catch (err) {
    await t.rollback();
    console.error('[ERROR] Failed to start test session:', err);
    return res.status(500).json({
      error: 'Internal server error. Could not start test session.'
    });
  }
};

const submitAptitudeTest = async (req, res) => {
  const userId = req.user.id;
  const { sessionId, responses } = req.body;

  // Validate input
  if (!Array.isArray(responses) || !sessionId) {
    return res.status(400).json({ error: 'Session ID and responses are required.' });
  }

  const transaction = await sequelize.transaction();

  try {
    // 1. Validate session ownership and completion
    const session = await TestSession.findOne({
      where: { id: sessionId, userId },
      transaction
    });

    if (!session) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Invalid or unauthorized test session.' });
    }

    if (session.completedAt) {
      await transaction.rollback();
      return res.status(400).json({ error: 'This test session is already completed.' });
    }

    // 2. Format and save responses
    const formattedResponses = responses.map(r => ({
      userId,
      testSessionId: sessionId,
      question: r.question?.toString().trim().slice(0, 500),
      answer: r.answer?.toString().trim().slice(0, 500)
    }));

    await Response.bulkCreate(formattedResponses, { transaction });

    // 3. Update user flag
    await User.update(
      { hasTakenAssessment: true },
      { where: { id: userId }, transaction }
    );

    // 4. Mark session as complete
    await TestSession.update(
      { completedAt: new Date() },
      { where: { id: sessionId }, transaction }
    );
    await logActivity(userId, 'test_completed', { sessionId: session.id });

    // 5. Commit transaction before calling external AI
    await transaction.commit();

    // 6. Prepare summaries for AI
    const userAnswers = responses.map(r => `Q: ${r.question?.trim()} A: ${r.answer?.trim()}`).join('\n');
    const personalityProfile = generatePersonalityProfile(responses);
    const interestSummary = generateInterestSummary(responses);

    // 7. Generate career recommendations
    let recommendations = [];
    try {
      recommendations = await getCareerRecommendationsFromGroq(
        userAnswers,
        personalityProfile,
        interestSummary
      );
    } catch (aiErr) {
      console.warn('[⚠️ AI ERROR] Failed to get recommendations:', aiErr.message);
    }

    // 8. Save recommendations if any
    if (recommendations.length > 0) {
      await CareerRecommendation.bulkCreate(
        recommendations.map(rec => ({
          userId,
          sessionId,
          type: rec.type,
          title: rec.title,
          summary: rec.summary,
          description: rec.description,
          score: rec.score,
          category: rec.category,
          confidence: rec.confidence,
          priority: rec.priority,
          skills: rec.skills,
          timeframe: rec.timeframe,
          icon: rec.icon,
          actionItems: rec.actionItems
        }))
      );
    }

    // 9. Return final result
    return res.status(201).json({
      message: 'Test submitted successfully.',
      recommendations
    });

  } catch (err) {
    await transaction.rollback();
    console.error('[❌ SUBMISSION ERROR]', err);
    return res.status(500).json({ error: 'Internal server error during test submission.' });
  }
};

async function getCareerRecommendationsFromGroq(userAnswers, personalityProfile, interestSummary) {
  const prompt = `
IMPORTANT: Return only a JSON array. No explanations or extra text.

You are an expert AI career counselor and personalized learning advisor.

Based on the user's aptitude test answers, personality profile, and interest summary, generate **4 personalized career development tracks**.

Each object must include:
- type: "career" | "education" | "certification"
- title: short name of the career or path
- summary: 1–2 sentence intro
- description: a longer overview of what this path involves
- score: relevance out of 100
- category: "Creative" | "Analytical" | "Technical" | "Leadership" | "Mixed"
- confidence: estimation of fit (0–100)
- priority: "high", "medium", or "low"
- skills: list of skills related to the path
- timeframe: how long this path usually takes
- icon: suggest a symbol (e.g., "code", "book", "briefcase")
- actionItems: 2–5 steps the user can take next

User Answers: ${userAnswers}
Personality Profile: ${personalityProfile}
Interest Summary: ${interestSummary}

Respond in this **exact JSON format** but order it in order of highest score:

[
  {
    "type": "career",
    "title": "Data Scientist",
    "summary": "Analyze large datasets to uncover business insights.",
    "description": "As a Data Scientist, you’ll use tools like Python and SQL to solve complex data problems and support strategic decisions.",
    "score": 94,
    "category": "Analytical",
    "confidence": 89,
    "priority": "high",
    "skills": ["Python", "SQL", "Machine Learning"],
    "timeframe": "6–12 months",
    "icon": "bar-chart",
    "actionItems": [
      "Take an online course on data science",
      "Practice with Kaggle competitions",
      "Build a portfolio project with real data"
    ]
  },
  ...
]
`;

  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.6,
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }]
    });

    const responseText = response.choices[0]?.message?.content?.trim();
    if (!responseText) throw new Error("Empty response from Groq");

    const jsonMatch = responseText.match(/\[.*\]/s);
    if (!jsonMatch) throw new Error("No JSON array found in response");

    const parsedRecommendations = JSON.parse(jsonMatch[0]);
    return parsedRecommendations;

  } catch (error) {
    console.error("Career recommendation generation failed", {
      message: error.message,
      rawResponse: error.responseText || "No raw content",
      stack: error.stack
    });
    throw new Error("Failed to generate career recommendations from AI");
  }
}

async function buildUserSummary(userId) {
  const responses = await Response.findAll({ where: { userId } });
  
  const userAnswers = responses.map(r => 
    `Q: ${r.question?.trim()} A: ${r.answer?.trim()}`
  ).join('\n');

  const personalityProfile = generatePersonalityProfile(responses);
  const interestSummary = generateInterestSummary(responses);

  const session = await TestSession.findOne({
    where: { userId: userId },
    order: [['startedAt', 'DESC']]
  });

  const metaSummary = `Test Score: ${session?.score || 'N/A'} | Taken On: ${session?.startedAt.toDateString()}`;

  return {
    userAnswers,
    personalityProfile,
    interestSummary,
    metaSummary
  };
}

const latestRecommendation = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      console.warn('[WARN] No userId found in request.');
      return res.status(400).json({ error: 'User ID is missing from request.' });
    }

    // 1. Fetch the most recent *completed* test session
    const latestSession = await TestSession.findOne({
      where: {
        userId,
        completedAt: { [require('sequelize').Op.ne]: null } // Ensure session is completed
      },
      order: [['completedAt', 'DESC']]
    });

    if (!latestSession) {
      return res.status(404).json({ error: 'No completed test session found.' });
    }

    // 2. Fetch recommendations tied to that session
    const recommendations = await CareerRecommendation.findAll({
      where: {
        userId,
        sessionId: latestSession.id
      }
    });

    if (!recommendations.length) {
      console.warn(`[WARN] No recommendations found for userId ${userId}, sessionId ${latestSession.id}`);
    }

    // 3. Build user profile summary (e.g., interest & personality info)
    const profile = await buildUserSummary(userId);


    // 4. Send response
    return res.json({
      profile,
      sessionId: latestSession.id,
      completedAt: latestSession.completedAt,
      recommendations
    });

  } catch (err) {
    console.error('[❌ ERROR] Failed to fetch latest recommendations:', err);
    return res.status(500).json({ error: 'Failed to load recommendations.' });
  }
};

const reportDownload = async (req, res) => {
  try {
    const userId = req.user.id;
    await logActivity(userId, 'report_downloaded');
    return res.status(200).json({ message: 'Report download logged' });
  } catch (err) {
    console.error('Failed to log report download:', err);
    return res.status(500).json({ error: 'Failed to log report download' });
  }
};

const resetTest = async (req, res) => {
    try {
        const userId = req.user.id;
        await Response.destroy({ where: { user_id: userId } });
    
        return res.status(200).json({ message: 'Test responses reset successfully.' });
    } catch (err) {
        console.error('Reset Test Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
  
const getUserStats = async (req, res) => {
  const userId = req.user.id;

  try {
    const testsTaken = await TestSession.count({
      where: { userId: userId }
    });

    const lastSession = await TestSession.findOne({
      where: { userId },
      order: [['startedAt', 'DESC']]
    });
    
    let timeSinceLastTest = null;
    
    if (lastSession?.startedAt) {
      const now = new Date();
      const startedAt = new Date(lastSession.startedAt);
      const diffMs = now - startedAt;
    
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);
    
      if (diffDays >= 1) {
        timeSinceLastTest = `${diffDays} day${diffDays !== 1 ? 's' : ''}`;
      } else {
        timeSinceLastTest = `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
      }
    }

    const averageScoreResult = await CareerRecommendation.findOne({
      where: { userId, type: 'career' },
      attributes: [
        [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('score')), 2), 'avgScore']
      ],
      raw: true
    });
    
    const averageScore = averageScoreResult?.avgScore ?? 0;

    const distinctCareerCount = await CareerRecommendation.count({
      where: {
        userId: userId,
        type: 'career'
      },
      distinct: true,
      col: 'title' // Ensures duplicates by title are not double-counted
    });

    return res.json({
      testsTaken,
      averageScore,
      timeSinceLastTest,
      distinctCareerCount,
    });

  } catch (error) {
    console.error("❌ Failed to get user stats:", error);
    return res.status(500).json({ error: "Server error while fetching stats" });
  }
};
  

module.exports = {
    startTestSession,
    getAptitudeQuestions,
    submitAptitudeTest,
    latestRecommendation,
    reportDownload,
    resetTest,
    getUserStats,
}