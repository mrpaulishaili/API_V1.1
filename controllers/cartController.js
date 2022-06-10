import Cart from "../models/Cart";
import Product from "../models/Product";

import { StatusCodes } from "http-status-codes";
import CustomError from "../errors";
import { checkPermissions } from "../utils";

//getAllCarts
export const getAllCarts = async (req, res) => {
  const cart = await Cart.find({})
    .sort("-total")
    .populate("User", { strictPopulate: "false" });
  res.status(StatusCodes.OK).json({ cart, count: cart.length });
};

//getSingleCarts
export const getCurrentUserCart = async (req, res) => {
  const { id: cartId } = req.params;
  const cart = await Cart.findOne({ _id: cartId });

  if (!cart) {
    const userCart = await Cart.findOne({ userId: req.user.userId });
    if (!userCart) {
      throw new CustomError.NotFoundError(`No cart with id ${cartId}`);
    }
    res.status(StatusCodes.OK).json({ ...userCart._doc });
  } else {
    checkPermissions(req.user, cart.userId);
    res.status(StatusCodes.OK).json({ cart });
  }
};

export const addToCart = async (req, res) => {
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

export const clearCart = async (_req, res) => {
  await Cart.c().where("products").gte(1);
  res.status(StatusCodes.OK).json({ msg: "cart cleared ❗" });
};
