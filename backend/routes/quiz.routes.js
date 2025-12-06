import express from 'express';
import { verifyToken, authorizeRoles } from '../middleware/auth.middleware.js';
import {
    getAllQuizzes,
    getUserQuizzes,
    getQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz
} from '../controllers/quiz.controller.js';

const quizRouter = express.Router();

quizRouter.post('/create-quiz', verifyToken, authorizeRoles('admin', 'editor'), createQuiz);
quizRouter.get('/all-quizzes', getAllQuizzes);
quizRouter.get('/my-quizzes', verifyToken, getUserQuizzes);
quizRouter.get('/:id', getQuizById);
quizRouter.post('/:id', verifyToken, authorizeRoles('admin', 'editor'), updateQuiz);
quizRouter.delete('/:id', authorizeRoles('admin', 'editor'), deleteQuiz);

export default quizRouter;