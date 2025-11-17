import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from './db'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        const user = await prisma.adminUser.findUnique({
          where: { username: credentials.username as string },
        })

        if (!user) {
          return null
        }

        const isValid = await bcrypt.compare(credentials.password as string, user.passwordHash)

        if (!isValid) {
          return null
        }

        // Update last login
        await prisma.adminUser.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        })

        return {
          id: user.id,
          name: user.username,
        }
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
})

