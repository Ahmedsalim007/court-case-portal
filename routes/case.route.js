import { createCase, deleteCase, getAllCases, getCaseByCaseNum, UpdateCase } from '../controllers/case.controller.js';
import { filterCases } from '../middlewares/filterCases.middleware.js';
import { paginate } from '../middlewares/paginate.middleware.js';
import express from 'express';


const router = express.Router();

router.post('/createCase', createCase);
router.get('/getCases',filterCases,paginate,getAllCases);
router.get('/getCase/:caseNum', getCaseByCaseNum);
router.put('/updateCase/:caseNum',UpdateCase)
router.delete('/deleteCase/:caseNum', deleteCase)

export default router;
/*
re seed the Database with the  the 100 case again for the stauts not being there.|
test the update endpoint.
clone the project to github*/