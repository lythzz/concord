'use client'

import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions";

export default function Page(){
    
    return(
        <div className="w-full h-full flex flex-col justify-center items-center">
            <h1>You&apos;re logged in</h1>
            <form action={logout}>
                <Button type="submit" className="my-2">Log out</Button>
            </form>
            
        </div>
    )
}