import express from 'express';
import { deleteUser, getAllUsers, getUserById, updateUser } from '../controllers/user.controller.js';
import { verifyUser } from '../middlewares/verifyToken.js';



const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', verifyUser, getUserById)
router.put('/update/:id', verifyUser, updateUser);
router.delete('/delete/:id', verifyUser, deleteUser);



export default router;