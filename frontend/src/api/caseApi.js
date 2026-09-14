import axiosInstance from './axiosIntance';

const getCases = ({ status, judge, search, fromDate, toDate, page, limit } = {}) => {
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (judge) params.append('judge', judge);
  if (search) params.append('search', search);
  if (fromDate) params.append('fromDate', fromDate);
  if (toDate) params.append('toDate', toDate);
  if (page) params.append('page', page);
  if (limit) params.append('limit', limit);
  return axiosInstance.get(`/cases/getCases?${params.toString()}`);
};

const getCaseByCaseNum = (caseNum) =>
  axiosInstance.get(`/cases/getCase/${caseNum}`);

const createCase = ({ caseParties, caseHearingDate, caseAssignedJudge }) =>
  axiosInstance.post('/cases/createCase', {
    caseParties,
    caseHearingDate,
    caseAssignedJudge,
  });

const updateCase = (caseNum, { caseParties, caseHearingDate, caseAssignedJudge, status } = {}) =>
  axiosInstance.put(`/cases/updateCase/${caseNum}`, {
    caseParties,
    caseHearingDate,
    caseAssignedJudge,
    status,
  });

const deleteCase = (caseNum) =>
  axiosInstance.delete(`/cases/deleteCase/${caseNum}`);

export const caseApi = {
  getCases,
  getCaseByCaseNum,
  createCase,
  updateCase,
  deleteCase,
};