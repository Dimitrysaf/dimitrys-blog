import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]'
import prisma from '../../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (!session || !session.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { username: true },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ username: user.username });
    } catch (error) {
      console.error("Fetch user API error:", error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
