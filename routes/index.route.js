import express from "express";
import caseRoute from './case.route.js';
import authRoute from './auth.route.js';



const router = express.Router();


router.use('/auth',  authRoute);
router.use('/cases',  caseRoute);

export default router;


/*eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNzA0YWZhZGE4YmNjZTg4NmM2ODMwYyIsImVtcGxveWVlSWQiOiIxMjM0Iiwicm9sZSI6IkNsZXJrIiwiaWF0IjoxNzg1NzQ0MTIzLCJleHAiOjE3ODU4MzA1MjN9.X3j9xI7hAwFCDt3qhzzJRMz_s6JwDYHpCcta9Bh-s60*/