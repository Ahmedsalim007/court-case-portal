import type { CaseStatus } from "../types/case.js";

export const validTransitions: Record<CaseStatus, CaseStatus[]> = {
  Registered: ["In Hearing"],
  "In Hearing": ["Judgment"],
  Judgment: ["Closed"],
  Closed: [],
};