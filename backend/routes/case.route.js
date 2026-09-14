import { createCase, deleteCase, getAllCases, getCaseByCaseNum, UpdateCase } from '../controllers/case.controller.js';
import { filterCases } from '../middlewares/filterCases.middleware.js';
import { paginate } from '../middlewares/paginate.middleware.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { getCaseStats } from '../controllers/case.controller.js';
import express from 'express';


const router = express.Router();

router.use(requireAuth)

router.post('/createCase', createCase);
router.get('/getCases', filterCases, paginate, getAllCases);
router.get('/getCase/:caseNum', getCaseByCaseNum);
router.put('/updateCase/:caseNum', UpdateCase)
router.delete('/deleteCase/:caseNum' ,deleteCase)
router.get('/stats',  getCaseStats)
export default router;
