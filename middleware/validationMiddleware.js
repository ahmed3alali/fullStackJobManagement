import { body, validationResult, param } from 'express-validator';
import { BadRequestError, NotFoundError } from '../errors/customErrors.js';
import { JOB_STATUS, JOB_TYPE } from '../utils/constants.js';
import mongoose from 'mongoose';
import Job from '../models/JobModel.js'
import User from '../models/UserModel.js';


// Helper function to handle validation errors
const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        if (errorMessages[0].startsWith('no job')) {
          throw new NotFoundError(errorMessages);
        }
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

// Validate job input fields
export const validateJobInput = withValidationErrors([
  body('company').notEmpty().withMessage('company is required'),
  body('position').notEmpty().withMessage('position is required'),
  body('jobLocation').notEmpty().withMessage('jobLocation is required'),
  body('jobStatus').isIn(Object.values(JOB_STATUS)).withMessage('invalid status value'),
  body('jobType').isIn(Object.values(JOB_TYPE)).withMessage('invalid type value'),
  
]);

// Validate the ID param



export const validateIdParam = withValidationErrors([

  param('id').custom(async(value)=>{

const isValidId = mongoose.Types.ObjectId.isValid(value);

if (!isValidId) {
  throw new BadRequestError('invalid MongoDB id');
}

if (!Job) {
  
  throw new NotFoundError("no job found with id you entered")


}



  })





]);



export const validateRegisterInput = withValidationErrors([
  body('name').notEmpty().withMessage('name is required'),
  body('email')
    .notEmpty().withMessage('email is required')
    .isEmail().withMessage('invalid email')
    .custom(async (email) => {
      try {
        const user = await User.findOne({ email });

        if (user) {
          throw new BadRequestError('email already exists!!');
        }
      } catch (error) {
        console.log('Error during email validation:', error); // Debug log


  


        console.log("check of the login sucess");
        
        

        throw error;

      }
    }),
  body('password')
    .notEmpty().withMessage('password is required')
    .isLength({ min: 8 }).withMessage('password must be at least 8 characters long'),
  body('location').notEmpty().withMessage('location is required'),
]);


export const validateLoginInput = withValidationErrors([

  body('email')
    .notEmpty().withMessage('email is required')
    .isEmail().withMessage('invalid email'),

  body('password')
    .notEmpty().withMessage('password is required')

]);


// Validate update user input
export const validateUpdateUserInput = withValidationErrors([
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('location').optional().notEmpty().withMessage('Location cannot be empty'),
]);