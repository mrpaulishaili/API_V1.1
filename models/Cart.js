import mongoose from "mongoose";
const SingleCartItemSchema = mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },

  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
    required: true,
  },
});

const CartSchema = mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.objectId,
      ref: "User",
      required: true,
    },
    products: [SingleCartItemSchema],
    total: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Cart", CartSchema);
