'use client'

import HomeNav from "@/components/home/home-nav";
import AddFriendsPage from "@/components/home/invite-friends";
import OnlineFriends from "@/components/home/online-friends";
import PendingRequestPage from "@/components/home/pending-requests";
import { FriendItem } from "@/components/home/user-item";
import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/components/ws-context-provider";
import { getPendingRequests } from "@/lib/actions";
import { useEffect, useState } from "react";

export default function Page() {
    const [currentPage, setPage] = useState('online')
    const socket = useWebSocket();
    

    const [onlineFriends, setOnlineFriends] = useState<any[]>();


    const [sentRequests, setSentRequests] = useState<object[]>([])
    const [receivedRequests, setReceivedRequests] = useState<object[]>([])
    const requests = { sentRequests, receivedRequests};
    const setRequests = { setSentRequests, setReceivedRequests};
    const { ws, messages } = socket!;

    useEffect(() => {
        const data = localStorage.getItem('onlineUsers');
        if (data) {
            const parsedList = JSON.parse(data);
            setOnlineFriends(parsedList);
        }

        getPendingRequests()
            .then((data) => {
                if(data.sent) setSentRequests(data.sent)
                if(data.received) setReceivedRequests(data.received)
            })
    }, [messages]);

    
    return(
        <div className="w-full h-full flex flex-col">
           <HomeNav state={currentPage} setState={setPage}/>
            {currentPage == 'pending' && <PendingRequestPage requests={requests} setRequests={setRequests}/>}
            {currentPage == 'new' && <AddFriendsPage/>}
            {currentPage == 'online' && <OnlineFriends/>}
        </div>
    )
}