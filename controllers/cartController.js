import Cart from "../models/Cart";
import Product from "../models/Product";

import { StatusCodes } from "http-status-codes";
import CustomError from "../errors";
import { checkPermissions } from "../utils";

export const createCart = async (req, res) => {
  const { product: productId } = req.body;

  const isValidProduct = await Product.findOne({ _id: productId });

  if (!isValidProduct) {
    throw new CustomError.NotFoundError(`No product with id : ${productId}`);
  }-

  const alreadySubmitted = await Cart.findOne({
    product: productId,
    user: req.user.userId,
  });

  if (alreadySubmitted) {
    throw new CustomError.BadRequestError(
      "Already submitted review for this product"
    );
  }

  req.body.user = req.user.userId;
  const review = await Cart.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};
export const getAllCarts = async (req, res) => {
  const reviews = await Cart.find({}).populate({
    path: "product",
    select: "name company price",
  });

  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};
export const getSingleCart = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Cart.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }

  res.status(StatusCodes.OK).json({ review });
};

export const updateCart = async (req, res) => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;

  const review = await Cart.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }

  checkPermissions(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();
  res.status(StatusCodes.OK).json({ review });
};
export const deleteCart = async (req, res) => {
  const { id: reviewId } = req.params;

  const review = await Cart.findOne({ _id: reviewId });

  if (!review) {
    throw new CustomError.NotFoundError(`No review with id ${reviewId}`);
  }

  checkPermissions(req.user, review.user);
  await review.remove();
  res.status(StatusCodes.OK).json({ msg: "Success! Cart removed" });
};

export const getSingleProductCarts = async (req, res) => {
  const { id: productId } = req.params;
  const reviews = await Cart.find({ product: productId });
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};
