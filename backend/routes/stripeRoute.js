
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Stripe =require('stripe')
require('dotenv').config();

const stripeSecret = new Stripe(process.env.SECRET_KEY);

router.post('/create', async (req, res) => {
    const total = req.query.total;
    console.log(total)
    try {
        const paymentIntent = await stripeSecret.paymentIntents.create({
            amount: total,
            currency: "inr",
        });
        res.status(201).send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error(error);
    }
});

module.exports = router;
