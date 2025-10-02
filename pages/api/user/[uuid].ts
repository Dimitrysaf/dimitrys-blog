import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { uuid } = req.query;

  if (typeof uuid !== 'string') {
    return res.status(400).json({ message: 'Invalid UUID' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: uuid },
      select: { 
        username: true, 
        createdAt: true,
        role: {
          select: {
            name: true
          }
        }
       },
    });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
}
