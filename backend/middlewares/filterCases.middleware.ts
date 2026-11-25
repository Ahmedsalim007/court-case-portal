import type { Request, Response, NextFunction } from "express";
import type { CaseFilter } from "../types/caseFilter.js";

const asString = (value: unknown): string | undefined =>
  typeof value === "string" && value !== "" ? value : undefined;

export const filterCases = (req: Request, res: Response, next: NextFunction) => {
  const status = asString(req.query.status);
  const judge = asString(req.query.judge);
  const search = asString(req.query.search);
  const fromDate = asString(req.query.fromDate);
  const toDate = asString(req.query.toDate);

  const filter: CaseFilter = {};

  if (status) filter.status = status;
  if (judge) filter.assignedJudge = { $regex: judge, $options: "i" };
  if (search) filter.caseNum = { $regex: search, $options: "i" };
  if (fromDate || toDate) {
    filter.hearingDate = {};
    if (fromDate) filter.hearingDate.$gte = new Date(fromDate);
    if (toDate) filter.hearingDate.$lte = new Date(toDate);
  }

  req.caseFilter = filter;
  next();
};