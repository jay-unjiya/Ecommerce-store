const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes')
const authCheck = require('./routes/authCheck')
const userRoute = require('./routes/userRoute')
const orderRoute = require('./routes/orderRoutes')
const cartRoute = require('./routes/cartRoute')
const stripeRoute = require('./routes/stripeRoute')
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(cors())
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/check',authCheck)
app.use('/api',userRoute)
app.use('/api/orders',orderRoute)
app.use('/api/cart',cartRoute)
app.use('/api/payment',stripeRoute)



mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
