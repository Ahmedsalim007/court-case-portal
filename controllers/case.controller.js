import { Case } from '../models/case.js';

const validTransitions = {
  Registered: ['In Hearing'],
  'In Hearing': ['Judgment'],
  Judgment: ['Closed'],
  Closed: [],
};

export const getAllCases = async (req, res) => {
  try {
    const { pageNum, limitNum, skip } = req.pagination;
    const cases = await Case.find({}).skip(skip).limit(limitNum);
    const total = await Case.countDocuments({});
    const totalPages = Math.ceil(total / limitNum);
    return res.status(200).json({
      success: true,
      count: cases.length,
      totalCases:total,
      page: pageNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
      data: cases,
      message: 'Cases fetched successfully',
    });
  } catch (err) {
    return res.status(500).json({
      sucess: false,
      message: 'Something went wrong on the server',
      error: err.message,
    });
  }
};
export const createCase = async (req, res) => {
  const { caseNum, caseParties, caseHearingDate, caseAssignedJudge, status } =
    req.body;

  try {
    const newCase = new Case({
      caseNum,
      parties: caseParties,
      hearingDate: caseHearingDate,
      assignedJudge: caseAssignedJudge,
    });
    await newCase.save();
    return res.status(201).json({
      success: true,
      data: newCase,
      message: 'Case Created Successfully',
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Failed To Create Case ',
        error: err.message,
      });
    }
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Case number already exists',
        error: err.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Something went wrong on the server',
      error: err.message,
    });
  }
};

export const getCaseByCaseNum = async (req, res) => {
  const { caseNum } = req.params;
  try {
    const foundCase = await Case.findOne({ caseNum });

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
    return res.status(500).json({
      sucess: false,
      message: 'Something went wrong on the server',
      error: err.message,
    });
  }
};

export const UpdateCase = async (req, res) => {
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

      targetCase.status = status;
    }
    if (caseParties !== undefined) targetCase.parties = caseParties;
    if (caseHearingDate !== undefined) targetCase.hearingDate = caseHearingDate;
    if (caseAssignedJudge !== undefined)
      targetCase.assignedJudge = caseAssignedJudge;

    await targetCase.save();
    return res.status(200).json({
      success: true,
      data: targetCase,
      message: 'Case Updated Successfully',
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Failed To Update Case ',
        error: err.message,
      });
    }
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Case number already exists',
        error: err.message,
      });
    }

    return res.status(500).json({
      sucess: false,
      message: 'Something went wrong on the server',
      error: err.message,
    });
  }
};

export const deleteCase = async (req, res) => {
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
    return res.status(500).json({
      sucess: false,
      message: 'Something went wrong on the server',
      error: err.message,
    });
  }
};
