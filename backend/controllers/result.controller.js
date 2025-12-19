import Result from '../models/result.model.js'
import Quiz from '../models/quiz.model.js';

const submitResult = async (req, res) => {
    try {
        const { quizId, answers } = req.body;
        const userId = req.user.userId || req.user?._id;

        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        const formattedAnswers = answers.map(ans => {
            const question = quiz.questions.id(ans.questionId);
            const isCorrect = question && (
                (question.correctAnswer && ans.selectedAnswer === question.correctAnswer) ||
                (question.options && question.options.find(opt => opt.text === ans.selectedAnswer && opt.isCorrect))
            );
            return {
                questionId: ans.questionId,
                selectedAnswer: ans.selectedAnswer,
                isCorrect: !!isCorrect
            };
        });

        const result = new Result({
            quiz: quizId,
            user: userId,
            answers: formattedAnswers
        });

        await result.save();
        res.status(201).json({
            message: "result submitted successfully",
            result
        });

    } catch (error) {
        res.status(500).json({ message: 'Failed to submit result', error: error.message });
    }
};

const getUserResults = async (req, res) => {
    try {
        const userId = req.user.userId || req.user?._id;
        const results = await Result.find({ user: userId })
            .populate('quiz', 'title description')
            .sort({ completedAt: -1 });
        res.status(200).json({
            message: 'Results retrieved successfully',
            data: {results: results}});
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user results', error: error.message });
    }
};

const getResultById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await Result.findById(id)
            .populate('quiz', 'title description questions')
            .populate('user', 'username email');
        if (!result) {
            return res.status(404).json({ message: 'Result not found' });
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch result', error: error.message });
    }
};

const deleteResult = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id || req.user;
        const result = await Result.findById(id);
        if (!result) {
            return res.status(404).json({ message: 'Result not found' });
        }
        if (result.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this result' });
        }
        await result.deleteOne();
        res.json({ message: 'Result deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete result', error: error.message });
    }
};

export {
    submitResult,
    getUserResults,
    getResultById,
    deleteResult
}