
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





export const login = async(req,res) =>{

const user = await User.findOne({email:req.body.email})

if (!user) throw new UnauthenticatedError('invalid user')

const isPasswordCorrect = await comparePassword(req.body.password,user.password)


if(!isPasswordCorrect) throw new UnauthenticatedError('wrong password!')

    


const oneDay = 1000*60*60*24;

const token = createJWT({userId:user._id, role: user.role});
res.cookie('token',token,{


httpOnly:true,
expires: new Date(Date.now()+oneDay),
secure: process.env.NODE_ENV==='production'


})
res.status(StatusCodes.OK).json({msg:'user logged in '})

};