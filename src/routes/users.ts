import express from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authenticateJWT } from "../middleware/authentication.js";
import { UserModel } from '../models/User.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await UserModel.findByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role }, 
      process.env.JWT_SecretKey!,
      { expiresIn: '24h' }
    );
    
    res.json({ token, userId: user.id, username: user.username });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (username !== process.env.ADMIN_USER || password !== process.env.ADMIN_PASS) {
      return res.status(401).json({ error: 'Invalid admin credentials' });
    }
    
    const token = jwt.sign(
      { 
        id: 0,       
        role: 'admin',
        username: process.env.ADMIN_USER 
      }, 
      process.env.JWT_SecretKey!,
      { expiresIn: '24h' }
    );
    
    res.json({ token, role: 'admin' });
  } catch (error) {
    res.status(500).json({ error: 'Admin login failed' });
  }
});

router.get('/users', authenticateJWT, async (req, res) => {
  try {
    let users = await UserModel.findAll();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

router.get('/users/:id', authenticateJWT, async (req, res) => {
  try {
    const {id} = req.params;
    let Id = parseInt(id);
    let user = await UserModel.findById(Id);
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send('Internal server error');
  }
});

router.post('/users', async (req, res) => {
  try {
    const { username, password, firstName, lastName, role='user' } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    let user = await UserModel.create(username, hashedPassword, firstName, lastName, role);
    const fullUser = await UserModel.findById(user.id);

    res.status(201).json(fullUser);
  } catch (error) {

    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.get('/current-user', authenticateJWT, (req, res) => {
  res.json((req as any).user);
});

export default router;