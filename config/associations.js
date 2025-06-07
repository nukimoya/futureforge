const User = require('../model/user');
const TestSession = require('../model/testSession');
const ProfileSummary = require('../model/profileSummary');
const CareerRecommendation = require('../model/careerRecommendation');
const Feedback = require('../model/feedback');
const Response = require('../model/response')
const Career = require('../model/career')

function setupAssociations() {
    // One-to-Many: User -> TestSession
    User.hasMany(TestSession, { foreignKey: 'userId', as: 'testSessions' });
    TestSession.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  
    // One-to-Many: TestSession -> Response
    TestSession.hasMany(Response, { foreignKey: 'testSessionId', as: 'responses' });
    Response.belongsTo(TestSession, { foreignKey: 'testSessionId', as: 'testSession' });
  
    // One-to-One: TestSession -> ProfileSummary
    TestSession.hasOne(ProfileSummary, { foreignKey: 'testSessionId', as: 'profileSummary' });
    ProfileSummary.belongsTo(TestSession, { foreignKey: 'testSessionId', as: 'testSession' });
  
    // One-to-Many: ProfileSummary -> CareerRecommendation
    ProfileSummary.hasMany(CareerRecommendation, { foreignKey: 'profileSummaryId', as: 'careerRecommendations' });
    CareerRecommendation.belongsTo(ProfileSummary, { foreignKey: 'profileSummaryId', as: 'profileSummary' });
  
    // One-to-Many: Career -> CareerRecommendation
    Career.hasMany(CareerRecommendation, { foreignKey: 'careerId', as: 'recommendations' });
    CareerRecommendation.belongsTo(Career, { foreignKey: 'careerId', as: 'career' });
  
    // One-to-Many: User -> Feedback
    User.hasMany(Feedback, { foreignKey: 'userId', as: 'feedbacks' });
    Feedback.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  
    // One-to-Many: CareerRecommendation -> Feedback
    CareerRecommendation.hasMany(Feedback, { foreignKey: 'careerRecommendationId', as: 'feedbacks' });
    Feedback.belongsTo(CareerRecommendation, { foreignKey: 'careerRecommendationId', as: 'careerRecommendation' });
  }

module.exports = setupAssociations;