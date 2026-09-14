import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import caseApi from './routes/index.route.js';
dotenv.config();
import { dbConnection } from './config/dbConnection.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  })
);

app.use(express.json());
app.use('/api/CasePortal', caseApi);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

try{
await dbConnection();
app.listen(PORT, () => {
  console.log(`\n Server running on port ${PORT}`);
  console.log(` API: http://localhost:${PORT}/api/CasePortal'`);
});

}
catch(err){
  console.error('Failed to connect to the dataBase', err.message)
  process.exit(1);
}

