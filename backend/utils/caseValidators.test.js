import { describe, it, expect } from 'vitest';
import {
  validateParties,
  validateHearingDateNotPast,
  validateHearingDateEditable,
} from './caseValidators.js';

describe('validateParties', () => {
  it('returns null when there is one Plaintiff and one Defendant', () => {
    const parties = [
      { name: 'Ahmed', role: 'Plaintiff' },
      { name: 'Sara', role: 'Defendant' },
    ];
    expect(validateParties(parties)).toBeNull();
  });

  it('returns an error when caseParties is not an array', () => {
    expect(validateParties('not-an-array')).toBe('caseParties must be an array');
  });

  it('returns an error when a party has no role', () => {
    const parties = [{ name: 'Ahmed' }];
    expect(validateParties(parties)).toBe('Each party must be an object with a role');
  });

  it('returns an error when there is no Plaintiff', () => {
    const parties = [{ name: 'Sara', role: 'Defendant' }];
    expect(validateParties(parties)).toBe(
      'A case requires at least one Plaintiff and one Defendant'
    );
  });

  it('returns an error when there is no Defendant', () => {
    const parties = [{ name: 'Ahmed', role: 'Plaintiff' }];
    expect(validateParties(parties)).toBe(
      'A case requires at least one Plaintiff and one Defendant'
    );
  });

  it('returns an error for an empty parties array', () => {
    expect(validateParties([])).toBe(
      'A case requires at least one Plaintiff and one Defendant'
    );
  });

  it('allows an additional Witness alongside Plaintiff and Defendant', () => {
    const parties = [
      { name: 'Ahmed', role: 'Plaintiff' },
      { name: 'Sara', role: 'Defendant' },
      { name: 'Omar', role: 'Witness' },
    ];
    expect(validateParties(parties)).toBeNull();
  });
});

describe('validateHearingDateNotPast', () => {
  it('returns null for a future date', () => {
    const future = new Date();
    future.setDate(future.getDate() + 7);
    expect(validateHearingDateNotPast(future)).toBeNull();
  });

  it('returns null for today', () => {
    expect(validateHearingDateNotPast(new Date())).toBeNull();
  });

  it('returns an error for a past date', () => {
    const past = new Date();
    past.setDate(past.getDate() - 7);
    expect(validateHearingDateNotPast(past)).toBe('Hearing date cannot be in the past');
  });

  it('returns an error for an invalid date string', () => {
    expect(validateHearingDateNotPast('not-a-date')).toBe('Hearing date is not a valid date');
  });
});

describe('validateHearingDateEditable', () => {
  it('returns null when status is Registered', () => {
    expect(validateHearingDateEditable('Registered')).toBeNull();
  });

  it('returns an error when status is In Hearing', () => {
    expect(validateHearingDateEditable('In Hearing')).toBe(
      'Hearing date cannot be changed once the case has moved past Registered'
    );
  });

  it('returns an error when status is Judgment', () => {
    expect(validateHearingDateEditable('Judgment')).toBe(
      'Hearing date cannot be changed once the case has moved past Registered'
    );
  });

  it('returns an error when status is Closed', () => {
    expect(validateHearingDateEditable('Closed')).toBe(
      'Hearing date cannot be changed once the case has moved past Registered'
    );
  });
});
