import express from "express";
import caseRoute from './case.route.js';
import authRoute from './auth.route.js';
import userRoute from './user.route.js'



const router = express.Router();


router.use('/auth',  authRoute);
router.use('/cases',  caseRoute);
router.use('/user', userRoute)

export default router;







