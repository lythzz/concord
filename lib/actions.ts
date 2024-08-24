"use server"

import { signIn, signOut } from "@/auth"
import { LoginSchema, RegisterSchema } from "@/schemas";
import bcrypt from 'bcrypt'
import * as z from "zod";
import { db } from "./db";
import { defaultLoginRedirect } from "@/routes";
import { redirect } from "next/navigation";
import { AuthError, User } from "next-auth";
import { Resend } from "resend";
import { ValidateEmail, ResetPasswordEmail } from "@/emails/EmailTemplate";
import { randomUUID } from "crypto";

export const sendConfirmationEmail = async (user: User) => {
  const apiKey = process.env.RESEND_API_KEY;
  const resend = new Resend(apiKey);
  const expiration = new Date(Date.now() + 1000 * 60 * 30);
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
        subject: 'Confirm your account at Concord',
        react: ValidateEmail({ name, link}),
      });
      
    if(sendEmail.error){
        console.log(sendEmail)
        await db.verificationToken.delete({ where: { userId: id } });
        return { error: 'email_not_sent'}
    }  
};

export const sendResetPasswordEmail = async (email: string) => {
    const user =  await findUserByEmail(email);
    if(!user) return { error: 'This email is not linked to any Concord account'}

    const apiKey = process.env.RESEND_API_KEY;
    const resend = new Resend(apiKey);
    const expiration = new Date(Date.now() + 1000 * 60 * 30);
    const token = randomUUID();

    try {
        await db.verificationToken.create({
            data: {
                token,
                userId: user.id,
                expiration,
                type: 'reset-password'
            }
        })

        const sendEmail = await resend.emails.send({
            from: 'Concord <noreply@concordchat.online>',
            to: [email as string],
            subject: 'Reset your password at Concord',
            react: ResetPasswordEmail({name: user.name, link: `${process.env.CURRENT_URL}/resetPassword/${token}`}),
          });
          
          
        if(sendEmail.error){
            await db.verificationToken.delete({ where: { userId: user.id } });
            console.log(sendEmail)
            return { error: 'Something went wrong' };
        }
        
        return { success: 'Email sent'}
    } catch (error) {
        console.log(error)
        return { error: 'Something went wrong' }
    }

}

export const resetPassword = async (token: string, password: string) => {
   try {
    const tokenData = await db.verificationToken.findUnique({ where: { token } });
    const id = tokenData?.userId;
    if(!tokenData) return { error: 'Invalid token' }

    if(tokenData.expiration < new Date()) return { error: 'Token expired' }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.user.update({
        where: { id },
        data: {
            password: hashedPassword
        }
    })
   } catch (error) {
        return { error: "Something went wrong" }
   }
}

export const confirmAccount = async (token: string) => {
    try {
        const tokenData = await db.verificationToken.findUnique({ where: { token } });
        const id = tokenData?.userId;

        if(!tokenData) return { error: 'Invalid token'}
        if(tokenData.type !== 'email-validation') return { error: 'Invalid token'}
        if(tokenData.expiration < new Date()) return { error: 'Token expired' }
        
        const updateUser = await db.user.update({
            where : {
                id
            },
            data: {
                emailVerified: new Date()
            }
        })

        await db.verificationToken.delete({ where: { token } })
        return { success: 'Email successfully verified' }

    } catch(e) {
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
        const sendEmail = await sendConfirmationEmail(user);
        if(sendEmail?.error){
            await db.user.delete({ where: { name: username } })
            return { error: 'Something went wrong, please try again later' }
        }
        return { success: 'Check your email' }
    } catch (e){
        return { error: 'Something went wrong, please try again later' }
    }
   
}