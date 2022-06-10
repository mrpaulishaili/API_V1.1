import Cart from "../models/Cart";
import Product from "../models/Product";
import { StatusCodes } from "http-status-codes";
import CustomError from "../errors";
import { checkPermissions } from "../utils";

//HEAD:           GET ALL CART --specific for the admin--         //
export const getAllCarts = async (req, res) => {
  const cart = await Cart.find({})
    .sort("-total")
    .populate("User", { strictPopulate: "false" });
  res.status(StatusCodes.OK).json({ cart, count: cart.length });
};

//HEAD:       GET LOGGED IN USER'S CART   --only for logged in user and admin--
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

//HEAD          ADD PRODUCTS TO THE CART
export const addToCart = async (req, res) => {
  const { product } = req.body;
  if (!product) {
    throw new CustomError.BadRequestError("no product provided");
  }
  const cart = await Cart.findOneAndUpdate({ userID: req.params.id }, product, {
    runValidators: true,
    new: true,
  });
  res.status(StatusCodes.OK).json({ cart });
};

export const clearCart = async (req, res) => {
  await Cart.findOne({ user: req.userId });
  checkPermissions(req.user, cart.userId);
  cart.products = [];
  await cart.save();
  res.status(StatusCodes.OK).json({ msg: "cart cleared ❗" });
};
