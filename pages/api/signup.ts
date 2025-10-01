import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../../lib/passwords';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({ message: 'Email, password, and username are required.' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username },
        ],
      },
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User with this email or username already exists.' });
    }

    // Hash the password
    const passwordHash = await hashPassword(password);

    // Create the user
    // ASSUMPTION: A default role for new users exists with id = 1.
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        roleId: 1, // Assuming '1' is the ID for a standard user role.
      },
    });

    // Do not send the password hash back to the client
    const { passwordHash: _, ...userWithoutPassword } = user;

    return res.status(201).json({ user: userWithoutPassword });

  } catch (error) {
    console.error('Signup Error:', error);
    return res.status(500).json({ message: 'An error occurred during registration.' });
  }
}
