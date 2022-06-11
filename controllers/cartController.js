import Cart from "../models/Cart";
import Product from "../models/Product";
import { StatusCodes } from "http-status-codes";
import CustomError from "../errors";
import { checkPermissions } from "../utils";

//HEAD          ADD PRODUCTS TO THE CART            //
export const addToCart = async (req, res) => {
  const { products } = req.body;
  if (!products) {
    throw new CustomError.BadRequestError("no product provided");
  }
  const cart = await Cart.findOne({ user: req.user.userId }).populate(
    "product"
  );
  cart.products.push(...products);
  await cart.save();
  res.status(StatusCodes.OK).json({ cart });
};

//HEAD:           GET ALL CART --specific for the admin--         //
export const getAllCarts = async (req, res) => {
  const cart = await Cart.find()
    .select()
    .sort("-total")
    .populate({
      path: "user",
      select: "username role profileImg",
    })
    .populate("products");
  res.status(StatusCodes.OK).json({ count: cart?.length, cart });
};

//HEAD:       GET LOGGED IN USER'S CART   --only for logged in user and admin--   //
export const getCurrentUserCart = async (req, res) => {
  const { id: cartId } = req.params;
  const cart = await Cart.findOne({ user: req.user.userId }).populate({
    path: "user",
    select: "username profileImg",
  });
  if (!cart) {
    throw new CustomError.NotFoundError(`No cart with id ${cartId}`);
  }
  res.status(StatusCodes.OK).json({ cart });
};

//HEAD:         EMPTY CART          //
//!clear cart
export const clearCart = async (req, res) => {
  await Cart.findOne({ user: req.userId });
  checkPermissions(req.user, cart.userId);
  cart.products = [];
  await cart.save();
  res.status(StatusCodes.OK).json({ msg: "cart cleared ❗" });
};

export const getAUserCart = async (req, res) => {
  const { id: cartId } = req.params;
  const { userId, role } = req.user;

  if (role === "user") {
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "user",
      select: "username profileImg",
    });
    return res.status(StatusCodes.OK).json({ cart });
  }
  const cart = await Cart.findOne({ _id: cartId }).populate({
    path: "user",
    select: "username profileImg",
  });
  if (!cart) {
    throw new CustomError.NotFoundError(`No cart with id ${cartId}`);
  }
  res.status(StatusCodes.OK).json({ cart });
};
