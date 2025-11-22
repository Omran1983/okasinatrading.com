const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Setup your SMTP transport (Gmail example—enable App Passwords!)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yourbusiness@gmail.com',
    pass: 'your-app-password' // Use Gmail App Password, NOT your normal password!
  }
});

app.post('/api/order-email', async (req, res) => {
  const { to, subject, text } = req.body;
  try {
    await transporter.sendMail({
      from: '"OKASINA" <yourbusiness@gmail.com>',
      to, subject, text
    });
    res.json({ status: 'ok' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(5051, () => console.log("Email API on :5051"));
