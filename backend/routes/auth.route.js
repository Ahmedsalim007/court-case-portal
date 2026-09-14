import express from 'express';
import {login} from '../controllers/auth.controller.js';
import { authLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = express.Router();

router.post('/login',authLimiter,login);


export default router;