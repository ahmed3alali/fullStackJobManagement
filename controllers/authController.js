
import { StatusCodes } from "http-status-codes";

import User from "../models/UserModel.js";

import bcrypt from "bcryptjs/dist/bcrypt.js";
import { UnauthenticatedError } from "../errors/customErrors.js";
import { comparePassword, hashPassword } from "../utils/passwordUtils.js";
import { createJWT } from "../utils/tokenUtils.js";





export const register = async(req,res) => {
const isFirstAccount =await User.countDocuments()===0

req.body.role = isFirstAccount?'admin':'user';

const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(req.body.password,salt);
req.body.password = hashedPassword;
const user = await User.create(req.body);
res.status(StatusCodes.CREATED).json({msg: 'user created'});


res.send('register');


};






export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new UnauthenticatedError('Please provide email and password');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials');
  }

  const token = createJWT({ userId: user._id, role: user.role });
  res
    .cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    .status(200)
    .json({ msg: 'Login successful', user: { name: user.name, email: user.email } });
};


export const logout = async (req, res) => {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0), // Immediately expire the cookie
    });
    res.status(StatusCodes.OK).json({ msg: 'User logged out successfully' });
  };
  