import mongoose from 'mongoose';

const SingleWislistItemSchema = mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },

  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true,
  },
});

const WislistSchema = mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.objectId,
      ref: 'User',
      required: true,
    },
    products: [SingleWislistItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model('Whislist', WislistSchema);
