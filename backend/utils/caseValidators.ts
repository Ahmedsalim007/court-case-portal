type PartyLike = { role: string };

const isParty = (p: unknown): p is PartyLike => // p is partylike mean if it is true then it is partlike type
  typeof p === "object" &&
  p !== null &&
  "role" in p &&
  typeof p.role === "string";

export function validateParties(caseParties: unknown): string | null {
  if (!Array.isArray(caseParties)) {
    return "caseParties must be an array";
  }
  if (!caseParties.every(isParty)) {
    return "Each party must be an object with a role";
  }
  const hasPlaintiff = caseParties.some((p) => p.role === "Plaintiff");
  const hasDefendant = caseParties.some((p) => p.role === "Defendant");
  if (!hasPlaintiff || !hasDefendant) {
    return "A case requires at least one Plaintiff and one Defendant";
  }
  return null;
}

export function validateHearingDateNotPast(
  hearingDate: string | number | Date
): string | null {
  const date = new Date(hearingDate);
  if (isNaN(date.getTime())) {
    return "Hearing date is not a valid date";
  }
  if (date < new Date(new Date().toDateString())) {
    return "Hearing date cannot be in the past";
  }
  return null;
}

export function validateHearingDateEditable(currentStatus: string): string | null {
  if (currentStatus !== "Registered") {
    return "Hearing date cannot be changed once the case has moved past Registered";
  }
  return null;
}