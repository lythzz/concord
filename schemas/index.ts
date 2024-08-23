import { findUserByName } from '@/lib/actions'
import * as z from 'zod'

export const LoginSchema = z.object({
    email: z.string().email({
        message: 'Invalid email address'
    }),
    password: z.string().min(6,{
        message: 'Password is required'
    })
})

export const RegisterSchema = z.object({
    email: z.string({
        required_error: 'Email is required'
    }).email({
        message: 'Invalid email address'
    }),
    username: z.string({
        required_error: 'Username is required'
    }).min(4, {
        message: 'Your username must have at least 4 characters'
    }),
    password: z.string({
        required_error: 'Password is required'
    }).min(6,{
        message: 'Your password must have at least 6 characters'
    }),
})
