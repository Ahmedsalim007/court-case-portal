import { describe, it, expect } from 'vitest';
import { validTransitions } from './validTransitions.js';

describe('validTransitions', () => {
  it('allows Registered to In Hearing', () => {
    expect(validTransitions['Registered'].includes('In Hearing')).toBe(true);
  });

  it('allows In Hearing to Judgment', () => {
    expect(validTransitions['In Hearing'].includes('Judgment')).toBe(true);
  });

  it('allows Judgment to Closed', () => {
    expect(validTransitions['Judgment'].includes('Closed')).toBe(true);
  });

  it('rejects skipping a step (Registered to Judgment)', () => {
    expect(validTransitions['Registered'].includes('Judgment')).toBe(false);
  });

  it('rejects moving backwards (Closed to In Hearing)', () => {
    expect(validTransitions['Closed'].includes('In Hearing')).toBe(false);
  });

  it('Closed has no valid next transitions (terminal state)', () => {
    expect(validTransitions['Closed']).toEqual([]);
  });
});
