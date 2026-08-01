
import express from 'express';
import dotenv from 'dotenv';
import caseApi from './routes/case.route.js';
dotenv.config();
import { dbConnection  } from './config/dbConnection.js';
import { errorHandler } from './middlewares/errorHandler.middleware.js';

const app = express();
app.use(express.json())
app.use('/api/CasePortal', caseApi)
app.use(errorHandler);



const PORT = process.env.PORT||5000;
  await dbConnection();
app.listen(PORT, ()=> { 
  
    console.log(`\n Server running on port ${PORT}`)
    console.log(` API: http://localhost:${PORT}/api/CasePortal'`);
});


