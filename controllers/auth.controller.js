import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const register = async (req, res, next) => {
  const { employeeId, password } = req.body;

  if (!employeeId || !password) {
    return res.status(400).json({
      success: false,
      message: 'Employee ID and password are required',
    });

    if (typeof employeeId !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Invalid request',
      });
    }
  }
  try {
    const existingUser = await User.findOne({ employeeId });

    if (existingUser) {
      return res.status(409).send({
        success: false,
        message: 'Id is already taken',
      });
    }
    const newUser = new User({ employeeId, password });
    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, employeeId: newUser.employeeId, role: newUser.role }, // paylood (never put password)
      process.env.JWT_SECERT,
      { expiresIn: '1d' }
    );
    return res.status(201).json({
      success: true,
      token,
      message: 'User registered successfully',
    });
  } catch (err) {
    err.context = 'Registration Faild';
    next(err);
  }
};

export const login = async (req, res, next) => {
  const { employeeId, password } = req.body;

  if (!employeeId || !password) {
    return res.status(400).json({
      success: false,
      message: 'Employee ID and password are required',
    });
  }
  if (typeof employeeId !== 'string' || typeof password !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Invalid request',
    });
  }

  try {
    const user = await User.findOne({ employeeId });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect employee ID or password',
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect employee ID or password',
      });
    }

    const token = jwt.sign(
      { id: user._id, employeeId: user.employeeId, role: user.role },
      process.env.JWT_SECERT,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      success: true,
      token,
      message: 'Login successful',
    });
  } catch (err) {
    err.context = 'Login Falied';
    next(err);
  }
};
