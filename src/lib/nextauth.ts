import {
  DefaultSession,
  NextAuthOptions,
  Session,
  getServerSession,
} from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./db";
import { DefaultJWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    name: string;
    email: string;
    picture?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async jwt({ token }) {
      const dbUser = await prisma.user.findFirst({
        where: {
          email: token?.email,
        },
      });

      if (dbUser) {
        token.id = dbUser.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        const sessionObj: Session = {
          ...session,
          user: {
            id: token.id,
            email: token.email,
            image: token.picture,
            name: token.name,
          },
        };
        return sessionObj;
      }
      return session;
    },
  },
};

export const getAuthSession = () => {
  return getServerSession(authOptions);
};
