
export const validTransitions = {
  Registered: ['In Hearing'],
  'In Hearing': ['Judgment'],
  Judgment: ['Closed'],
  Closed: [],
};