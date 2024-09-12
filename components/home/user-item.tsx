
import { Button } from "../ui/button"
import { FaCirclePlus, FaCheck, FaXmark } from "react-icons/fa6"
import MoonLoader from "react-spinners/MoonLoader"
import { User } from "@prisma/client"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"

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

export const FriendItem = ({ friend }: {friend: any}) =>{
    if(!friend) return null;
    return (
        <div className="text-md w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-100">
            <div className="flex items-center space-x-4">
            <img src={friend.image} className="w-8 h-8 rounded-full" alt={friend.name} />
            <p>{friend.name}</p>
            </div>
        </div>
    )
   
}