import express from "express";
import caseRoute from './case.route.js';
import authRoute from './auth.route.js';



const router = express.Router();


router.use('/auth',  authRoute);
router.use('/cases',  caseRoute);

export default router;


/*eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNzE4NTE3YzFhNjYwYmVmNDc2M2JmZiIsImZ1bGxOYW1lIjoiQWhtZWQgU2FsaW0iLCJlbXBsb3llZUlkIjoiMjAwMjEiLCJyb2xlIjoiQ2xlcmsiLCJpYXQiOjE3ODU4MjQ1MzYsImV4cCI6MTc4NTkxMDkzNn0.L4NZ4h6VCJVqYX4yhgybzCxBMNXmGrwJOBCy5lTIH98*/




/*
Change the the mongDB assigned to the user  from just id to mongoId becasue the mixup with the employeeid 
check the hearing date and In hearing realtionship and model it.


*/