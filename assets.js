import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import Joi from 'joi';
import morgan from 'morgan';
import fs from 'fs';
import csv from 'fast-csv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected')).catch(err => console.log(err));

// Models
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['admin', 'applicant'], default: 'applicant' }
});
const User = mongoose.model('User', UserSchema);

const ApplicationSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: String,
  email: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now }
});
const Application = mongoose.model('Application', ApplicationSchema);

const LogSchema = new mongoose.Schema({
  action: String,
  userId: mongoose.Schema.Types.ObjectId,
  timestamp: { type: Date, default: Date.now }
});
const Log = mongoose.model('Log', LogSchema);

// Email Notification
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, text) => {
  await transporter.sendMail({ from: process.env.EMAIL, to, subject, text });
};

// Middleware
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access Denied' });
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

// Logging Middleware
const logAction = async (userId, action) => {
  await new Log({ userId, action }).save();
};

// Routes
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: 'Error registering user', error });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  await logAction(user._id, 'Logged in');
  res.json({ token });
});

app.get('/applications', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access Denied' });
  const applications = await Application.find();
  res.json(applications);
});

app.get('/dashboard', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access Denied' });
  const totalApplicants = await Application.countDocuments();
  const pending = await Application.countDocuments({ status: 'pending' });
  const approved = await Application.countDocuments({ status: 'approved' });
  res.json({ totalApplicants, pending, approved });
});

app.get('/export', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access Denied' });
  const applications = await Application.find();
  const csvStream = csv.format({ headers: true });
  res.setHeader('Content-Disposition', 'attachment; filename=applications.csv');
  res.setHeader('Content-Type', 'text/csv');
  csvStream.pipe(res);
  applications.forEach(app => csvStream.write(app));
  csvStream.end();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
