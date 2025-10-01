import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"
import { verifyPassword } from "../../../lib/passwords" 

const prisma = new PrismaClient()

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) {
            return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (user && user.passwordHash) {
            const isValid = await verifyPassword(credentials.password, user.passwordHash)
            if (isValid) {
                // Return the user object without the password hash
                const { passwordHash, ...userWithoutPassword } = user;
                return userWithoutPassword;
            }
        }
        // If you return null, an error will be displayed advising the user to check their details.
        return null
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user id and username to the token
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token
    },
    async session({ session, token }) {
      // Add user id and username to the session object
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session
    },
  },
  pages: {
    signIn: '/', // Redirect to home page for sign-in
    signOut: '/',
    error: '/', // Redirect to home page on error
  },
})

// We also need to extend the default Session and User types for TypeScript
declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      username: string;
    } & { 
        name?: string | null;
        email?: string | null;
        image?: string | null;
    };
  }

  interface User {
      username: string;
  }
}


declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        username: string;
    }
}
