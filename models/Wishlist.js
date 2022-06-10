import mongoose from "mongoose";

const WislistSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.objectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: mongoose.Schema.objectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Wishlist", WislistSchema);
