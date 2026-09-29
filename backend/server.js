import app from './app.js';
import dotenv from 'dotenv';
dotenv.config();
import { dbConnection } from './config/dbConnection.js';

const PORT = process.env.PORT || 5000;

try {
  await dbConnection();
  app.listen(PORT, () => {
    console.log(`\n Server running on port ${PORT}`);
    console.log(` API: http://localhost:${PORT}/api/CasePortal'`);
  });
} catch (err) {
  console.error('Failed to connect to the dataBase', err.message);
  process.exit(1);
}
