'use client'

import { FormError, FormSuccess } from "@/components/auth/form-warnings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { resetPassword, sendResetPasswordEmail } from "@/lib/actions"
import clsx from "clsx"
import { startTransition, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import BarLoader from "react-spinners/BarLoader"
import { useDebounce, useDebouncedCallback } from "use-debounce"

export const Page = ({params} : {params: {token: string}}) => {
    const token = params.token
    const [hideNewPassword, setHideNewPassword] = useState(true)
    const [hideConfirmPassword, setHideConfirmPassword] = useState(true)
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const form = useForm({
        defaultValues:
        {
            'new-password': '',
            'confirm-password': ''
        }
    });

    const toggleNewPassword = () => setHideNewPassword(!hideNewPassword)
    const toggleConfirmPassword = () => setHideConfirmPassword(!hideConfirmPassword)

    const handleSubmit = () => console.log(form.getValues('confirm-password'));

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
    }, 200)
    return(
        <main className="w-screen bg-zinc-100 h-screen flex flex-col items-center">
            <img src="https://res.cloudinary.com/dnlclcfck/image/upload/v1724330735/cmoe5428z1jpen8enhnq.png" alt="Concord" className="h-20 my-6 mt-20"/>
            <Card className="md:max-w-[40%]">
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
                        className="space-y-6"
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
                                            type={clsx(hideNewPassword && 'password')}
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
                                            type={clsx(hideConfirmPassword && 'password')}
                                            placeholder="••••••••"
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                 )}
                                />
                            </div>
                            <FormSuccess message={success}/>
                        <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600" type="submit">Reset password</Button>
                        </form>
                        </Form>
                </CardContent>
                
            </Card>
        </main>
    )
}

export default Page;