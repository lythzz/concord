'use server'

import { auth } from "@/auth"
import { db } from "./db"
import { Resend } from "resend";

export const searchFriends = async (name:string) => {
    const session = await auth();
    const id = session?.user?.id
    const users = await db.user.findMany({
        where: {
            name: {
                contains: name
            },
            
        }, select: {
            id: true,
            name: true,
            image: true
        }
    })
    const userFriendships = await db.friendship.findMany({
        where: {
            OR: [
                {userFirstId: id},
                {userSecondId: id}
            ]
        }
    })
    let filteredUsers = users.filter((user) => {
        const isFriend = userFriendships.some((friendship) => {
            return friendship.userFirstId === user.id || friendship.userSecondId === user.id;
        });
        return !isFriend; // Retorna usuários que não estão em nenhuma amizade
    });
    filteredUsers = filteredUsers.filter((user) => user.id !== id)
    return filteredUsers
}

export const addFriend = async (friendId: string) => {
    const session = await auth();
    const userId = session?.user?.id
    if(!userId) return { error: true } 
   try {
        await db.friendship.create({
            data: {
                userFirstId: userId,
                userSecondId: friendId,
            }
        }
        )
        return { success: true }
   } catch (e) {
        return { error: true}
   }
}

export const getPendingRequests = async () => {
    const session = await auth();
    const id = session?.user?.id
    try {
        const sent = await db.friendship.findMany({
            where: {
                userFirstId: id,
                accepted: false
            },
             select:{
                id: true,
                userSecond: true
            }
        })

        const received = await db.friendship.findMany({
            where: {
                userSecondId: id,
                accepted: false
            },
            select:{
                id: true,
                userFirst: true
            }
        })
        return { sent, received }

    } catch (error) {
        return { error }
    }
}

export const denyFriendRequest = async (friendshipId: string) => {
    try {
        await db.friendship.delete({
            where: {
                id: friendshipId
            }
        })
        return { success: true }
    } catch (error) {
        return { error }
    }
}

export const acceptFriendRequest = async (friendshipId: string) => {
    try {
        await db.friendship.update({
            where: {
                id: friendshipId
            },
            data: {
                accepted: true,
                
            }
        })
        return { success: true }
    } catch (error) {
        return { error }
    }
}

export const sendBugReport = async (title: string, description: string) => {
    const session = await auth();
    const email = session?.user?.email
    const apiKey = process.env.RESEND_API_KEY;
    const resend = new Resend(apiKey);
  
    const sendEmail = await resend.emails.send({
        from: 'Concord <noreply@concordchat.online>',
        to: 'lucashartmann1337@gmail.com',
        subject: `Concord bug report: ${title}`,
        text: `Sent from: ${email}\n\n${description}`,
    });
    
    if(sendEmail.error){
        return { error: 'email_not_sent'}
    }

    return { success: 'bug_reported'}
  };

export const filterOnlineUsers = async (userId: string, onlineUsers: string[]) => {
    const friends = await db.friendship.findMany({
        where: {
          accepted: true,
          OR: [
            { userFirstId: userId },
            { userSecondId: userId }
          ]
        },
        select: {
          userFirst: true,
          userSecond: true
        }
      });
      
      const friendsList = friends.map(friend => 
        friend.userFirst.id === userId ? friend.userSecond : friend.userFirst
      );
    const onlineFriends = friendsList.filter((friend) => onlineUsers.includes(friend.id))
    
}

export const getFriends = async () => {
    const session = await auth();
    const userId = session?.user?.id;

    const query = await db.friendship.findMany({
        where: {
          accepted: true,
          OR: [
            { userFirstId: userId },
            { userSecondId: userId }
          ]
        },
        select: {
            id:true,
            userFirst: { select: {
                id: true,
                name: true,
                image: true,
            }},
            userSecond: { select: {
                id: true,
                name: true,
                image: true,
            }}
            }
        });
      
      const friendsList = query.map(friendship => 
        friendship.userFirst.id === userId ? { id: friendship.id, friend: friendship.userSecond} : { id: friendship.id, friend: friendship.userFirst}
      );

    return {friendsList};
}

export const removeFriend = async (friendshipId: string) => {
    try {
        await db.friendship.delete({
            where: {
                id: friendshipId
            }
        })
        return { success: true }
    } catch (error) {
        console.log(error)
        return { error: true }
    }
}