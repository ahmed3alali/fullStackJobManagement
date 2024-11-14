import { StatusCodes } from 'http-status-codes';
import Job from '../models/JobModel.js';

// Get a single job by ID (MongoDB)
export const getJob = async (req, res) => {
  const { id } = req.params;

const job = await Job.findById(id);
res.status(StatusCodes.OK).json({job})



};



export const updateJob = async (req,res) => {

const {id} = req.params;

const updatedJob = await Job.findByIdAndUpdate(id,req.body,{

new:true

})





res.status(StatusCodes.OK).json({msg:'job modified',job:updatedJob});



};




// Get all jobs (MongoDB)
export const getAllJobs = async (req, res) => {
  console.log(req.user);
  const jobs = await Job.find({ createdBy: req.user.userId });
  res.status(StatusCodes.OK).json({ jobs });
};

// Create a new job (MongoDB)
export const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};


export const deleteJob = async (req,res) => {

const removedJob = await Job.findByIdAndDelete({msg: "Job has been succesfully deleted", job:removedJob})



}