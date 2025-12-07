import Quiz from "../models/quiz.model.js";

const getAllQuizzes = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 9,
      // search = "",
      sort = "createdAt",
      order = "desc",
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const filter = { isPublic: true };

    const sortOrder = order === "asc" ? 1 : -1;
    const sortObj = { [sort]: sortOrder };

    const [quizzes, total] = await Promise.all([
      Quiz.find(filter)
        // .select('-questions.correctAnswer -questions.options.isCorrect')
        .populate("creator", "username email")
        .sort(sortObj)
        .skip(skip)
        .limit(limitNum)
        .lean(),

      Quiz.countDocuments(filter),
    ]);

    const pagination = {
      totalItems: total,
      totalPages: Math.ceil(total/limitNum),
      currentPage: pageNum,
      hasPreviousPage: pageNum > 1,
      hasNextPage: pageNum < Math.ceil(total/limitNum),
      pageSize: limitNum
    }

    res.status(200).json({
      success: true,
      message: "quizzes sent successfully",
      data: {
        quizzes,
        pagination: pagination
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error sending quizzes",
      error: error.message,
    });
  }
};

const getUserQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ creator: req.user.userId }).sort({
      createdAt: -1,
    });
    if (!quizzes) {
      return res.status(404).json({
        success: false,
        message: "quizzes not found",
      });
    }

    // console.log(quizzes);

    res.status(200).json({
      success: true,
      message: "user quizzes sent successfully",
      data: {quizzes: quizzes},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error sending user quizzes",
      error: error.message,
    });
  }
};

const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }
    res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "ERROR getting quiz",
      error: error.message,
    });
  }
};

const createQuiz = async (req, res) => {
  try {
    const { title, description, questions, isPublic } = req.body;

    const quiz = new Quiz({
      title,
      description,
      questions,
      isPublic,
      creator: req.user.userId,
    });

    await quiz.save();

    res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      quiz,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating quiz",
      error: error.message,
    });
  }
};

const updateQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }
    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, {
      ...req.body,
    });

    if (!updatedQuiz) {
      return res.status(400).json({
        success: false,
        message: "Error updating quiz",
      });
    }

    res.status(201).json({
      message: "Quiz updated successfully",
      quiz: updatedQuiz,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating quiz",
      error: error.message,
    });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    if (quiz.creator.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "not authorized",
      });
    }

    await Quiz.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting quiz",
      error: error.message,
    });
    console.log(error);
  }
};

export {
  getAllQuizzes,
  getUserQuizzes,
  getQuizById,
  createQuiz,
  updateQuiz,
  deleteQuiz,
};
