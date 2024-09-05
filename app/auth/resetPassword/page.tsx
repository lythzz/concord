'use client'

import { FormError, FormSuccess } from "@/components/auth/form-warnings"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { sendResetPasswordEmail } from "@/lib/auth-actions"
import Link from "next/link"
import { startTransition, useRef, useState } from "react"
import BarLoader from "react-spinners/BarLoader"

export default function Page() {
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const emailRef = useRef<HTMLInputElement>(null);
    
    const handleSubmit = () => {
        setIsPending(true);
        setError('');
        setSuccess('');
        startTransition(async () => {
            if(emailRef.current){
                try {
                    const data = await sendResetPasswordEmail(emailRef.current.value);
                    if(data?.error) setError(data.error)
                    if(data?.success) setSuccess(data.success);
                } catch (err) {
                    setError('An unexpected error occurred');
                }
            }
            setIsPending(false);
        });
    }
        
    return(
       
            <Card className="mt-16 sm:mt-36 mx-10">
            <div className="h-1"><BarLoader loading={isPending} className="absolute rounded-t-sm top-0" width={'100%'}/></div>
                <CardHeader>
                    <CardTitle>Reset password</CardTitle>
                    <CardDescription>
                        Enter your email and we will send you a link to reset your password. The link expires in 30min.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input disabled={isPending} ref={emailRef} className="mt-1 mb-2" type="email" name="email" placeholder="example@domain.com" />
                        </div>
                        <FormError message={error}/>
                        <FormSuccess message={success}/>
                        <div><Link className="text-sm hover:underline" href='/auth'>{'<- Back to login page'}</Link></div>
                        <Button className="w-full mt-4 bg-orange-500 hover:bg-orange-600" onClick={handleSubmit}>Reset password</Button>
                </CardContent>
                
            </Card>
        
    )
}

