'use client'

import React from "react";
import SideNav from "@/components/home/SideNav";
import { useFriends } from "@/components/friends-context-provider";
import BarLoader from "react-spinners/BarLoader";


export default function Layout({children}: {children: React.ReactNode}){
    const { fetchingData } = useFriends();

    if(fetchingData){
        return(
            <div className="w-screen h-screen flex flex-col items-center justify-center select-none">
                    <img src="https://res.cloudinary.com/dnlclcfck/image/upload/v1724330735/cmoe5428z1jpen8enhnq.png" alt="Concord" className="h-28 mb-8 mx-auto"/>
                    <BarLoader loading={true} width={200} />
            </div>
        )
    }

    return(
            <main className="w-screen overflow-y-hidden h-screen flex">
            <SideNav/>
            <div className="w-4/5 flex flex-col h-full">
                {children}
            </div>
        </main>
    )
}