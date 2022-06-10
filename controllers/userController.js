import User from "../models/User";
import { StatusCodes } from "http-status-codes";
import CustomError from "../errors";
import {
  createTokenUser,
  attachCookiesToResponse,
  checkPermissions,
} from "../utils";

//HEAD:         GET ALL USERS           //
export const getAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ count: users.length, users });
};

//HEAD:         GET A SINGLE USER             //
export const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");
  if (!user) {
    throw new CustomError.NotFoundError(`No user with id : ${req.params.id}`);
  }
  res.status(StatusCodes.OK).json({ user });
};

//HEAD:         SHOW LOGGED IN USER            //
export const showCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

//HEAD:         UPDATE USER PROFILE            //
//* update user with user.save()
export const updateUser = async (req, res) => {
  if (!req.body) {
    throw new CustomError.BadRequestError(
      "Please provide all necessary values"
    );
  }
  const user = await User.findOneAndUpdate({ _id: req.user.userId }, req.body, {
    new: true,
    runValidate: true,
  }).select("username email role");

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};
export const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new CustomError.BadRequestError("Please provide both values");
  }
  const user = await User.findOne({ _id: req.user.userId });

  const isPasswordCorrect = await user.comparePassword(oldPassword);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }
  if (newPassword === oldPassword) {
    throw new CustomError.BadRequestError("you have used this password before");
  }
  user.password = newPassword;

  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Success! Password Updated." });
};

// update user with findOneAndUpdate
// const updateUser = async (req, res) => {
//   const { email, name } = req.body;
//   if (!email || !name) {
//     throw new CustomError.BadRequestError('Please provide all values');
//   }
//   const user = await User.findOneAndUpdate(
//     { _id: req.user.userId },
//     { email, name },
//     { new: true, runValidators: true }
//   );
//   const tokenUser = createTokenUser(user);
//   attachCookiesToResponse({ res, user: tokenUser });
//   res.status(StatusCodes.OK).json({ user: tokenUser });
// };
