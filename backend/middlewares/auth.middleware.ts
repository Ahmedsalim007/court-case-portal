import type { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): Response|undefined => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No token provided',
    });
  }
  const secert = process.env.JWT_SECERT;
  if (!secert) {
    throw new Error('Jwt_Secert is not defined');
  }

  try {
    const decoded = jwt.verify(token, secert); // it return either decoded user or string which is falsey here
    if (typeof decoded === 'string') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    req.user = {
      id: decoded.id,
      fullName: decoded.fullName,
      employeeId: decoded.employeeId,
      role: decoded.role,
    };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};
