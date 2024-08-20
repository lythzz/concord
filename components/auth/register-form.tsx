'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { FaEye, FaEyeSlash} from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import FormSeparator from "../ui/separator"
import * as z from 'zod'
import Social from "./social"
import BarLoader from 'react-spinners/BarLoader'
import { useForm } from "react-hook-form"
import { RegisterSchema } from "@/schemas"
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { useState, useTransition } from "react"
import clsx from "clsx"
import { findUserByName, login, register } from "@/lib/actions"
import { FormError, FormSuccess } from "./form-warnings"
import { useDebouncedCallback } from 'use-debounce'

export default function RegisterForm(){
    const [error, setError] = useState<string | undefined>('')
    const [success, setSuccess] = useState<string | undefined>('')
    const [isPending, startTransition] = useTransition();
    const [passwordSecret, setPasswordSecret] = useState(true)
    const toggleShowPassword = () => setPasswordSecret(!passwordSecret);
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const onSubmit = (values : z.infer<typeof RegisterSchema>) => {
        startTransition(() => {
            register(values)
                .then((data) => {
                    setError(data.error)
                    setSuccess(data.success)
                })
        })
    }

    const checkName = useDebouncedCallback((name: string) => {
        findUserByName(name)
            .then((user) => {
                if(user){
                    setError('Name already in use!')
                }
            })
    }, 400)

    return(   
            <Card className="relative">
                <div className="h-1"><BarLoader loading={isPending} className="absolute rounded-t-sm top-0" width={400}/></div>
            <CardHeader className="relative">
                
                <CardTitle>Register</CardTitle>
                <CardDescription>
                    Create a new account
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <Social/>
                <FormSeparator/>
                    <Form {...form}>
                        <form 
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                        >
                            <div className="space-y-2">
                            <FormField
                                    control={form.control}
                                    name="email"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                {...field}
                                                disabled={isPending}
                                                type="email"
                                                placeholder="example@domain.com"
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input
                                                {...field}
                                                //onChange={(e)=>checkName(e.target.value)}
                                                disabled={isPending}
                                                type="text"
                                                placeholder="Enter your username"
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                               <FormField
                                    control={form.control}
                                    name="password"
                                    render={({field}) => (
                                        <FormItem className="relative">
                                            <FormLabel>Password</FormLabel>
                                            <FaEye onClick={toggleShowPassword}  className={clsx("scale-150 absolute right-3 top-9 hover:cursor-pointer hover:text-slate-700", !passwordSecret && 'hidden')}/>
                                            <FaEyeSlash onClick={toggleShowPassword}  className={clsx('scale-150 absolute right-3 top-9 hover:cursor-pointer hover:text-slate-700', passwordSecret && 'hidden')}/>
                                            <FormControl>
                                                <Input
                                                {...field}
                                                disabled={isPending}
                                                type={clsx({'password': passwordSecret})}
                                                placeholder="••••••••"
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />                                
                            </div>
                            <FormError message={error}/>
                            <FormSuccess message={success}/>
                            <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700">Create account</Button>
                        </form>
                    </Form>
                
                </CardContent>
            </Card>
    )
}