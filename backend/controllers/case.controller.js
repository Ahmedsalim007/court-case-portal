import { Case } from '../models/case.js';
import { generateCaseNum } from '../utils/generateCaseNum.js';
import { validTransitions } from '../utils/validTransitions.js';
import {
  validateParties,
  validateHearingDateNotPast,
  validateHearingDateEditable,
} from '../utils/caseValidators.js';

export const getAllCases = async (req, res, next) => {
  try {
    const { pageNum, limitNum, skip } = req.pagination;
    const filter = req.filter;

    const cases = await Case.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .populate('createdBy', 'fullName employeeId')
      .populate('updatedBy', 'fullName employeeId')
      .skip(skip)
      .limit(limitNum);
      
    const total = await Case.countDocuments(filter);
    const totalPages = Math.ceil(total / limitNum);

    return res.status(200).json({
      success: true,
      count: cases.length,
      total,
      page: pageNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
      data: cases,
      message: 'Cases fetched successfully',
    });
  } catch (err) {
    next(err);
  }
};


export const createCase = async (req, res, next) => {
  const { caseParties, caseHearingDate, caseAssignedJudge } = req.body;

  if (!caseParties || !caseHearingDate || !caseAssignedJudge) {
    return res.status(400).json({
      success: false,
      message: 'Parties, hearing date, and assigned judge are all required',
    });
  }

  const partiesError = validateParties(caseParties);
  if (partiesError) {
    return res.status(400).json({ success: false, message: partiesError });
  }

  const dateError = validateHearingDateNotPast(caseHearingDate);
  if (dateError) {
    return res.status(400).json({ success: false, message: dateError });
  }

  try {
    const caseNum = await generateCaseNum();

    const newCase = new Case({
      caseNum,
      parties: caseParties,
      hearingDate: caseHearingDate,
      assignedJudge: caseAssignedJudge,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });

    await newCase.save();
    return res.status(201).json({
      success: true,
      data: newCase,
      message: 'Case Created Successfully',
    });
  } catch (err) {
    err.context = 'Case Creation Failed';
    next(err);
  }
};


export const getCaseByCaseNum = async (req, res, next) => {
  const { caseNum } = req.params;
  try {
    const foundCase = await Case.findOne({ caseNum })
      .populate('createdBy', 'fullName employeeId')
      .populate('updatedBy', 'fullName employeeId');

    if (foundCase) {
      return res.status(200).send({
        success: true,
        data: foundCase,
        message: 'Case fetched successfully',
      });
    }

    return res.status(404).json({
      success: false,
      message: 'Case Not found',
    });
  } catch (err) {
    next(err);
  }
};

export const UpdateCase = async (req, res, next) => {
  const { caseNum } = req.params;
  const { caseParties, caseHearingDate, caseAssignedJudge, status } = req.body;

  try {
    const targetCase = await Case.findOne({ caseNum });
    if (!targetCase) {
      return res.status(404).json({
        success: false,
        message: 'Case not found',
      });
    }
    if (
      !status &&
      caseParties === undefined &&
      caseHearingDate === undefined &&
      caseAssignedJudge === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: 'No fields provided to update',
      });
    }
       const originalStatus = targetCase.status // this is the a copy for the data check before it get mutated
    if (status && status !== targetCase.status) {
      const validStatuses = Case.schema.path('status').enumValues;
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status value: ${status}`,
        });
      }
      if (!validTransitions[targetCase.status].includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Cannot move from ${targetCase.status} to ${status}`,
        });
      }

      targetCase.$locals.previousStatus = targetCase.status;
      targetCase.status = status;
    }

    if (caseParties !== undefined) {
      const partiesError = validateParties(caseParties);
      if (partiesError) {
        return res.status(400).json({ success: false, message: partiesError });
      }
      targetCase.parties = caseParties;
    }

    if (caseHearingDate !== undefined) {
      const editableError = validateHearingDateEditable(originalStatus);
      if (editableError) {
        return res.status(400).json({ success: false, message: editableError });
      }
      const dateError = validateHearingDateNotPast(caseHearingDate);
      if (dateError) {
        return res.status(400).json({ success: false, message: dateError });
      }
      targetCase.hearingDate = caseHearingDate;
    }

    if (caseAssignedJudge !== undefined)
      targetCase.assignedJudge = caseAssignedJudge;

    targetCase.updatedBy = req.user.id;

    await targetCase.save();

    return res.status(200).json({
      success: true,
      data: targetCase,
      message: 'Case Updated Successfully',
    });
  } catch (err) {
    err.context = 'Failed to Update Case';
    next(err);
  }
};

export const deleteCase = async (req, res, next) => {
  const { caseNum } = req.params;

  try {
    const deletedCase = await Case.findOneAndDelete({ caseNum });
    if (!deletedCase) {
      return res.status(404).json({
        success: false,
        message: 'Case Not found',
      });
    }
    return res.status(200).json({
      success: true,
      data: deletedCase,
      message: 'Case deleted successfully',
    });
  } catch (err) {
    next(err);
  }
};

export const getCaseStats = async (req, res, next) => {
  try {
    const statusGroups = await Case.aggregate([
      {
        $group: { _id: '$status', count: { $sum: 1 } },
      },
    ]);
    const counts = { Registered: 0, 'In Hearing': 0, Judgment: 0, Closed: 0 };
    statusGroups.forEach((s) => {
      counts[s._id] = s.count;
    });

    const total = Object.values(counts).reduce((sum, c) => sum + c, 0);

    return res.status(200).json({
      success: true,
      data: { counts, total },
      message: 'Stats fetched successfully',
    });
  } catch (err) {
    next(err);
  }
};
