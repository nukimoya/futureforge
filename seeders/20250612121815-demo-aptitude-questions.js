'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('aptitude_questions', [
      {
        question_text: 'What type of task do you find most fulfilling?',
        options: ['Designing a new layout', 'Solving a math problem', 'Leading a team project', 'Writing a detailed report'],
        question_type: 'preference',
        difficulty_level: 'easy',
        category: 'Interest',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question_text: 'How do you prefer to solve problems?',
        options: ['With logic and structure', 'Through brainstorming and creativity', 'By collaborating with others', 'By researching existing solutions'],
        question_type: 'personality',
        difficulty_level: 'medium',
        category: 'Problem Solving',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question_text: 'What motivates you to do your best work?',
        options: ['Achieving measurable results', 'Helping others grow', 'Exploring new ideas', 'Being recognized for leadership'],
        question_type: 'personality',
        difficulty_level: 'medium',
        category: 'Motivation',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question_text: 'Which activity sounds the most appealing?',
        options: ['Designing a mobile app interface', 'Analyzing survey data', 'Planning a product launch', 'Building an automation script'],
        question_type: 'preference',
        difficulty_level: 'easy',
        category: 'Career Interests',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question_text: 'In a group project, what role do you naturally take?',
        options: ['Creative contributor', 'Strategic planner', 'Team leader', 'Technical expert'],
        question_type: 'personality',
        difficulty_level: 'medium',
        category: 'Teamwork',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question_text: 'What type of content do you consume most often?',
        options: ['Design tutorials', 'Tech news and reviews', 'Business strategy articles', 'Science documentaries'],
        question_type: 'interest',
        difficulty_level: 'easy',
        category: 'Media Preference',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question_text: 'How do you usually make decisions?',
        options: ['Based on data and logic', 'Following intuition and creativity', 'Consulting others for feedback', 'Comparing different options in depth'],
        question_type: 'personality',
        difficulty_level: 'medium',
        category: 'Decision-Making',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question_text: 'Which of the following would you most enjoy doing?',
        options: ['Creating digital illustrations', 'Building financial models', 'Coordinating an event', 'Conducting usability tests'],
        question_type: 'preference',
        difficulty_level: 'easy',
        category: 'Career Fit',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question_text: 'When learning something new, what’s your preferred method?',
        options: ['Watching tutorials', 'Reading documentation', 'Practicing hands-on', 'Discussing with peers'],
        question_type: 'personality',
        difficulty_level: 'easy',
        category: 'Learning Style',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question_text: 'What work environment suits you best?',
        options: ['Quiet and focused', 'Fast-paced and energetic', 'Collaborative and social', 'Flexible and remote'],
        question_type: 'personality',
        difficulty_level: 'easy',
        category: 'Work Environment',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question_text: 'Which describes you best?',
        options: ['Detail-oriented', 'Big-picture thinker', 'Empathetic listener', 'Risk taker'],
        question_type: 'personality',
        difficulty_level: 'easy',
        category: 'Self-Perception',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question_text: 'Which task would you prioritize first in a project?',
        options: ['Planning the strategy', 'Creating the visuals', 'Gathering the data', 'Managing the team'],
        question_type: 'personality',
        difficulty_level: 'medium',
        category: 'Work Habits',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question_text: 'What makes you feel accomplished at the end of the day?',
        options: ['Solving a tough problem', 'Helping someone succeed', 'Finishing a checklist', 'Building something new'],
        question_type: 'personality',
        difficulty_level: 'easy',
        category: 'Values',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question_text: 'If you could pick a side project, what would it be?',
        options: ['Launching a mobile app', 'Starting a blog', 'Running a podcast', 'Building a portfolio website'],
        question_type: 'preference',
        difficulty_level: 'easy',
        category: 'Side Interests',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question_text: 'What type of feedback helps you most?',
        options: ['Constructive and detailed', 'Supportive and motivational', 'Fast and frequent', 'Comparative and competitive'],
        question_type: 'personality',
        difficulty_level: 'medium',
        category: 'Feedback Style',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question_text: 'Which of the following would excite you most?',
        options: ['Designing a game UI', 'Analyzing consumer behavior', 'Organizing a tech conference', 'Automating routine tasks'],
        question_type: 'preference',
        difficulty_level: 'easy',
        category: 'Career Aspirations',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question_text: 'Which subject did you enjoy most in school?',
        options: ['Art & Design', 'Mathematics', 'Literature', 'Science'],
        question_type: 'interest',
        difficulty_level: 'easy',
        category: 'Academic Preference',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question_text: 'How do you approach deadlines?',
        options: ['Start early and finish early', 'Work steadily over time', 'Push through right before deadline', 'Break it into phases'],
        question_type: 'personality',
        difficulty_level: 'medium',
        category: 'Time Management',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question_text: 'What kind of team do you thrive in?',
        options: ['Small creative teams', 'Large structured teams', 'Remote international teams', 'Fast-moving startup teams'],
        question_type: 'personality',
        difficulty_level: 'medium',
        category: 'Team Compatibility',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        question_text: 'Which sounds most like your ideal job?',
        options: ['Designing digital products', 'Running strategic campaigns', 'Solving analytical problems', 'Leading company vision'],
        question_type: 'preference',
        difficulty_level: 'easy',
        category: 'Career Match',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('aptitude_questions', null, {});
  }
};
