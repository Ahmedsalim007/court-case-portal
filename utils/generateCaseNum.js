import { Counter } from '../models/counter.js';

export const generateCaseNum = async () => {
  const year = new Date().getFullYear();

  const counter = await Counter.findOneAndUpdate(
    { _id: String(year) },
    { $inc: { seq: 1 } },
    { returnDocument: 'after', upsert: true }
  );

  const paddedSeq = String(counter.seq).padStart(4, '0');
  return `CASE-${year}-${paddedSeq}`;
};