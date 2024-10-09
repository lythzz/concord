'use client'

import { useFriends } from "@/components/friends-context-provider";
import HomeNav from "@/components/home/home-nav";
import AddFriendsPage from "@/components/home/invite-friends";
import FriendsPage from "@/components/home/online-friends";
import PendingRequestPage from "@/components/home/pending-requests";
import { FriendItem } from "@/components/home/user-item";
import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/components/ws-context-provider";
import { getFriends, getPendingRequests } from "@/lib/actions";
import { User } from "@prisma/client";
import { useEffect, useState } from "react";


export default function Page() {
    const [currentPage, setPage] = useState('online')
    const { allFriends, requests, setRequests} = useFriends();
    return(
        <div className="w-full h-full flex flex-col">
           <HomeNav state={currentPage} setState={setPage}/>
            {currentPage == 'pending' && <PendingRequestPage requests={requests} setRequests={setRequests}/>}
            {currentPage == 'new' && <AddFriendsPage/>}
            {currentPage == 'online' && <FriendsPage friendships={allFriends} onlineOnly={true}/>}
            {currentPage == 'all' && <FriendsPage friendships={allFriends}/>}
        </div>
    )
}