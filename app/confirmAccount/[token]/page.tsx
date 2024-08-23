'use client'

import { confirmAccount } from "@/lib/actions"
import { startTransition, useEffect, useState } from "react"

export default function Page({ params }: { params: { token: string } }){
    const token = params.token
    const [error, setError] = useState<string | undefined>('')
    const [success, setSuccess] = useState<string | undefined>('')

    useEffect(()=>{
      startTransition(() => {
            confirmAccount(token)
                .then((data) => {
                    setError(data.error)
                    setSuccess(data.success)
                })
      })  
    }, [])

    return(
        <div className="w-full h-full flex flex-col justify-center items-center">
            <h1>You're logged in</h1>
            {!!error && <h1>{error}</h1>}
            {!!success && <h1>{success}</h1>}
        </div>
    )
}