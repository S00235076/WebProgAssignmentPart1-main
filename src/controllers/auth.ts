import { Request, Response } from 'express'; // Import Request and Response to fix typing issues
import { usersCollection } from "../database";
import * as argon2 from 'argon2';
import { sign as jwtSign } from 'jsonwebtoken';
import { User } from '../models/user';

export const handleLogin = async (req: Request, res: Response) => {
  const email = req.body?.email;
  const password = req.body?.password;

  if (!email || !password) {
    res
      .status(400)
      .json({ message: 'Email and password are required' });
    return;
  }

  let user: User | null = null;
  try {
    user = await usersCollection.findOne({
      email: email.toLowerCase(),
    });
  } catch (error) {
    console.error(`Error finding user: ${error instanceof Error ? error.message : error}`);
    res.status(500).json({ message: 'Internal server error' });
    return;
  }

  const dummyPassword = 'dummy_password';
  const dummyHash = await argon2.hash(dummyPassword);

  // Use the user's hash if found, otherwise use the dummy hash
  let userPasswordHash: string = user?.hashedPassword ?? dummyHash;

  try {
    // Check password
    const isPasswordValid = await argon2.verify(userPasswordHash, password);

    // If password is invalid, return unauthorized
    if (!isPasswordValid || !user) {
      res.status(401).json({
        message: 'Invalid email or password!',
      });
      return;
    }

    res.status(201).send({ accessToken: createAccessToken(user) });
  } catch (error) {
    console.error(`Error verifying password: ${error instanceof Error ? error.message : error}`);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createAccessToken = (user: User | null): string => {
  const secret = process.env.JWTSECRET || "not very secret";
  const expiresTime = process.env.JWTEXPIRES || "60"; // Ensure JWTEXPIRES is treated as a string

  const payload = {
    email: user?.email,
    name: user?.name,
  };

  try {
    const token = jwtSign(payload, secret, { expiresIn: parseInt(expiresTime, 10) }); // Parse expiresTime to ensure it's an integer
    return token;
  } catch (error) {
    console.error(`Error signing token: ${error instanceof Error ? error.message : error}`);
    throw new Error('Failed to create access token');
  }
};
