import express from 'express';
import { verifyToken, authorizeRoles } from '../middleware/auth.middleware.js';
import {
    getUser,
    getAllUsers,
    updateUser,
    deleteUser
} from '../controllers/user.controller.js'
const userRouter = express.Router();

userRouter.get('/', verifyToken, getUser);
userRouter.get('/get-all-users', verifyToken, authorizeRoles('admin'), getAllUsers);

userRouter.post('/:id', verifyToken, updateUser);
userRouter.post('/:id', verifyToken, deleteUser);

export default userRouter;