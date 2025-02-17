const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Admin = require('../models/AdminModel')
const bcrypt = require('bcrypt');
const saltRounds = 12;

require('dotenv').config()

router.post('/signup', async function (req, res, next) {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(400).send("Invalid details!");
    return;
  }

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      res.status(400).send("User already exists! Login or choose another user id.");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    await newUser.save();

    let token;
    try {
      token = jwt.sign({
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email
      }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.cookie('token', token, { httpOnly: true });

      res.status(201).json({
        success: true,
        data: {
          id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          token: token
        }
      });

    } catch (err) {
      const error = new Error("Error! Something went wrong.");
      return next(error);
    }
  } catch (err) {
    console.error('Error finding or saving details', err);
    res.status(500).send('Error finding or saving details');
  }
});

router.post('/login', async function (req, res, next) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Please enter all values!");
  }

  try {
    const admin = await Admin.findOne({ email });
    if (admin ) {
      if (password === admin.password) {
        const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ success: true, role: 'admin', data: {token } });
      } else {
        return res.status(400).json({ success: false, message: 'Invalid credentials for admin' });
      }
    }

    const user = await User.findOne({ email });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = jwt.sign({
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.cookie('token', token, { httpOnly: true });

        return res.status(200).json({
          success: true,
          role: 'user',
          data: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            token: token
          }
        });
      } else {
        return res.status(400).json({ success: false, message: 'Invalid credentials for user' });
      }
    } else {
      return res.status(400).json({ success: false, message: 'User not found' });
    }
  } catch (err) {
    return res.status(500).send('Error processing request');
  }
});

module.exports = router;
