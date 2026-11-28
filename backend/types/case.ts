export type CaseStatus = "Registered" | "In Hearing" | "Judgment" | "Closed";
export type PartyRole = "Plaintiff" | "Defendant" | "Witness";
export type Party = { name: string; role: PartyRole };