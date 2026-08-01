import mongoose from 'mongoose';
import dotenv from 'dotenv';
import {Case} from './models/case.js';
import { dbConnection } from './config/dbConnection.js';

dotenv.config();

const statuses = ['Registered', 'In Hearing', 'Judgment', 'Closed'];

const updateStatuses = async () => {
  try {
    await dbConnection();

    for (let i = 1; i <= 101; i++) {
      const num = String(i).padStart(4, '0');
      const caseNum = `CASE-2026-${num}`;
      const status = statuses[i % statuses.length];

      await Case.updateOne({ caseNum }, { $set: { status } });
    }

    console.log('All 101 cases updated with status');
    process.exit(0);
  } catch (err) {
    console.error('Status update failed:', err);
    process.exit(1);
  }
};

updateStatuses();