'use client'

import { FormError, FormSuccess } from "@/components/auth/form-warnings"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { confirmAccount } from "@/lib/auth-actions"
import clsx from "clsx"
import Link from "next/link"
import {  useEffect, useState } from "react"
import  PulseLoader from 'react-spinners/PulseLoader'

export default function Page({ params }: { params: { token: string } }){

    const [loading, setLoading] = useState(true)
    const token = params.token
    const [error, setError] = useState<string | undefined>('')
    const [success, setSuccess] = useState<string | undefined>('')

    useEffect(()=>{
        setLoading(true);
        confirmAccount(token)
            .then((data) => {
                setError(data.error)
                setSuccess(data.success)
            })
            .finally(() => setLoading(false))
        
    }, [])

    return(
        <Card className="mt-16 sm:mt-36 mx-10 min-w-[35%]">
            <CardHeader>
                <CardTitle>Confirm account</CardTitle>
            </CardHeader>
            <CardContent>
                <div className={clsx('w-full mt-10 flex justify-center', !loading && 'hidden')}><PulseLoader loading={loading} className="rounded-t-sm top-0" /></div>
                <FormSuccess message={success} />
                <FormError message={error} />
                <div className={clsx(loading && 'invisible', 'mt-4')}><Link href="/auth">{'<- Back to login page'}</Link></div>
            </CardContent>
        </Card>
    )
}