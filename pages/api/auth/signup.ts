
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../../lib/prisma'
import { hashPassword } from '../../../lib/passwords'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { email, password, username } = req.body

  if (!email || !password || !username) {
    return res.status(400).json({ message: 'Όλα τα πεδία είναι απαραίτητα' })
  }

  try {
    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        username,
        roleId: 1, // Assign a default user role
      },
    })

    const { passwordHash: _, ...userWithoutPassword } = user

    res.status(201).json(userWithoutPassword)
  } catch (error) {
    console.error('Signup API error:', error)
    if ((error as any).code === 'P2002') {
      if ((error as any).meta?.target?.includes('email')) {
        return res
          .status(409)
          .json({ message: 'Το email χρησιμοποιείται ήδη.' })
      }
      if ((error as any).meta?.target?.includes('username')) {
        return res
          .status(409)
          .json({ message: 'Το όνομα χρήστη χρησιμοποιείται ήδη.' })
      }
    }
    res
      .status(500)
      .json({ message: 'Προέκυψε σφάλμα κατά την εγγραφή του χρήστη.' })
  }
}
