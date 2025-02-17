const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      title: {
        type: String,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      brand: {
        type: String,
        required: true
      },
      model: {
        type: String,
        required: true
      },
      color: {
        type: String,
        required: true
      },
      category: {
        type: String,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ],
  orderDate: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
