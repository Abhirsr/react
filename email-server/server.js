const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

// ✅ Allow frontend origin explicitly
app.use(cors({
  origin: "http://localhost:5173", // Allow frontend dev server
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true,
}));

// Middleware
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Email server running!');
});

app.post("/send-email", async (req, res) => {
  const { facultyEmail, studentName, regNo, from, to, submittedAt } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL,
      pass: process.env.APP,
    },
  });

  const mailOptions = {
    from: process.env.MAIL,
    to: "abhinavrsr04@gmail.com", // ✅ New hardcoded HOD email
    subject: `Medical Leave Forwarded - ${studentName}`,
    html: `
    <p><strong>Student:</strong> ${studentName}</p>
    <p><strong>Reg No:</strong> ${regNo}</p>
    <p><strong>From:</strong> ${from}</p>
    <p><strong>To:</strong> ${to}</p>
    <p><strong>Submitted At:</strong> ${submittedAt}</p>
    <p><strong>Forwarded by:</strong> ${facultyEmail}</p>
  `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent to HOD!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});
 
// Change from 5000 to something unused like 5050
const PORT = 5050;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
