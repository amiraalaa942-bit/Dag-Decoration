import { NextFunction } from 'express';
import type { Request, Response } from "express";
import jwt from 'jsonwebtoken'


export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });
  
  try {
    (req as any).user = jwt.verify(token, process.env.JWT_SecretKey!);
    next(); 
  } catch(error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};