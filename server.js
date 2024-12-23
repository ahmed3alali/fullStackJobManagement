import 'express-async-errors';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();
import express from 'express';
const app = express();
import morgan from 'morgan';
import mongoose from 'mongoose'; // Ensure mongoose is imported
import jobRouter from './routes/jobRouter.js'; // Make sure this path is correct
import authRouter from './routes/authRouter.js';
import userRouter from './routes/userRouter.js';

// Middleware
import { authenticateUser } from './middleware/authMiddleware.js';
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());

// CORS configuration to allow requests from the frontend on port 5173
app.use(cors({
  origin: 'http://localhost:5173',  // Allow the frontend to access the backend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // Allow cookies (if using cookies for authentication)
}));

// Routes
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/api/v1/test', (req, res) => {
  res.json({ msg: 'test route' });
});

// Use the job router for job-related routes
app.use('/api/v1/jobs', authenticateUser, jobRouter);
app.use('/api/v1/users', authenticateUser, userRouter);
app.use('/api/v1/auth', authRouter);

// Get a single job
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

// Update a job
app.patch('/api/v1/jobs/:id', async (req, res) => {
  const { company, position } = req.body;
  if (!position) {
    return res.status(400).json({ msg: 'Please provide company and position' });
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

    job.company = company;
    job.position = position;
    await job.save(); // Save the updated job to the database

    res.status(200).json({ msg: 'Job modified', job });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ msg: 'Server error', error: error.message || error });
  }
});

const port = process.env.PORT || 5174;

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(port, () => {
    console.log(`Server running on PORT ${port}`);
  });
} catch (error) {
  console.log(error);
  process.exit(1);
}
