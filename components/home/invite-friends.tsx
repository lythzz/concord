'use client'

import { Input } from "@/components/ui/input"
import { acceptFriendRequest, addFriend, denyFriendRequest, searchFriends } from "@/lib/actions"
import { startTransition, useState, useEffect } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { FaCircleCheck, FaCirclePlus, FaFaceSadCry } from "react-icons/fa6"
import { Button } from "../ui/button"
import { getPendingRequests } from "@/lib/actions"
import { UserRequestReceived, UserRequestSent, UserSearchResult } from "./user-item"
import { useToast } from "@/hooks/use-toast"
import { CiSearch } from "react-icons/ci";
import { ScrollArea } from "../ui/scroll-area"
import { useWebSocket } from "../ws-context-provider"


export default function AddFriendsPage() {    
    const [results, setResults] = useState<any>([])
   
    const [pendingInvites, setPendingInvites] = useState<string[]>([])
    const { toast } = useToast();

    const socket = useWebSocket();
    const { ws, messages } = socket!;

    const handleFriendSearch = useDebouncedCallback((name: string) => {
        setResults([])
        if(!name) return;
        startTransition(() => {
            searchFriends(name)
                .then((data)=>{
                    if(data) setResults(data)
                    
                })
        })
    }, 400)

    const handleAddFriend = (friend: any) => {
        const friendId = friend.id
        addFriend(friendId)
                .then((data) => {
                    if(data.success){
                        ws?.send(JSON.stringify({type: 'UPDATED_REQUEST_STATE', data: {friendId: friendId}}))
                        setResults(results.filter((result: any) => result.id !== friendId))
                    }
                    if(data.error){
                        toast({
                            variant: "destructive",
                            title: "Uh oh! Something went wrong.",
                            description: "There was a problem with your request.",
                        })
                    }
                })
                    .finally(() => setPendingInvites(pendingInvites.filter((id) => id !== friendId)))
        
    }
   
    return(
       <div className="w-full h-full flex select-none">
        <Card className="w-1/2 lg:w-3/5 flex-grow rounded-none">
            <CardHeader>
                <CardDescription>Search for your friends by their username </CardDescription>
            </CardHeader>
            <CardContent>
            <div className="flex space-y-4 flex-col w-full">
                        
                        <div className="relative flex items-center w-full">
                            <Input
                            className="pl-10 border-orange-500 focus-visible:border-2 focus-visible:ring-offset-0 focus-visible:ring-0"
                            placeholder="Search for your friends"
                            onChange={(e) => handleFriendSearch(e.target.value)}
                            />
                            <CiSearch className="absolute left-2 text-2xl"/>
                        </div>
                        <ScrollArea className="h-[30vh]">
                            {results.map((user: any) => (
                                <UserSearchResult user={user} key={user.id} pendingInvites={pendingInvites} handleAddFriend={handleAddFriend}/>
                            ))}
                        </ScrollArea>
                    </div>
            </CardContent>
        </Card>
        
       </div>
    )
}

