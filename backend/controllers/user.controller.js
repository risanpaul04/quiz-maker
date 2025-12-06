import User from "../models/user.model.js";

const getUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Login credentials missing",
      });
    }

    const user = await User.findById(userId).select('-password -refreshTokens -maxSessions');
    res.status(200).json({
        data: {
            user: {
            ...user._doc
        }}
    })
  } catch (error) {
    res.status(500).json({
      message: "Failed to get user",
      error: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -refreshTokens -maxSessions').sort({updatedAt: -1});
        res.status(200).json({
            data: {
                users
            }
        });
        
    } catch (error) {
        res.status(500).json({
            message: 'Error getting users',
            error: error.message
        })
    }
};

const updateUser = async (req, res) => {

};

const deleteUser = async (req, res) => {

};

export { getUser, getAllUsers, updateUser, deleteUser };