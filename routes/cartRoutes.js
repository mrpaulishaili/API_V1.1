import express from "express";
const router = express.Router();
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authentication";

import {
  getAllCarts,
  getCurrentUserCart,
  createCart,
  updateCart,
} from "../controllers/orderController";

router
  .route("/")
  .post(authenticateUser, createCart)
  .get(authenticateUser, authorizePermissions("admin"), getAllCarts);

router
  .route("/:id")
  .get(authenticateUser, getCurrentUserCart)
  .patch(authenticateUser, updateCart);

export default router;
