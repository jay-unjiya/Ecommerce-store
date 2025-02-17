const express = require('express');
const authCheck = require('../middleware/adminAuth');
const router = express.Router();
const User = require('../models/userModel');
const Product = require('../models/productModel')
const Order = require('../models/orderModel')
const bcrypt = require('bcrypt');
const saltRounds = 12;

router.post('/profile', async (req, res) => {
    const userId = req.body.id;
    try {
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found', success: false });
        }
        res.status(200).json({ message: 'Profile data received', success: true, user: existingUser });
    } catch (err) {
        res.status(500).json({ message: 'Server error', success: false });
    }
});
router.get('/user', async (req, res) => {
    try {
        const users = await User.find({}, { _id: 0, firstName: 1, lastName: 1, email: 1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error', success: false });
    }
});

router.get('/product', async (req, res) => {
    const { category } = req.query;
    console.log({category})
    try {
        let query = {};
        if (category && category !== 'all') {
            query.category = category;
        }

        const products = await Product.find(query, { _id: 1, title: 1, image: 1, price: 1, description: 1, brand: 1, model: 1, color: 1, category: 1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error', success: false });
    }
});


router.get('/orders', async (req, res) => {
    try {
      const orders = await Order.find().populate('products.productId');
      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ success: false, message: 'Error fetching orders', error });
    }
  });

router.get('/categories', async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error', success: false });
    }
});


router.post('/addCategory', async (req, res) => {
    try {
        const {name} = req.body;
        console.log(req.body)
        if (!name) {
            return res.status(400).send("Invalid details!");
        }
        const newCategory = new Product({category:name});
        await newCategory.save();
        return res.status(201).json({ success: true, data:await Product.distinct('category')});
    } catch (error) {
        return res.status(500).json({ message: 'Server error', success: false });
    }
});

router.get('/details', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const productCount = await Product.countDocuments();
        const orderCount = await Order.countDocuments();
        res.json({ userCount, productCount , orderCount});
    } catch (error) {
        console.error('Error fetching details:', error);
        res.status(500).json({ message: 'Server error', success: false });
    }
});


router.post('/addProduct', async (req, res) => {
    try {
        const { title, image, price, description, brand, model, color, category } = req.body;
        console.log(req.body)
        if (!title || !image || !price || !description || !brand || !model || !color || !category) {
            return res.status(400).send("Invalid details!");
        }

        const newProduct = new Product({ title, image, price, description, brand, model, color, category });
        await newProduct.save();
        return res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        // console.error(error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
});

router.post('/addUser', async (req, res) => {
    try {
        const { firstName, lastName, email, password} = req.body;
        console.log(req.body)
        if (!firstName || !lastName || !email || !password ) {
            return res.status(400).send("Invalid details!");
        }
            const hashedPassword = await bcrypt.hash(password, saltRounds);
        

        const newUser = new User({ firstName,lastName,email,password});
        await newUser.save();
        return res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', success: false });
    }
});

router.patch('/updateProduct/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found', success: false });
        }
        return res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
});

router.delete('/deleteProduct', async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).send("Invalid details!");
        }
        await Product.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error', success: false });
    }
});

module.exports = router;