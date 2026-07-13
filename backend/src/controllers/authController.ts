import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AUTH_CONFIG } from '../config/auth';
import { registerSchema, loginSchema } from '../validators/authSchema';

const generateTokens = (userId: string, email: string, role: string) => {
  const accessToken = jwt.sign({ userId, email, role }, AUTH_CONFIG.ACCESS_TOKEN_SECRET, {
    expiresIn: AUTH_CONFIG.ACCESS_TOKEN_EXPIRY,
  });

  const refreshToken = jwt.sign({ userId }, AUTH_CONFIG.REFRESH_TOKEN_SECRET, {
    expiresIn: AUTH_CONFIG.REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body);
    
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      res.status(409).json({ error: 'User with this email already exists' });
      return;
    }

    const user = await User.create({
      email: validatedData.email,
      password: validatedData.password,
      username: validatedData.username,
    });

    const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.email, user.role);

    res.cookie(AUTH_CONFIG.COOKIE_NAME, refreshToken, AUTH_CONFIG.COOKIE_OPTIONS);
    res.status(201).json({ accessToken, user });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      res.status(400).json({ error: err.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isMatch = await user.comparePassword(validatedData.password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const { accessToken, refreshToken } = generateTokens(user._id.toString(), user.email, user.role);

    res.cookie(AUTH_CONFIG.COOKIE_NAME, refreshToken, AUTH_CONFIG.COOKIE_OPTIONS);
    res.status(200).json({ accessToken, user });
  } catch (err: any) {
    if (err.name === 'ZodError') {
      res.status(400).json({ error: err.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies[AUTH_CONFIG.COOKIE_NAME];
  
  if (!refreshToken) {
    res.status(401).json({ error: 'No refresh token provided' });
    return;
  }

  try {
    const payload = jwt.verify(refreshToken, AUTH_CONFIG.REFRESH_TOKEN_SECRET) as { userId: string };
    const user = await User.findById(payload.userId);
    
    if (!user) {
      res.status(401).json({ error: 'User block or not found' });
      return;
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id.toString(), user.email, user.role);

    res.cookie(AUTH_CONFIG.COOKIE_NAME, newRefreshToken, AUTH_CONFIG.COOKIE_OPTIONS);
    res.status(200).json({ accessToken });
  } catch (err) {
    res.status(403).json({ error: 'Invalid refresh token' });
  }
};

export const logout = (req: Request, res: Response): void => {
  res.clearCookie(AUTH_CONFIG.COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/api/auth'
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
