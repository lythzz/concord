import type { NextAuthConfig } from "next-auth";
import github from "next-auth/providers/github";
import google from "next-auth/providers/google";
import bcrypt from 'bcryptjs'
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schemas";
import { db } from "./lib/db";

export default {
    providers: [
        github({
          allowDangerousEmailAccountLinking: true,
        }),
        google({
          allowDangerousEmailAccountLinking: true,
        }),
        Credentials({
          async authorize(credentials) {
            const validateFields = LoginSchema.safeParse(credentials);

            if(validateFields.success){

                const { email, password } = validateFields.data;
                const user = await db.user.findUnique({ where: { email } });

                if(!user?.emailVerified) throw new Error('email_unverified')

                if(!user || !user?.password) return null
                const doPasswordsMatch = await bcrypt.compare(password, user.password);

                if(doPasswordsMatch) return user
            }
          return null;
        },
      }),
    ],
      pages: {
        signIn: '/auth',
      }, callbacks: {
        authorized({ auth, request: { nextUrl } }) {
          const isLoggedIn = !!auth?.user;
          const isOnHome = nextUrl.pathname.startsWith('/home');
          if (isOnHome) {
            if (isLoggedIn) return true;
            return false; // Redirect unauthenticated users to login page
          } else if (isLoggedIn) {
            return Response.redirect(new URL('/home', nextUrl));
          }
          return true;
        },
      },
      
} satisfies NextAuthConfig