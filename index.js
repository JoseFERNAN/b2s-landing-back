const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
var cors = require('cors')

require('dotenv').config();

const app = express();

// configure middleware to parse request body as JSON
app.use(bodyParser.json());
app.use(cors())

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.SMTP_PW,
    }
});

transporter.verify((e) => {
    if (e) {
        console.log(e)
        return
    }
    console.log('smtp ready')
})

// configure endpoint to handle form submissions
app.post('/send-email', (req, res) => {
  const { name, subject, body, purpose, email } = req.body;

  // configure email message options
  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.RECIPIENT_EMAIL,
    subject: `Message from B2S landing page:${purpose}`,
    text: `Name: ${name}\nSubject: ${subject}\nEmail: ${email}\nPurpose: ${purpose}\nMessage: ${body}`
  };

  // send email using nodemailer
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Something went wrong');
    } else {
      console.log('Email sent: ' + info.response);
      res.send('Email sent successfully');
    }
  });
});

// start server
app.listen(8080, () => {
  console.log('Server is running on port 8080');
});