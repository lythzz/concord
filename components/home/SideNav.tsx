'use client'

import UserMenu from "./user-menu";
import { ScrollArea } from "../ui/scroll-area";

export default function SideNav(){
    return(
        <div className="w-1/5 min-w-[300px] h-full flex flex-col bg-zinc-300">
            <UserMenu/>
            <ScrollArea>

            </ScrollArea>
        </div>
    )
}