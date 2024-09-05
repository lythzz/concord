import Image from "next/image";
import Link from "next/link";
import React from "react";
import { SessionProvider } from "next-auth/react"

export default function Layout({children}: {children: React.ReactNode}){
    return(
        <SessionProvider>
            <main className="w-screen h-screen flex flex-col items-center bg-none">
            <Image src="/background.png" width={1920} height={1080} className="absolute w-screen -z-10 h-screen object-cover" alt="background"/>
            <Link href="/">
                <div className="select-none sm:fixed sm:top-4 items-center space-x-4 sm:left-4 flex cursor-pointer">
                    <img src="https://res.cloudinary.com/dnlclcfck/image/upload/v1724330735/cmoe5428z1jpen8enhnq.png" alt="Concord" className="h-16"/>
                    <h1 className="text-white font-bold text-2xl">Concord</h1>
                    </div>
            </Link>
            {children}
            
        </main>
        </SessionProvider>
    )
}