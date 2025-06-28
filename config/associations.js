const {User} = require('../model/user');
const TestSession = require('../model/testSession');
const ProfileSummary = require('../model/profileSummary');
const CareerRecommendation = require('../model/careerRecommendation');
const Feedback = require('../model/feedback');
const Response = require('../model/response')
const Career = require('../model/career')
const UserActivity = require('../model/userActivity')

function setupAssociations() {
  User.hasMany(TestSession, { foreignKey: 'userId', as: 'testSessions' });
  TestSession.belongsTo(User, { foreignKey: 'userId', as: 'user' });

  User.hasMany(UserActivity, { foreignKey: 'userId' });
  UserActivity.belongsTo(User, { foreignKey: 'userId' });
  
  TestSession.hasMany(Response, { foreignKey: 'testSessionId', as: 'responses' });
  Response.belongsTo(TestSession, { foreignKey: 'testSessionId', as: 'testSession' });
  
  TestSession.hasOne(ProfileSummary, { foreignKey: 'testSessionId', as: 'profileSummary' });
  ProfileSummary.belongsTo(TestSession, { foreignKey: 'testSessionId', as: 'testSession' });
  
  ProfileSummary.hasMany(CareerRecommendation, { foreignKey: 'profileSummaryId', as: 'careerRecommendations' });
  CareerRecommendation.belongsTo(ProfileSummary, { foreignKey: 'profileSummaryId', as: 'profileSummary' });
  
  Career.hasMany(CareerRecommendation, { foreignKey: 'careerId', as: 'recommendations' });
  CareerRecommendation.belongsTo(Career, { foreignKey: 'careerId', as: 'career' });
  
  User.hasMany(Feedback, { foreignKey: 'userId', as: 'feedbacks' });
  Feedback.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  
  CareerRecommendation.hasMany(Feedback, { foreignKey: 'careerRecommendationId', as: 'feedbacks' });
  Feedback.belongsTo(CareerRecommendation, { foreignKey: 'careerRecommendationId', as: 'careerRecommendation' });
}

module.exports = setupAssociations;