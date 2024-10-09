
import { Button } from "../ui/button"
import { FaCirclePlus, FaCheck, FaXmark } from "react-icons/fa6"
import { IoChatbox } from "react-icons/io5";
import { User } from "@prisma/client"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { IoPersonRemove } from "react-icons/io5";
import Link from "next/link";
import MoonLoader from "react-spinners/MoonLoader"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"  
import { useState } from "react";
import { removeFriend } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "../ws-context-provider";
import { useSession } from "next-auth/react";

interface Handlers {
    handleAccept: (id: string, userId: string) => void;
    handleDecline: (id: string, userId: string) => void;
  }

export const UserSearchResult = ({ user, pendingInvites, handleAddFriend }: any) => {
    return(
        <div
            className="text-md w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-100"
            >
            <div className="flex items-center space-x-4">
            <img src={user.image} className="w-8 h-8 rounded-full" alt={user.name} />
            <p>{user.name}</p>
            </div>
            {
                pendingInvites.includes(user.id) ? (
                    <div className="w-20 flex justify-center"> <MoonLoader size={30} loading={true}/></div>
                ) :
                    <Button 
                    className="bg-orange-500 hover:bg-orange-400" 
                    onClick={() => handleAddFriend(user)}>
                    <FaCirclePlus className="mr-2"/>
                    Add
                    </Button>
            }
        </div>
    )
}

export const UserRequestReceived = ({ id, user, handlers}: {id: string, user: User, handlers: Handlers}) => {
    const { handleAccept, handleDecline } = handlers
    
    return (
        <div
            className="text-md w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-100"
            >
            <div className="flex items-center space-x-4">
            <img src={user.image ?? ''} className="w-8 h-8 rounded-full" alt={user.name ?? ''} />
            <p>{user.name}</p>
            </div>
            <div className="w-20 flex justify-end">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger
                        onClick={() => handleAccept(id, user.id)}
                        aria-label={`Accept ${user.name} friendship request`}
                        className="bg-gray-200 flex justify-center mr-2 items-center rounded-full h-8 w-8 text-gray-600 text-lg hover:text-green-600"
                        >
                        <FaCheck/>
                        </TooltipTrigger>
                        <TooltipContent>
                            Accept
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger
                        onClick={() => handleDecline(id, user.id)}
                        aria-label={`Decline ${user.name} friendship request`}
                        className="bg-gray-200 flex justify-center items-center rounded-full h-8 w-8 text-gray-600 text-lg hover:text-red-600"
                        >
                        <FaXmark/>
                        </TooltipTrigger>
                        <TooltipContent>
                            Decline
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
    
        </div>
    )
}

export const UserRequestSent = ({ id, user, cancelRequest}: {id: string, user: User, cancelRequest: (id: string, userId: string) => void}) => {
    return (
        <div
            className="text-md w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-100"
            >
            <div className="flex items-center space-x-4">
            <img src={user.image ?? ''} className="w-8 h-8 rounded-full" alt={user.name ?? ''} />
            <p>{user.name}</p>
            </div>
            <div className="w-20 flex justify-end">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger
                        onClick={(e) => {
                            cancelRequest(id, user.id)
                            e.currentTarget.disabled = true;
                        }}
                        aria-label={`Cancel friendship request sent to ${user.name}`}
                        className="bg-gray-200 flex justify-center items-center rounded-full h-8 w-8 text-gray-600 text-lg hover:text-red-600"
                        >
                        <FaXmark/>
                        </TooltipTrigger>
                        <TooltipContent>
                            Cancel
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )
}

const RemoveFriendDialog = ({ id, friendId, name, open, setOpen } : { id:string, friendId: string, name:string, open: boolean, setOpen: (open: boolean) => void }) => {
    const { toast } = useToast();
    const { ws } = useWebSocket()!;
    const session = useSession();
    const userId = session?.data?.user?.id;
    const handleRemove = () => {
        setOpen(false);
        removeFriend(id)
            .then((res) => {
                if(res.error) {
                    return toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.",
                    })
                }
                ws?.send(JSON.stringify({type: 'REMOVE_FRIEND', data: {
                    userId: userId,
                    friendId: friendId,
                    friendshipId: id
                }
                }))
                ws?.send(JSON.stringify({type: 'UPDATE_FRIENDSHIP_STATE', data: {
                    friendId: friendId,
                }
                }))
            })
    }
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Remove &quot;{name}&quot;</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to permanently remove {name} from your friend list?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant='link' onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleRemove}>Remove</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export const FriendItem = ({ friendship, online=false }: {friendship: any, online?: boolean}) =>{
    const [openDialog, setOpenDialog] = useState(false);
    const friend = friendship?.friend;
    if(!friend) return null;
    return (
        <div className="text-md w-full flex items-center justify-between p-3 rounded-md hover:bg-gray-100">
            <RemoveFriendDialog id={friendship.id} friendId={friend.id} name={friend.name} open={openDialog} setOpen={setOpenDialog}/>
            <div className="flex items-center space-x-4 relative">
            <img src={friend.image} className="w-8 h-8 rounded-full" alt={friend.name} />
            {online && <div className="bg-green-500 bottom-0 left-2 h-2 w-2 rounded-full absolute"></div>}
            <p>{friend.name}</p>
            </div>
            <div className="mx-4 space-x-3">
                <TooltipProvider>
                    <Tooltip>
                        <Link href={`/home/c/${friendship.id}`}>
                            <TooltipTrigger className="text-md bg-gray-200 text-gray-800 p-3 hover:bg-gray-300 rounded-full">
                                <IoChatbox/>
                            </TooltipTrigger>
                        </Link>
                        <TooltipContent>
                            Chat
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger onClick={() => setOpenDialog(true)} className="text-md text-gray-800 p-3 hover:bg-gray-300 hover:text-red-600 bg-gray-200 rounded-full">
                            <IoPersonRemove/> 
                        </TooltipTrigger>
                        <TooltipContent>
                            Remove friend
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    )
   
}