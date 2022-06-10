import mongoose from "mongoose";

const CartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Cart", CartSchema);
