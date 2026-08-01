import { createCase, deleteCase, getAllCases, getCaseByCaseNum, UpdateCase } from '../controllers/case.controller.js';
import { paginate } from '../middlewares/paginate.middleware.js';
import express from 'express';


const router = express.Router();

router.post('/CreateCase', createCase);
router.get('/getCases', paginate,getAllCases);
router.get('/getCase/:caseNum', getCaseByCaseNum);
router.put('/updateCase/:caseNum',UpdateCase)
router.delete('/deleteCase/:caseNum', deleteCase)

export default router;
/*
re seed the Database with the  the 100 case again for the stauts not being there.|
test the update endpoint.
clone the project to github*/