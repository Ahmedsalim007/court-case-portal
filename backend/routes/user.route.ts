
import express from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireRole } from '../middlewares/role.middleware.js';
import {
  createUser,
  getUsers,
  getUser,
  deleteUser
} from '../controllers/user.controller.js';

const router = express.Router();

router.use(requireAuth, requireRole('Admin')); 

router.post('/createAccount', createUser);
router.get('/getUsers', getUsers);
router.get('/getAccount/:employeeId', getUser);
router.delete('/deleteAccount/:employeeId', deleteUser);

export default router;