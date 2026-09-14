

export function validateParties(caseParties) {
  if (!Array.isArray(caseParties)) {
    return 'caseParties must be an array';
  }
  const allValid = caseParties.every(
    (p) => p && typeof p === 'object' && typeof p.role === 'string'
  );
  if (!allValid) {
    return 'Each party must be an object with a role';
  }
  const hasPlaintiff = caseParties.some((p) => p.role === 'Plaintiff');
  const hasDefendant = caseParties.some((p) => p.role === 'Defendant');
  if (!hasPlaintiff || !hasDefendant) {
    return 'A case requires at least one Plaintiff and one Defendant';
  }
  return null;
}


export function validateHearingDateNotPast(hearingDate) {
  const date = new Date(hearingDate);
  if (isNaN(date.getTime())) {
    return 'Hearing date is not a valid date';
  }
  if (date < new Date(new Date().toDateString())) {
    return 'Hearing date cannot be in the past';
  }
  return null;
}

export function validateHearingDateEditable(currentStatus) {
  if (currentStatus !== 'Registered') {
    return 'Hearing date cannot be changed once the case has moved past Registered';
  }
  return null;
}