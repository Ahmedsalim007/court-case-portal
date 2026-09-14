const nameRegex = /^[A-Za-z\u0600-\u06FF\s.\-']+$/;

export function validateCaseForm({ parties, hearingDate, assignedJudge }, t) {
  if (parties.length === 0 || parties.some((p) => !p.name.trim())) {
    return t('caseForm.partyNameRequired');
  }
  if (parties.some((p) => !nameRegex.test(p.name.trim()))) {
    return t('caseForm.partyNameLetters');
  }
  const hasPlaintiff = parties.some((p) => p.role === 'Plaintiff');
  const hasDefendant = parties.some((p) => p.role === 'Defendant');
  if (!hasPlaintiff || !hasDefendant) {
    return t('caseForm.plaintiffDefendantRequired');
  }
  if (!hearingDate) {
    return t('caseForm.hearingDateRequired');
  }
  if (!assignedJudge.trim()) {
    return t('caseForm.judgeRequired');
  }
  if (!nameRegex.test(assignedJudge.trim())) {
    return t('caseForm.judgeLetters');
  }
  return null;
}