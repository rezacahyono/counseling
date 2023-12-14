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
        if (!res) return null
        return res
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
          name: token.name,
          image: token.picture,
          randomKey: token.randomKey,
        },
      }
    },
    jwt: ({ token, user, session, trigger }) => {
      if ((trigger === 'update' && session?.name) || session?.image) {
        token.name = session.name
        token.picture = session.image
      }
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

