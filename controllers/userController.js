const formatUserResponse = (user) => ({
    id: user.id,
    username: user.name,
    email: user.email,
    role: user.role,
    takentest: user.hasTakenAssessment,
  });
  
  const current_user = async (req, res) => {
    const token = req.token || req.headers.authorization?.split(" ")[1];
    return res.status(200).json({
      data: {
        user: formatUserResponse(req.user),
        token,
      },
      requiresVerification: false,
      msg: 'User data refreshed successfully',
    });
  };
  

module.exports = current_user;