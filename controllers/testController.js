const sequelize = require('../config/database');
const { Groq } = require('groq-sdk');
const { User } = require('../model/user');
const AptitudeQuestion = require('../model/aptitudeQuestion');
const Response = require('../model/response');
const TestSession = require('../model/testSession');

require('dotenv').config();

const groq = new Groq({ 
    apiKey: process.env.GROQ_API_KEY
});


const startTestSession = async (req, res) => {
  try {
    const userId = req.user.id;

    const newSession = await TestSession.create({ userId: userId });

    return res.status(201).json({ sessionId: newSession.id });
  } catch (err) {
    console.error('Start Session Error:', err);
    res.status(500).json({ error: 'Failed to start test session' });
  }
};

const getAptitudeQuestions = async (req, res) => {
    try {
      // Optional: add pagination or filtering in the future
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

const submitAptitudeTest = async (req, res) => {
    try {
      const userId = req.user.id;
      const { sessionId, responses } = req.body;
  
      if (!Array.isArray(responses) || !sessionId) {
        return res.status(400).json({ error: 'Session ID and responses are required.' });
      }
  
      const formattedResponses = responses.map((r) => ({
        userId: userId,
        testSessionId: sessionId,
        question: r.question,
        answer: r.answer
      }));

      await User.update({ hasTakenAssessment: true }, {
        where: { id: userId }
      });

      await Response.bulkCreate(formattedResponses);
  
      // Mark session as complete
      await TestSession.update(
        { completedAt: new Date() },
        { where: { id: sessionId, user_id: userId } }
      );
  
      return res.status(201).json({ message: 'Test submitted successfully.' });
    } catch (err) {
      console.error('Submit Test Error:', err);
      res.status(500).json({ error: 'Internal server error' });
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


const getUserActivities = async (req, res) => {
    const userId = req.user.id;
  
    const sessions = await TestSession.findAll({
      where: { user_id: userId },
      include: [{ model: Response }],
      order: [['createdAt', 'DESC']]
    });
  
    const activities = sessions.map((session) => ({
      sessionId: session.id,
      startedAt: session.startedAt,
      completedAt: session.completedAt,
      responseCount: session.Responses.length
    }));
  
    return res.json({ activities });
};
  

const getUserStats = async (req, res) => {
    const userId = req.user.id;
  
    const totalSessions = await TestSession.count({ where: { userId: userId } });
    const lastSession = await TestSession.findOne({
      where: { user_id: userId },
      order: [['createdAt', 'DESC']]
    });
  
    const totalResponses = await Response.count({ where: { userId: userId } });
  
    return res.json({
      totalSessions,
      totalResponses,
      lastTestDate: lastSession?.createdAt || null
    });
};
  

async function getCareerRecommendationsFromGroq(userAnswers, personalityProfile, interestSummary) {
    const prompt = `
  IMPORTANT: Return only a JSON array. No explanations or additional text.
  
  You are an expert career guidance counselor AI.
  
  Based on the following user's aptitude test answers, personality profile, and interest summary, generate the top 3 career paths that best suit them. Include:
  - A short title
  - A 1-2 sentence summary of the role
  - A confidence score out of 100
  - Match category: "Creative", "Analytical", "Technical", "Leadership", or "Mixed"
  
  User Answers (simplified or summarized): ${userAnswers}
  Personality Profile Summary: ${personalityProfile}
  Interest Summary: ${interestSummary}
  
  Respond in this **exact** JSON format:
  
  [
    {
      "title": "Data Scientist",
      "summary": "Analyze and model data to uncover insights that support business decisions.",
      "score": 92,
      "category": "Analytical"
    },
    {
      "title": "UX Designer",
      "summary": "Design user interfaces that are functional, engaging, and accessible.",
      "score": 88,
      "category": "Creative"
    },
    {
      "title": "Product Manager",
      "summary": "Oversee product development, aligning business goals with user needs.",
      "score": 85,
      "category": "Leadership"
    }
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

module.exports = {
    startTestSession,
    getAptitudeQuestions,
    submitAptitudeTest,
    resetTest,
    getUserActivities,
    getUserStats,
    getCareerRecommendationsFromGroq,
}