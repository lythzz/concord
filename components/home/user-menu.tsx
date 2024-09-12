'use client'

import { Button } from "../ui/button";
import { FaHome, FaBug } from "react-icons/fa";
import {  FaArrowRightFromBracket, FaGear } from "react-icons/fa6";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { BugReportModal } from "../bug-report-modal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { Skeleton } from "../ui/skeleton";
import { User } from "next-auth";


export default function UserMenu() {
    const session = useSession();
    const [user, setUser] = useState<User| undefined>(undefined);
    const [openBugReportModal, setOpenBugReportModal] = useState(false)
    
    useEffect(() => {
        setUser(session?.data?.user)
    }, [session])
    
    return !!user ? (
        
        <section className="w-full bg-zinc-100 flex flex-col select-none">
            <BugReportModal state={openBugReportModal} toggleState={setOpenBugReportModal}/>
            <div className="w-full p-4 flex justify-between items-center">
                <div className="flex mx-2 items-center space-x-4">
                    <img src={user.image as string} alt={user.name + ' profile picture'} className="rounded-full h-12 w-12"/>
                    <p className="text-lg text-black font-medium">{user.name}</p>
                </div>
                
                  <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger
                        onClick={() => signOut({callbackUrl: '/'})}
                        className="mr-6 text-lg"
                        >
                            <FaArrowRightFromBracket/>
                        </TooltipTrigger>
                        <TooltipContent>
                            Sign out
                        </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                
                
            </div>
            <div className="w-full mb-2 flex justify-around items-center">
                <Link href='/home'><Button variant='ghost' className="p-3 h-14 w-14 rounded-full hover:bg-zinc-200"><FaHome className="w-6 h-6 text-orange-500" /></Button></Link>
                <Button onClick={() => setOpenBugReportModal(true)} variant='ghost' className="p-3 h-14 w-14 rounded-full hover:bg-zinc-200"><FaBug className="w-6 h-6 text-orange-500" /></Button>
                <Button variant='ghost' className="p-3 h-14 w-14 rounded-full hover:bg-zinc-200"><FaGear className="w-6 h-6 text-orange-500" /></Button>
            </div>
        </section>
    ) : (
        <div className="w-full bg-zinc-100 flex flex-col select-none">
            <div className="w-full p-4 flex justify-between items-center">
                <div className="flex mx-2 items-center space-x-4">
                    <Skeleton className="rounded-full h-12 w-12 bg-zinc-400"/>
                    <Skeleton className="w-28 rounded-full h-4 bg-zinc-400"/>
                </div>
            </div>
            <div className="w-full mb-2 flex justify-around items-center">
                <Skeleton className="h-12 w-12 rounded-full bg-zinc-400"/>
                <Skeleton className="h-12 w-12 rounded-full bg-zinc-400"/>
                <Skeleton className="h-12 w-12 rounded-full bg-zinc-400"/>
            </div>
    </div>
    )
}