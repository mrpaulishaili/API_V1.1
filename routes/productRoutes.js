import express from "express";
const router = express.Router();
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authentication";

import {
  addProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} from "../controllers/productController";

import { getSingleProductReviews } from "../controllers/reviewController";

// http://localhost:8080/api/v1/products
router
  .route("/")
  .post([authenticateUser, authorizePermissions("admin")], addProduct)
  .get(getAllProducts);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch([authenticateUser, authorizePermissions("admin")], updateProduct)
  .delete([authenticateUser, authorizePermissions("admin")], deleteProduct);
uploadImage;
router.route("/:id/reviews").get(getSingleProductReviews);
router.route("/upload").post(uploadImage);

export default router;
