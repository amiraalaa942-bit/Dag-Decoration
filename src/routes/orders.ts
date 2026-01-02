import express from "express";
import nodemailer from 'nodemailer';
import { text } from "stream/consumers";


const router = express.Router();
const EmailCredentials = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, 
  requireTLS: true,
  auth: {
    user: process.env.UserMail,
    pass: process.env.UserPassword
  },
  tls: {
    ciphers: 'SSLv3'
  }
});



router.post('/send-order', async (req, res) => {
  try {
    const { order ,from, subject} = req.body;
    const text = `📦 ORDER RECEIVED:
    Order Items:
    ${order.cart.items.map((item:any,index:any) => 
      
      `
      ${index+1}. Name: ${item.picname} 
      Price: ${item.price} 
      Size: ${item.height} x ${item.width}
      quantity: ${item.quantity}
      
      `
    ).join('\n')}
    Total Payment: ${order.cart.TotalAmount}
    Client Details:
    Name: ${order.checkout.checkoutData.customer.name} 
    Phone: ${order.checkout.checkoutData.customer.phone} 
    Location: ${order.checkout.checkoutData.customer.location}            
    `
    console.log("mail:",process.env.UserMail)
    
    if (!order) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid order data' 
      });
    }
     const mailOptions = {
      from: from,
      to: process.env.UserMail ,
      subject: subject,
      text:text
    };
    
    await EmailCredentials.sendMail(mailOptions);
    res.json({ 
      success: true, 
      message: 'Order processed successfully',
      orderCount: order.length
    });
  } catch (error) {
    console.error('❌ Order processing failed:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Order processing failed',
    });
  }
});

export default router;
