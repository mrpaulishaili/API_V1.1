import Cart from "../models/Cart";
import Product from "../models/Product";

import { StatusCodes } from "http-status-codes";
import CustomError from "../errors";
import { checkPermissions } from "../utils";

//create cart
export const createCart = async (req, res) => {
  const { userID } = req.user;
  req.body.userId = req.user.userId;
  const cartAlreadyExist = await Cart.findOne({ userId: req.body.userId });
  if (cartAlreadyExist) {
    throw new CustomError.BadRequestError("this User already have a cart");
  }

  const cart = await Cart.create(req.body);
  res.status(StatusCodes.CREATED).json({ cart });
};

//getAllCarts
export const getAllCarts = async (req, res) => {
  const cart = await Cart.find({}).sort("-total");
  res.status(StatusCodes.OK).json({ cart, count: cart.length });
};

//getSingleCarts
export const getCurrentUserCart = async (req, res) => {
  const { id: cartId } = req.params;
  const cart = await Cart.findOne({ _id: cartId });

  if (!cart) {
    const userCart = await Cart.findOne({ userId: req.user.userId });
    // console.log(
    // "🚀 ~ file: cartController.js ~ line 34 ~ getCurrentUserCart ~ userCart",
    // userCart
    // );
    if (!userCart) {
      throw new CustomError.NotFoundError(`No cart with id ${cartId}`);
    }
    res.status(StatusCodes.OK).json({ ...userCart._doc });
  } else {
    checkPermissions(req.user, cart.userId);
    res.status(StatusCodes.OK).json({ cart });
  }
};

export const updateCart = async (req, res) => {
  const cart = await Cart.findOneAndUpdate(
    { userID: req.params.id },
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );
  res.status(StatusCodes.OK).json({ cart });
};

// export const deleteAllCarts = async (req, res) => {
//   await Cart.deleteMany();
//   res.status(StatusCodes.OK).json({ msg: "success!!!" });
// };
