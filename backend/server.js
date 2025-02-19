const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
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


app.get('/api', (req, res) => {
    res.json("hii there");
});

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL, 
      pass: process.env.PASS, 
    },
  });
  
  
  const generateEmailHTML = (userName, totalPrice, cartItems) => {
      
      return `
        <html>
          <body>
            <h1>Order Confirmation</h1>
            <p>Hello ${userName},</p>
            <p>Your order has been successfully placed. Below are the details:</p>
            <p><strong>Total Price:</strong> ${totalPrice}</p>
            <p>Thank you for shopping with us!</p>
          </body>
        </html>
      `;
    };
    
    const sendConfirmationEmail = (userEmail, userName, totalPrice, cartItems) => {
      const emailHTML = generateEmailHTML(userName, totalPrice, cartItems);
    
      const mailOptions = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: 'Order Confirmation',
        html: emailHTML,
      };
    
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    };
    
  
  app.post('/api/send-confirmation-email', (req, res) => {
    const { userEmail, userName, totalPrice, cartItems } = req.body;
    sendConfirmationEmail(userEmail, userName, totalPrice, cartItems);
    res.status(200).send('Email sent successfully');
  });
  




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
