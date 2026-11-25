import { User } from '../models/user.js';
import type { Request, Response, NextFunction } from 'express';
import type { ErrorWithContext } from '../types/Error.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';




export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    const secret = process.env.JWT_SECERT;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }
    const token = jwt.sign(
      {
        id: user._id,
        fullName: user.fullName,
        employeeId: user.employeeId,
        role: user.role,
      },
      secret,
      { expiresIn: '1d' }
    );

    return res.status(200).json({
      success: true,
      token,
      message: 'Login successful',
    });
  } catch (err) {
     const error: ErrorWithContext = err instanceof Error? err : new Error(String(err)); 
  
    error.context = "Login Failed";
    next(error);
  }
};
