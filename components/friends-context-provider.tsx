'use client'

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useWebSocket } from './ws-context-provider';
import { getFriends, getPendingRequests } from "@/lib/actions";

const FriendsContext = createContext<any>(null);

export const useFriends = () => useContext(FriendsContext);

interface Friendship {
    id: string;
    friend: {
        id: string;
        name: string;
        image: string;
        online?: boolean;
    }
}

export const FriendsProvider = ({ children }: { children: React.ReactNode}) => {
    const socket = useWebSocket();
    const { ws, messages } = socket!;

    const [fetchingData, setFetchingData] = useState(true);
    const [allFriends, setAllFriends] = useState<Friendship[] | undefined>([]);
    const [sentRequests, setSentRequests] = useState<object[]>([])
    const [receivedRequests, setReceivedRequests] = useState<object[]>([])
    const requests = { sentRequests, receivedRequests};
    const setRequests = { setSentRequests, setReceivedRequests};
    
    const getOnlineUsers = () => {
        const data = localStorage.getItem('onlineUsers');
        if (data) {
            const parsedList = JSON.parse(data);
            const cpy = allFriends;
            if(cpy && cpy.length <= 0) return;
            cpy?.forEach((friendship) => {
                if(parsedList.includes(friendship.id)){
                    friendship.friend.online = true;
                } else {
                    friendship.friend.online = false;
                }
            })
            setAllFriends(cpy);
        }
    }

    const getAllFriends = () => {
        getFriends()
        .then((data) => {
            if(data.friendsList){
                const friendsList: Friendship[] = data.friendsList.map((friendship) => ({
                    id: friendship.id,
                    friend: {
                        id: friendship.friend.id,
                        name: friendship.friend.name ?? '', 
                        image: friendship.friend.image ?? '',
                    }
                }));
                setAllFriends(friendsList);
            }
        }).finally(() => getOnlineUsers())
    }

    useEffect(() => {
        getAllFriends()
        getPendingRequests()
        .then((data) => {
            if(data.sent) setSentRequests(data.sent)
            if(data.received) setReceivedRequests(data.received)
        })
        .finally(() => setFetchingData(false))
    }, [])

    useEffect(() => {
        //Fetchs new data when WS sends a message
        const lastMessage = messages[messages.length - 1];
        if(!lastMessage) return;

        switch(lastMessage.type){
            case 'ONLINE_USERS_LIST': case 'FRIEND_JOINED': case 'FRIEND_LEFT':
                getOnlineUsers();
                break;
            case 'UPDATE_FRIENDS':
                getPendingRequests()
                .then((data) => {
                    if(data.sent) setSentRequests(data.sent)
                    if(data.received) setReceivedRequests(data.received)
                })
                getAllFriends();
                break;
        }
    }, [messages]);
   
    const value = { fetchingData, allFriends, requests, setRequests};

    return (
        <FriendsContext.Provider value={value}>
            {children}
        </FriendsContext.Provider>
    )
    
}