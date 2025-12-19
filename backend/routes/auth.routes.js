import express from 'express';
import { verifyToken } from '../middleware/auth.middleware.js';
import {
    signup,
    login,
    logout,
    getCurrentUser
} from '../controllers/auth.controller.js'

const authRouter = express.Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.post('/logout', verifyToken, logout);
authRouter.post('/current-user', verifyToken, getCurrentUser);

export default authRouter;