import User from "../models/User";
import Cart from "../models/Cart";
import StatusCodes from "http-status-codes";
import CustomError from "../errors";
import { attachCookiesToResponse, createTokenUser } from "../utils";

//HEAD: REGISTER A USER   //
export const register = async (req, res) => {
  const { email, username, password } = req.body;

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new CustomError.BadRequestError("Email already exists");
  }
  const nameAlreadyExists = await User.findOne({ username });
  if (nameAlreadyExists) {
    throw new CustomError.BadRequestError("username already exists");
  }

  //*  first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({ username, email, password, role });
  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  await Cart.create({ user });
  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};

//HEAD: Login a user  //
export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("Please provide email and password");
  }

  //*validation
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new CustomError.UnauthenticatedError("Invalid Credentials");
  }

  const tokenUser = createTokenUser(user);
  attachCookiesToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};

//HEAD: LOGOUT  //
//!logout
export const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });
  res.status(StatusCodes.OK).json({ msg: "you logged out!" });
};
