import mongoose from "mongoose";

const WislistSchema = mongoose.Schema(
  {
    userID: {
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

export default mongoose.model("Whislist", WislistSchema);
