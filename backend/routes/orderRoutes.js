const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');

router.post('/create', async (req, res) => {
  try {
    const { userId,totalPrice, cartItems } = req.body;
    console.log(req.body)
    const newOrder = new Order({
      userId,
      totalPrice,
      products: cartItems.map(item => ({
        productId: item._id,
        title: item.title,
        image: item.image,
        price: item.price,
        description: item.description,
        brand: item.brand,
        model: item.model,
        color: item.color,
        category: item.category,
        quantity: item.quantity
      }))
    });

    await newOrder.save();

    res.status(201).json({ success: true, message: 'Order placed successfully' });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ success: false, message: 'Failed to place order' });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId)
    const orders = await Order.find({ userId });

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch user orders' });
  }
});


router.get('/orderDetails/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const orderCount = await Order.countDocuments({userId})
    console.log(orderCount)
    res.status(200).json(orderCount);
  } catch (error) {
    console.error('Error fetching  order count:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch order count' });
  }
});



module.exports = router;