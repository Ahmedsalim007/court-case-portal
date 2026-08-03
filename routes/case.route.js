import { createCase, deleteCase, getAllCases, getCaseByCaseNum, UpdateCase } from '../controllers/case.controller.js';
import { filterCases } from '../middlewares/filterCases.middleware.js';
import { paginate } from '../middlewares/paginate.middleware.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import express from 'express';


const router = express.Router();

router.post('/createCase',requireAuth, createCase);
router.get('/getCases',requireAuth, filterCases, paginate, getAllCases);
router.get('/getCase/:caseNum',requireAuth, getCaseByCaseNum);
router.put('/updateCase/:caseNum',requireAuth, UpdateCase)
router.delete('/deleteCase/:caseNum', requireAuth ,deleteCase)

export default router;
