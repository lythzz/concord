'use client'

import { useWebSocket } from "@/components/ws-context-provider"
import { useEffect, useState } from "react";

export default function Page({params}: {params: {id: string}}) {
    const [error, setError] = useState<string | undefined>('')
    const id = params.id
    const socket = useWebSocket();
    
   
    const { ws, messages } = socket!;

    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if(lastMessage &&lastMessage.type == 'INVALID_CHANNEL'){
            setError('invalidChannel')
        }
        if(lastMessage && lastMessage.type == 'CONNECTED_TO_CHAT'){
            setError('')
        }
    }, [messages])
    return !!error && <div>{error}</div>
}