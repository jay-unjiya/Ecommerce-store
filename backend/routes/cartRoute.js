const express = require('express');
const router = express.Router();
const Cart = require('../models/cartModel');
const mongoose = require('mongoose');

// Save Cart Items
router.post('/save', async (req, res) => {
    const { userId, items } = req.body;
    console.log("items",items)
    // console.log('Request to save cart:', { userId, items });
    try {
        const existingCart = await Cart.findOne({ userId });
        console.log("exicart",existingCart)
        const newItems = items.map(item => ({
            productId: new mongoose.Types.ObjectId(item.productId), 
            quantity: item.quantity
        }));
        console.log(newItems)

        if (existingCart) {
            existingCart.items = newItems
            await existingCart.save();
        } else {
            const newCart = new Cart({ userId, items: newItems });
            console.log(newCart)
            await newCart.save();
        }
        res.status(200).json({ success: true, message: 'Cart saved successfully' });
    } catch (error) {
        console.error('Error saving cart:', error); 
        res.status(500).json({ success: false, message: 'Error saving cart', error });
    }
});

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    console.log('Request to fetch cart:', { userId });
    try {
        const cart = await Cart.findOne({ userId })
        console.log(cart)
        if (cart) {
            res.status(200).json({ success: true, cart: cart.items });
        } else {
            console.log("hhii")
            res.status(404).json({ success: false, message: 'Cart not found' });

        }
    } catch (error) {
        console.error('Error fetching cart:', error);  // Logging the error details
        res.status(500).json({ success: false, message: 'Error fetching cart', error });
    }
});

router.delete('/clear', async (req, res) => {
    const { userId } = req.body;
    try {
        await Cart.deleteMany({ userId: userId });
        res.status(200).json({ success: true, message: 'Cart deleted successfully' });
    } catch (error) {
        console.error('Error deleting cart:', error);
        res.status(500).json({ success: false, message: 'Error deleting cart', error });
    }
});

module.exports = router;
