import type { Request, Response } from 'express';
import User from '../models/User';

export const updateAvatar = async (req: Request, res: Response): Promise<void> => {
  if (!req.file) {
    res.status(400).json({ error: 'No file uploaded' });
    return;
  }
  
  try {
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user?.userId, { avatar: avatarUrl }, { new: true });
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.json({ avatarUrl, user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update avatar' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.body;
  if (!username) {
    res.status(400).json({ error: 'Username is required' });
    return;
  }
  
  try {
    const user = await User.findByIdAndUpdate(req.user?.userId, { username }, { new: true });
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
