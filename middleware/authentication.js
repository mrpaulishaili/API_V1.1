import CustomError from "../errors";
import { isTokenValid } from "../utils";

export const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }

  try {
    const { username, userId, role } = isTokenValid({ token });
    req.user = { username, userId, role };
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }
};

export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        "Unauthorized to access this route"
      );
    }
    next();
  };
};
