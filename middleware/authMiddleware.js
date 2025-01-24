import { UnauthenticatedError } from "../errors/customErrors.js";
import { verifyJWT } from "../utils/tokenUtils.js";

UnauthenticatedError




// Middleware to check user role
export const authorizePermissions = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
    console.log("error");
    }
    next();
  };
};

export const checkForTestUser = (req, res, next) => {
  if (req.user && req.user.userId === "test-user-id") {
    throw new BadRequestError("Test User. Read-only operation not allowed.");
  }
  next();
};

export const validateUpdateUserInput = (req, res, next) => {
  const { name, email } = req.body;

  if (!name || !email) {
    console.log("error");
  }

  // Add any additional validation logic here
  next();
};

export const authenticateUser = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new UnauthenticatedError('authentication invalid');
  }

  try {
    const { userId, role } = verifyJWT(token);
    req.user = { userId, role };
    next();
  } catch (error) {
    throw new UnauthenticatedError('authentication invalid');
  }
};



