import dotenv from 'dotenv';
import { Case } from './models/case.js';
import { User } from './models/user.js';
import { dbConnection } from './config/dbConnection.js';

dotenv.config();
const backfill = async () => {
  try {
    await dbConnection();

    const user = await User.findOne({ employeeId: '20021' });

    if (!user) {
      console.log('User with employeeId 20021 not found — register them first.');
      process.exit(1);
    }

    const result = await Case.updateMany(
      {},
      { $set: { createdBy: user._id, updatedBy: user._id } }
    );

    console.log(`Updated ${result.modifiedCount} cases — createdBy/updatedBy set to ${user.fullName}`);
    process.exit(0);
  } catch (err) {
    console.error('Backfill failed:', err);
    process.exit(1);
  }
};

backfill();