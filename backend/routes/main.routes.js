import express from 'express';

import authRouter from './auth.routes.js';
import userRouter from './user.routes.js';
import quizRouter from './quiz.routes.js';
import resultRouter from './result.routes.js';

const mainRouter = express.Router();

mainRouter.use('/auth', authRouter);
mainRouter.use('/users', userRouter);
mainRouter.use('/quizzes', quizRouter);
mainRouter.use('/results', resultRouter);

export default mainRouter;