import React from "react";
import SideNav from "@/components/home/SideNav";


export default function Layout({children}: {children: React.ReactNode}){
     
    return(
        <main className="w-screen overflow-y-hidden h-screen flex">
            <SideNav/>
            <div className="w-4/5 flex flex-col h-full">
                {children}
            </div>
        </main>
    )
}