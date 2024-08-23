'use client'

import { FormError, FormSuccess } from "@/components/auth/form-warnings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { sendResetPasswordEmail } from "@/lib/actions"
import Link from "next/link"
import { startTransition, useRef, useState } from "react"
import BarLoader from "react-spinners/BarLoader"
import Image from "next/image";

export const Page = () => {
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const emailRef = useRef<HTMLInputElement>(null);
    
    const handleSubmit = () => {
        setIsPending(true);
        setError('');
        setSuccess('');
        startTransition(() => {
            if(emailRef.current){
                sendResetPasswordEmail(emailRef.current.value)
                .then(data => {
                    if(data?.error) setError(data.error)
                    if(data?.success) setSuccess(data.success);
                })
            }
            setIsPending(false)
        })
        
    }
    return(
        <main className="w-screen bg-none h-screen flex flex-col items-center">
            <Image src="/background.png" width={1920} height={1080} className="absolute -z-10 w-screen h-screen object-cover" alt="background"/>
            <Link href="/">
                <div className="select-none mt-10 sm:mt-0 sm:fixed sm:top-4 items-center space-x-4 sm:left-4 flex cursor-pointer">
                    <img src="https://res.cloudinary.com/dnlclcfck/image/upload/v1724330735/cmoe5428z1jpen8enhnq.png" alt="Concord" className="h-16"/>
                    <h1 className="text-white font-bold text-2xl">Concord</h1>
                    </div>
            </Link>
            <Card className="mt-16 sm:mt-36 mx-10">
            <div className="h-1"><BarLoader loading={isPending} className="absolute rounded-t-sm top-0" width={'100%'}/></div>
                <CardHeader>
                    <CardTitle>Reset password</CardTitle>
                    <CardDescription>
                        Enter your email and we will send you a link to reset your password. The link expires in 10min.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                        <Label htmlFor="email">Email</Label>
                        <Input disabled={isPending} ref={emailRef} className="mt-1 mb-2" type="email" name="email" placeholder="example@domain.com" />
                        <Link className="text-sm hover:underline" href='/auth'>{'<- Back to login page'}</Link>
                        <FormError message={error}/>
                        <FormSuccess message={success}/>
                        <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600" onClick={handleSubmit}>Reset password</Button>
                </CardContent>
                
            </Card>
        </main>
    )
}

export default Page;