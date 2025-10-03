import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]'
import prisma from '../../../lib/prisma'
import { verifyPassword } from '../../../lib/passwords';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)

  if (!session || !session.user?.id) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { password } = req.body

  if (!password) {
    return res.status(400).json({ message: 'Password is required' })
  }

  try {
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
    });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await verifyPassword(password, user.passwordHash)

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' })
    }

    await prisma.user.delete({
      where: { id: session.user.id },
    })

    res.status(200).json({ message: 'Account deleted successfully' })
  } catch (error) {
    console.error('Delete user API error:', error)
    res.status(500).json({ message: 'An error occurred while deleting the account.' })
  }
}
