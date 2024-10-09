'use client'

import { CiSearch } from "react-icons/ci";
import { Input } from "../ui/input";
import { FriendItem } from "./user-item";
import { ScrollArea } from "../ui/scroll-area";

interface Friendship {
    id: string;
    friend: {
        id: string;
        name: string;
        image: string;
        online?: boolean;
    }
}

export default function FriendsPage({ friendships, onlineOnly }: { friendships: undefined | Friendship[], onlineOnly?: boolean}) {
    return (
        <div className="w-full h-full flex flex-col p-6">
            <div className="w-full flex items-center relative">
            <Input
            className="pl-10 border-orange-500 focus-visible:border-2 focus-visible:ring-offset-0 focus-visible:ring-0"
            placeholder="Search"
           
            />
            <CiSearch className="absolute left-2 text-2xl"/>
            </div>
            <ScrollArea className="my-6 max-h-[82%]">
                {friendships && friendships.map((friendship => {
                    if(onlineOnly && !friendship.friend.online) return null
                    return <FriendItem friendship={friendship} key={friendship.id} online={friendship.friend.online}/>
                }))}
               
            </ScrollArea>
        </div>
    )
}