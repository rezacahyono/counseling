import { fecthUserByEmailPassword } from '@/lib/actions/user.action'
import NextAuth from 'next-auth/next'
import CredentialsProvider from 'next-auth/providers/credentials'

const handler = NextAuth({
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
  },
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Credentials salah')
        }

        const res = await fecthUserByEmailPassword(
          credentials.email,
          credentials.password
        )
        if (res) {
          return res
        } else {
          throw new Error('Credentials errors')
        }
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          randomKey: token.randomKey,
        },
      }
    },
    jwt: ({ token, user }) => {
      if (user) {
        const u = user as unknown as any
        return {
          ...token,
          id: u.id,
          randomKey: u.randomKey,
        }
      }
      return token
    },
  },
})

export { handler as GET, handler as POST }

