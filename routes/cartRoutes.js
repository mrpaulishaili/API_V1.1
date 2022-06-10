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
  getAUserCart,
} from "../controllers/cartController";

router
  .route("/")
  .delete(authenticateUser, clearCart)
  .patch(authenticateUser, addToCart)
  .get(authenticateUser, getCurrentUserCart);
router
  .route("/allCart")
  .get(authenticateUser, authorizePermissions("admin"), getAllCarts);

router.route("/:id").get(authenticateUser, getAUserCart);

export default router;
