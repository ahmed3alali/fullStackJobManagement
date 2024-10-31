// middleware/authMiddleware.js
import { UnauthenticatedError } from '../errors/customErrors.js'; // Ensure this path is correct
import { verifyJWT } from '../utils/tokenUtils.js';

export const authenticateUser = async (req, res, next) => {
  const { token } = req.cookies;
  console.log('Token:', token); // Log the token for debugging
  if (!token) {
    throw new UnauthenticatedError('authentication invalid');
  }

  try {
    const { userId, role } = verifyJWT(token);
    req.user = { userId, role };
    next();
  } catch (error) {
    console.error('Token verification failed:', error); // Log the error for debugging
    throw new UnauthenticatedError('authentication invalid');
  }
};
