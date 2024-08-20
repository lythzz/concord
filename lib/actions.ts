"use server"

import { signIn, signOut } from "@/auth"
import { LoginSchema, RegisterSchema } from "@/schemas";
import bcrypt from 'bcryptjs'
import * as z from "zod";
import { db } from "./db";
import { defaultLoginRedirect } from "@/routes";
import { redirect } from "next/navigation";
import { AuthError, User } from "next-auth";
import { Resend } from "resend";
import EmailTemplate from "@/components/EmailTemplate";
import errorMap from "zod/locales/en.js";
import { randomUUID } from "crypto";

export const sendConfirmationEmail = async (user: User) => {
  const apiKey = process.env.RESEND_API_KEY;
  const resend = new Resend(apiKey);
  const expiration = new Date(Date.now() + 1000 * 60 * 10);
  const token = randomUUID();
  const { id, name, email} = user;
  const link = `${process.env.CURRENT_URL}/confirmAccount/${token}`

  try {
    const newtoken = await db.verificationToken.create({
       data: {
        token,
        expiration,
        userId: id as string,
        type: 'email-validation'
       }
    },)
    } catch (e) {
        return { error: 'token_fail'}
    }

    const sendEmail = await resend.emails.send({
        from: 'Concord <noreply@concordchat.online>',
        to: [email as string],
        subject: 'hello world',
        react: EmailTemplate({ name, link}),
      });
      
    if(sendEmail.error){
        return { error: 'email_not_sent'}
    }  
};

export const confirmAccount = async (token: string) => {
    try {
        const tokenData = await db.verificationToken.findUnique({ where: { token } });
        const id = tokenData?.userId;

        if(!tokenData) return { error: 'token_fail'}
        if(tokenData.expiration < new Date()) return { error: 'Token expired' }
        
        const updateUser = await db.user.update({
            where : {
                id
            },
            data: {
                emailVerified: new Date()
            }
        })

        return { success: 'Email successfully verified' }

    } catch(e) {
        console.log(e)
        return { error: 'Something went wrong' };
    }
}

export async function findUserByEmail(email: string) {
    try {
        const user = db.user.findUnique({ where: { email } });
        return user;

    } catch {
        return null;
    }
}

export const findUserById = async (id: string) => {
    try {
        const user = db.user.findUnique({ where: { id } });
        return user;

    } catch {
        return null;
    }
}

export const findUserByName= async (name: string) => {
    try {
        const user = db.user.findUnique({ where: { name } });
        return user;

    } catch {
        return null;
    }
}

export async function signInWithProvider(provider: 'google' | 'github'){
    await signIn(provider);
}

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validateFields =  LoginSchema.safeParse(values);

    if(!validateFields.success){
        return { error: 'Invalid fields!' }
    }
    
    const { email, password } = validateFields.data;

    try {
        await signIn('credentials', {
            email,
            password,
            redirect: true,
            redirectTo: defaultLoginRedirect
        });
        return { success: 'Logged in!' }
    } catch (error) {
        if (error instanceof AuthError) {
          switch (error.type) {
            case 'CredentialsSignin':
              return { error: 'Invalid credentials.'};
            default:
              return { error: 'Something went wrong' }
          }
        }

        if(error instanceof Error && error.message=='email_unverified'){
            return { error: 'Please verify your email'}
        }
        throw error;
      }   
}

export const logout = async () =>{
    await signOut({redirect: true, redirectTo: '/auth'});
}
export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validateFields =  RegisterSchema.safeParse(values);

    if(!validateFields.success){
        return { error: 'Invalid fields!' }
    }

    const { username, email, password } = validateFields.data
    const hashedPassword = await bcrypt.hash(password, 10)

    const existingUser = await findUserByEmail(email);
    if(existingUser) return { error: 'This email is already in use!' }

    try{
        const user = await db.user.create({
            data: {
                email,
                name: username,
                password: hashedPassword
            }
        })
        console.log(user)
        await sendConfirmationEmail(user);
        return { success: 'Check your email' }
    } catch (e){
        return { error: 'Something went wrong!' }
    }
   
}