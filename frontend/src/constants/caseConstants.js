export const STATUS_ORDER = ['Registered', 'In Hearing', 'Judgment', 'Closed'];

export const PARTY_ROLES = ['Plaintiff', 'Defendant', 'Witness'];

export const VALID_TRANSITIONS = {
  Registered: ['In Hearing'],
  'In Hearing': ['Judgment'],
  Judgment: ['Closed'],
  Closed: [],
};