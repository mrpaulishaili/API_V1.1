import express from "express";
const router = express.Router();
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authentication";

import {
  getAllCarts,
  getCurrentUserCart,
  addToCart,
  clearCart,
} from "../controllers/cartController";

router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin"), getAllCarts)
  .delete(authenticateUser, clearCart)

router
  .route("/:id")
  .get(authenticateUser, getCurrentUserCart)
  .patch(authenticateUser, addToCart);

export default router;
