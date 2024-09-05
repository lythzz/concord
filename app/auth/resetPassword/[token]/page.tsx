'use client'

import { FormError, FormSuccess } from "@/components/auth/form-warnings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { resetPassword } from "@/lib/auth-actions"
import clsx from "clsx"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import BarLoader from "react-spinners/BarLoader"
import { useDebouncedCallback } from "use-debounce"

export default function Page({params} : {params: {token: string}}) {
    const token = params.token
    const [hideNewPassword, setHideNewPassword] = useState(true)
    const [hideConfirmPassword, setHideConfirmPassword] = useState(true)
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState<string | undefined>('')
    const [success, setSuccess] = useState<string | undefined>('')
    const form = useForm({
        defaultValues:
        {
            'new-password': '',
            'confirm-password': ''
        }
    });

    const toggleNewPassword = () => setHideNewPassword(!hideNewPassword)
    const toggleConfirmPassword = () => setHideConfirmPassword(!hideConfirmPassword)

    const handleSubmit = () => {
        setIsPending(true);
        const isPasswordValid = checkPassword();
        if (!isPasswordValid) {
            setIsPending(false);
            return;
        }
        
        resetPassword(token, form.getValues('new-password'))
            .then((data) => {
                setError(data.error);
                setSuccess(data.success);
            })
            .finally(() => {
                setIsPending(false);
            });
    };

    const checkPassword = useDebouncedCallback(() => {
        const password = form.getValues('new-password')
        const confirmPassword = form.getValues('confirm-password')
        form.clearErrors('confirm-password')
        form.clearErrors('new-password')
        if(password !== confirmPassword) {
            form.setError('confirm-password', { message: "Passwords don't match" })
        }
        if(password.length < 6) {
            form.setError('new-password', { message: 'Password must have at least 6 characters' })
        }
        if(password.length >=6 && password === confirmPassword) {
            return true
        }
    }, 300)
    
    return(
        <Card className="mt-16 min-w-[45%] sm:mt-36 mx-10">
        <div className="h-1"><BarLoader loading={isPending} className="absolute rounded-t-sm top-0" width={'100%'}/></div>
            <CardHeader>
                <CardTitle>Reset password</CardTitle>
                <CardDescription>
                    Create a new password for your account
                </CardDescription>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                    <form 
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-4"
                    >
                        <div className="space-y-2">
                            <FormField
                                control={form.control}
                                name="new-password"
                                render={({ field }) => (
                                <FormItem className="relative">
                                    <FormLabel>New password</FormLabel>
                                    <FaEye onClick={toggleNewPassword}  className={clsx("scale-150 absolute right-3 top-9 hover:cursor-pointer hover:text-slate-700", !hideNewPassword && 'hidden')}/>
                                    <FaEyeSlash onClick={toggleNewPassword}  className={clsx('scale-150 absolute right-3 top-9 hover:cursor-pointer hover:text-slate-700', hideNewPassword && 'hidden')}/>
                                    <FormControl>
                                        <Input
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e)
                                            checkPassword()
                                        }}
                                        disabled={isPending}
                                        type={hideNewPassword ? 'password' : 'text'}
                                        placeholder="••••••••"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                            />
                            <FormField
                                control={form.control}
                                name="confirm-password"
                                render={({ field }) => (
                                <FormItem className="relative">
                                    <FormLabel>Confirm password</FormLabel>
                                    <FaEye onClick={toggleConfirmPassword}  className={clsx("scale-150 absolute right-3 top-9 hover:cursor-pointer hover:text-slate-700", !hideConfirmPassword && 'hidden')}/>
                                    <FaEyeSlash onClick={toggleConfirmPassword}  className={clsx('scale-150 absolute right-3 top-9 hover:cursor-pointer hover:text-slate-700', hideConfirmPassword && 'hidden')}/>
                                    <FormControl>
                                        <Input
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e)
                                            checkPassword()
                                        }}
                                        disabled={isPending}
                                        type={hideConfirmPassword ? 'password' : 'text'}
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
                        {!!success && <div><Link className="text-sm hover:underline" href={'/auth/'}>{'<- Back to login page'}</Link></div>}
                    <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600" type="submit">Reset password</Button>
                    </form>
                    </Form>
            </CardContent>
            
        </Card>
    )
}
