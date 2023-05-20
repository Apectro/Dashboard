import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/User';

export const register = async (req: Request, res: Response) => {
  const { username, password, isAdmin } = req.body;

  // Check if the user is an admin
  const adminToken = req.header('x-auth-token');
  if (!adminToken) {
    return res.status(401).json({ msg: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(
      adminToken,
      process.env.JWT_SECRET!
    ) as JwtPayload;
    const adminUser = await User.findById(decoded.id);

    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ msg: 'Access denied. Not an admin user.' });
    }

    // Check if the username already exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create a new user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({ username, password: hashedPassword, isAdmin });

    await user.save();

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET!,
      {
        expiresIn: 86400, // 24 hours
      }
    );

    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET!,
      {
        expiresIn: 86400, // 24 hours
      }
    );

    // Include isAdmin property in the response
    res.status(200).json({ token, isAdmin: user.isAdmin });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};

// Add test user to database
const addTestUser = async () => {
  const username = 'testuser';
  const password = 'testpassword';
  const isAdmin = true;

  try {
    // Check if the user already exists
    let user = await User.findOne({ username });
    if (user) {
      console.log(`User ${username} already exists`);
      return;
    }

    // Create a new user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({ username, password: hashedPassword, isAdmin });

    await user.save();

    console.log(`User ${username} added to the database`);

  } catch (error) {
    console.log('Error adding test user to database', error);
  }
};

addTestUser();