'use client'

import { useFriends } from "@/components/friends-context-provider";
import { FriendItem } from "@/components/home/user-item";
import { useWebSocket } from "@/components/ws-context-provider"
import { useEffect, useState } from "react";

export default function Page({params}: {params: {id: string}}) {
    const [error, setError] = useState<string | undefined>('')
    const id = params.id
    const socket = useWebSocket();
    const { allFriends, onlineFriends } = useFriends();
    const friendship = allFriends.filter((friendship: any) => friendship.id == id)[0];
    const friend = friendship.friend;
    const isOnline = !!onlineFriends.filter((friendship: any) => friendship.id == id)[0];
    const { ws, messages } = socket!;

   
    return(
        <div className="flex flex-col w-full h-full">
            <nav className="p-3 select-none border-b-2 border-gray-300">
                <div className="flex items-center space-x-4 relative">
                <img src={friend.image} className="w-8 h-8 rounded-full" alt={friend.name} />
                {isOnline && <div className="bg-green-500 bottom-0 left-2 h-2 w-2 rounded-full absolute"></div>}
                <p>{friend.name}</p>
                </div>
            </nav>
        </div>
    )
}