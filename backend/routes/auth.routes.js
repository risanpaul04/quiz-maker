import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import {
    signup,
    login,
    logout
} from '../controllers/auth.controller.js'

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.post('/logout', verifyToken, logout);

export default authRouter;