import React from "react";
import SideNav from "@/components/home/SideNav";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default function Layout({children}: {children: React.ReactNode}){
    const session = auth();
    
    if(!session){
        redirect('/auth')
    }

    return(
        <main className="w-screen h-screen flex">
            <SideNav/>
            <div className="w-4/5 h-full">{children}</div>
        </main>
    )
}