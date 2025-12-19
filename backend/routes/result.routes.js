import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import {
    submitResult,
    getUserResults,
    getResultById,
    deleteResult
} from '../controllers/result.controller.js';

const resultRouter = express.Router();

resultRouter.post('/submit', verifyToken, submitResult);
resultRouter.get('/my-results', verifyToken, getUserResults);
resultRouter.get('/:id', getResultById);
resultRouter.delete('/:id', verifyToken, deleteResult);

export default resultRouter;