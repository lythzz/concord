
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
        await generateUserFriendsCache(userId)
    }

    sendOnlineFriends(userId, socket)
    broadcastUserStatus(user);

    socket.on('close', () => {
        if(onlineUsers.get(userId).sockets.length === 1){
            userFriendsCache.forEach((friendList, id) => {
                friendList.forEach((friendship) => {
                    if(friendship.friend.id == userId){
                        onlineUsers.get(id).
                            sockets.forEach((socket) => 
                                socket.send(JSON.stringify({type: 'FRIEND_LEFT', data: {id: friendship.id}})))
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
    if(!userFriendsCache.has(userId)){
        generateUserFriendsCache(userId)
    }

    const onlineFriends = userFriendsCache.get(userId).filter((friendship) => onlineUsers.has(friendship.friend.id))
    const onlineFriendsIds = onlineFriends.map((friendship) => friendship.id)
    socket.send(JSON.stringify({type: 'ONLINE_USERS_LIST', data: Array.from(onlineFriendsIds)}))
}

const broadcastUserStatus = (user) => {
    userFriendsCache.forEach((friendList, id) => {
        friendList.forEach((friendship) => {
            if(friendship.friend.id == user.id){
                onlineUsers.get(id).
                    sockets.forEach((socket) => 
                        socket.send(JSON.stringify({type: 'FRIEND_JOINED', data: {id: friendship.id}})))
            }
        })
    })
}

const removeFriend = (data) => {
    const { userId, friendId, friendshipId } = data;
    if(onlineUsers.has(friendId)){
        userFriendsCache.get(friendId).splice(userFriendsCache.get(friendId).indexOf({id: friendshipId, friend: {id: userId}}), 1)
        onlineUsers.get(friendId).sockets.forEach((socket) => {
            sendOnlineFriends(friendId, socket)
            socket.send(JSON.stringify({type: 'UPDATE_FRIENDS'}))
        });

    }
    userFriendsCache.get(userId).splice(userFriendsCache.get(userId).indexOf({id: friendshipId, friend: {id: friendId}}), 1)
    onlineUsers.get(userId).sockets.forEach((socket) => {
        sendOnlineFriends(userId, socket)
        socket.send(JSON.stringify({type: 'UPDATE_FRIENDS'}))
    });
}

const generateUserFriendsCache = async (userId) => {
    const query = await prisma.friendship.findMany({
        where: {
        accepted: true,
        OR: [
            { userFirstId: userId },
            { userSecondId: userId }
        ]
        },
        select: {
        id: true,
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
    //userFriendsCache.delete(userId);
    userFriendsCache.set(userId, friendsList);
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
        case 'UPDATED_FRIENDSHIP_STATE':
            socket.send(JSON.stringify({type: 'UPDATE_FRIENDS'}))
            if(message.data.userId) sendOnlineFriends(message.data.userId, socket);
            onlineUsers.get(message.data.friendId)?.sockets.forEach((socket) => {
                socket.send(JSON.stringify({type: 'UPDATE_FRIENDS'}))
                sendOnlineFriends(message.data.friendId, socket)
            })
            break;
        case 'REMOVE_FRIEND':
            removeFriend(message.data, socket)//arruma essa porra te vira fdp
        default:
            break;
    }
}

module.exports = { handleMessage }