import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]'
import prisma from '../../../lib/prisma'

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

  const { username } = req.body

  if (!username || typeof username !== 'string') {
    return res.status(400).json({ message: 'Το όνομα χρήστη είναι απαραίτητο' })
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { username: username },
    })

    const { passwordHash: _, ...userWithoutPassword } = updatedUser

    res.status(200).json(userWithoutPassword)
  } catch (error) {
    if ((error as any).code === 'P2002') {
      return res.status(409).json({ message: 'Το όνομα χρήστη υπάρχει ήδη.' })
    }
    console.error('Update user API error:', error)
    res
      .status(500)
      .json({ message: 'Προέκυψε σφάλμα κατά την ενημέρωση του χρήστη.' })
  }
}
