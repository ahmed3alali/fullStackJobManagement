import { StatusCodes } from "http-status-codes";
import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import { UnauthenticatedError } from "../errors/customErrors.js";
import { comparePassword } from "../utils/passwordUtils.js";
import { createJWT } from "../utils/tokenUtils.js";

export const register = async (req, res) => {
    try {
        const isFirstAccount = await User.countDocuments() === 0;
        req.body.role = isFirstAccount ? 'admin' : 'user';

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        const user = await User.create(req.body);
        res.status(StatusCodes.CREATED).json({ msg: 'User created', userId: user._id });
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Error creating user', error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        // Find the user by email
        const user = await User.findOne({ email: req.body.email });

        if (!user) throw new UnauthenticatedError('Invalid user');

        // Compare the provided password with the stored hashed password
        const isPasswordCorrect = await comparePassword(req.body.password, user.password);
        if (!isPasswordCorrect) throw new UnauthenticatedError('Wrong password!');

        // Create a token
        const token = createJWT({ userId: user._id, role: user.role });

        // Set the token in a cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set to true in production for secure cookies
            maxAge: 1000 * 60 * 60 * 24, // Cookie expiration time (1 day)
        });

        res.status(StatusCodes.OK).json({ msg: 'User logged in', userId: user._id });
    } catch (error) {
        if (error instanceof UnauthenticatedError) {
            res.status(StatusCodes.UNAUTHORIZED).json({ msg: error.message });
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: 'Error logging in', error: error.message });
        }
    }
};



export const logout= (req,res)=>  {

    res.cookie('token','logout', {


httpOnly:true,
expires:new Date(Date.now()),



    });

    res.status(StatusCodes.OK).json({msg:"User logged out!"});




}
