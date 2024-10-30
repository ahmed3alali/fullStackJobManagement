import 'express-async-errors';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();
import express from 'express';
const app = express();
import morgan from 'morgan';
import mongoose from 'mongoose'; // Ensure mongoose is imported
import jobRouter from './routes/jobRouter.js'; // Make sure this path is correct
import authRouter from './routes/authRouter.js';


// Middleware


import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
 import {authenticateUser} from './middleware/authMiddleware.js'
 app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Use the job router for job-related routes
app.use('/api/v1/jobs', authenticateUser,jobRouter); // Ensure this line is correct
app.use('/api/v1/auth',authenticateUser, authRouter);




/// get a single job

app.get('/api/v1/jobs/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: `Invalid job ID: ${id}` });
    }

    // Query MongoDB for the job by ID
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ msg: `No job found with ID ${id}` });
    }

    res.status(200).json({ job });
  } catch (error) {
    console.error('Error occurred:', error); // Log the full error to see what's wrong
    res.status(500).json({ msg: 'Server error', error: error.message || error });
  }
});



app.patch('/api/v1/jobs/:id', async (req,res) =>{

const {company,position} = req.body;
if (!position) {
  

return res.status(400).json({msg:'please provide company and position'});

}
const { id } = req.params;

try {
  // Check if the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: `Invalid job ID: ${id}` });
  }

  // Query MongoDB for the job by ID
  const job = await Job.findById(id);

  if (!job) {
    return res.status(404).json({ msg: `No job found with ID ${id}` });
  }

  res.status(200).json({ job });
} catch (error) {
  console.error('Error occurred:', error); // Log the full error to see what's wrong
  res.status(500).json({ msg: 'Server error', error: error.message || error });
}


job.company = company;
job.position = position;
res.status(200).json({msg:'job modified',job})


});


const port = process.env.PORT || 5173;




try {

  await mongoose.connect(process.env.MONGO_URL)
  app.listen(port,()=> {
    console.log(`Server running on PORT ${port}`);



  })
  
} catch (error) {
  console.log(error);
  process.exit(1);
}




