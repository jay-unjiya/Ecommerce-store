const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter using your email service credentials
const transporter = nodemailer.createTransport({
  service: 'gmail', // Replace with your email service
  auth: {
    user: process.env.EMAIL, // Your email address
    pass: process.env.PASS, // Your email password or app-specific password
  },
});


const generateEmailHTML = (userName, totalPrice, cartItems) => {
    const cartItemsList = cartItems
      .map(item => `<li>${item.name} - ${item.quantity} x ${item.price}</li>`)
      .join('');
    return `
      <html>
        <body>
          <h1>Order Confirmation</h1>
          <p>Hello ${userName},</p>
          <p>Your order has been successfully placed. Below are the details:</p>
          <ul>
            ${cartItemsList}
          </ul>
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
  

app.post('/send-confirmation-email', (req, res) => {
  const { userEmail, userName, totalPrice, cartItems } = req.body;
  sendConfirmationEmail(userEmail, userName, totalPrice, cartItems);
  res.status(200).send('Email sent successfully');
});
