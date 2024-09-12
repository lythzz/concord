
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const onlineUsers = new Map();
const privateChats = new Map();
const userFriendsCache = new Map();

const handleUserJoin = async (userId, socket) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            id:true,
            name: true,
            image: true
        }
    })
    if(onlineUsers.has(userId)){
        onlineUsers.set(userId, {sockets: [...onlineUsers.get(userId).sockets, socket]})
    } else {
        onlineUsers.set(userId, {sockets: [socket]});
    }

    if(!userFriendsCache.has(userId)){

    const query = await prisma.friendship.findMany({
        where: {
          accepted: true,
          OR: [
            { userFirstId: userId },
            { userSecondId: userId }
          ]
        },
        select: {
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
      
      const friendsList = query.map(friend => 
        friend.userFirst.id === userId ? friend.userSecond : friend.userFirst
      );
    
        userFriendsCache.set(userId, friendsList)
    }

    sendOnlineFriends(userId, socket)
    broadcastUserStatus(user);

    socket.on('close', () => {
        if(onlineUsers.get(userId).sockets.length === 1){
            userFriendsCache.forEach((friendList, id) => {
                friendList.forEach((friend) => {
                    if(friend.id == userId){
                        onlineUsers.get(id).
                            sockets.forEach((socket) => 
                                socket.send(JSON.stringify({type: 'FRIEND_LEFT', data: {friendId: userId}})))
                    }
                })
               
            })
            onlineUsers.delete(userId);
            userFriendsCache.delete(userId);
            return;
        }
        onlineUsers.get(userId)?.sockets.splice(onlineUsers.get(userId).sockets.indexOf(socket), 1);
    })
}

const sendOnlineFriends = (userId, socket) => {
    const onlineFriends = userFriendsCache.get(userId).filter((friend) => onlineUsers.has(friend.id))
    socket.send(JSON.stringify({type: 'ONLINE_USERS_LIST', data: Array.from(onlineFriends)}))
}

const broadcastUserStatus = (user) => {
    userFriendsCache.forEach((friendList, id) => {
        friendList.forEach((friend) => {
            if(friend.id == user.id){
                onlineUsers.get(id).
                    sockets.forEach((socket) => 
                        socket.send(JSON.stringify({type: 'FRIEND_JOINED', data: user})))
            }
        })
    })
}

const handleMessage = async (message, socket) => {
    switch(message.type){
        case 'JOIN_USER':
            handleUserJoin(message.data.userId, socket);           
            break;
        case 'JOIN_PRIVATE_CHAT':
            if(!privateChats.has(message.data.chatId)){
                const chat = await prisma.privateChat.findUnique({
                    where: {
                        id: message.data.chatId
                    },
                    select: {
                       friendship: {
                        select: {
                            userFirstId: true,
                            userSecondId: true
                        }
                       }
                   }
                    
                })
                if(!chat){
                    return socket.send(JSON.stringify({type: 'INVALID_CHANNEL'}))
                }

                const members = Object.values(chat.friendship)
                if(!members.includes(message.data.userId)){
                    return socket.send(JSON.stringify({type: 'INVALID_CHANNEL'}))
                }
                privateChats.set(message.data.chatId, { members, messages: []})
            }
            break;
        case 'UPDATED_REQUEST_STATE':
            socket.send(JSON.stringify({type: 'UPDATE_FRIEND_REQUESTS'}))
            onlineUsers.get(message.data.friendId)?.sockets.forEach((socket) => socket.send(JSON.stringify({type: 'UPDATE_FRIEND_REQUESTS'})))
            break;
        default:
            break;
    }
}


module.exports = { handleMessage }