import express from 'express';
import { getAllJobs, createJob,

    getJob,updateJob


 } from '../controllers/jobController.js'; // Adjust the import path if necessary

import { validateJobInput,validateIdParam } from '../middleware/validationMiddleware.js';






const router = express.Router();

// Define routes
router.route('/').get(getAllJobs).post(validateJobInput ,createJob); // Handle GET and POST requests
router.route('/:id').get(validateIdParam,getJob).patch(validateJobInput,validateIdParam, updateJob);

export default router;
 

