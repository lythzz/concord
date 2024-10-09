'use client'

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import React, { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext<{ ws: WebSocket | null; messages: WsMessage[] } | null>(null);

interface WsMessage {
  type: string;
  data: object | undefined;
}

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }: { children: React.ReactNode}) => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<WsMessage[]>([]);
  const p = usePathname()
  const [userId, setUserId] = useState<string | null | undefined>(undefined);
  const session = useSession();
  useEffect(() => {
    setUserId(session.data?.user?.id)  
  }, [])
  
  useEffect(() => {
    if(userId){
      const socket = new WebSocket('ws://localhost:8080');
      
      socket.onopen = () => {
      setWs(socket);
      socket.send(JSON.stringify({
        type: "JOIN_USER",
        data: {
          userId: userId
        }
      }))
    
    };

    socket.onmessage = (event) => {
      const newMessage = JSON.parse(event.data)
      console.log(newMessage)

      if(newMessage.type == 'ONLINE_USERS_LIST'){
         localStorage.removeItem('onlineUsers');
         localStorage.setItem('onlineUsers', JSON.stringify(newMessage.data))         
      }

      if(newMessage.type == 'FRIEND_JOINED'){
        const currentOnlineUsers = localStorage.getItem('onlineUsers');
        if(currentOnlineUsers){
          const parsedOnlineUsers = JSON.parse(currentOnlineUsers);
          if(!parsedOnlineUsers.includes(newMessage.data.id)){
            parsedOnlineUsers.push(newMessage.data.id)
            localStorage.setItem('onlineUsers', JSON.stringify(parsedOnlineUsers))	
          }
        }
      }

      if(newMessage.type == 'FRIEND_LEFT'){
        const currentOnlineUsers = localStorage.getItem('onlineUsers');
        if(currentOnlineUsers){
          const parsedOnlineUsers = JSON.parse(currentOnlineUsers)
          const index = parsedOnlineUsers.findIndex(newMessage.data.id)
          if(index) parsedOnlineUsers.splice(index, 1)
          localStorage.setItem('onlineUsers', JSON.stringify(parsedOnlineUsers))    
        }
      }

      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.onclose = () => {
      console.log('Conexão WebSocket fechada');
    };

    socket.onerror = (error) => {
      
    };
      return () => {
        socket.close();
      };
    }
  }, [userId]);

  const value = { ws, messages };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
