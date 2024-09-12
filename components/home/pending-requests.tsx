
import clsx from "clsx";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { ScrollArea } from "../ui/scroll-area";
import { UserRequestReceived, UserRequestSent } from "./user-item";
import { acceptFriendRequest, addFriend, denyFriendRequest, searchFriends } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "../ws-context-provider";

export default function PendingRequestPage({requests, setRequests}: any) {
    const socket = useWebSocket();
    if(!socket) return null;
    const { ws , messages } = socket;
    const { sentRequests, receivedRequests } = requests;
    const { setSentRequests, setReceivedRequests } = setRequests;
    const { toast } = useToast();

    const handleAccept = (id: string, userId: string) => {
        acceptFriendRequest(id)
            .then((res) => {
                if(res.success){
                    ws?.send(JSON.stringify({type: 'UPDATED_REQUEST_STATE', data: {friendId: userId}}))
                    setReceivedRequests(receivedRequests.filter((invite: any) => invite.id !== id))
                }
                if(res.error){
                    toast({
                        variant: "destructive",
                        title: "Uh oh! Something went wrong.",
                        description: "There was a problem with your request.",
                    })
                }
            })
    }

    const handleDecline = (id: string, userId: string) => {
        denyFriendRequest(id)
            .then((res) => {
                if(res.success){
                    ws?.send(JSON.stringify({type: 'UPDATED_REQUEST_STATE', data: {friendId: userId}}))
                    setReceivedRequests(receivedRequests.filter((invite: any) => invite.id !== id))
                }
                if(res.error){
                    toast({
                        variant: "destructive",
                        title: "Uh oh! Something went wrong.",
                        description: "There was a problem with your request.",
                    })
                }
            })
    }

    const handleCancel = (id: string, userId: string) => {
        denyFriendRequest(id)
            .then((res) => {
                if(res.success){
                    ws?.send(JSON.stringify({type: 'UPDATED_REQUEST_STATE', data: {friendId: userId}}))
                    setSentRequests(sentRequests.filter((invite: any) => invite.id !== id))
                }
                if(res.error){
                    toast({
                        variant: "destructive",
                        title: "Uh oh! Something went wrong.",
                        description: "There was a problem with your request.",
                    })
                }
            })
    }

    const handlers = { handleAccept, handleDecline }

    return(
        <Card className="w-full min-w-[250px]">
       
            <CardContent className="h-full my-6">
                
                    {sentRequests.length > 0 && (
                        <div>
                            <p className="text-xs mb-2 font-bold">SENT - {sentRequests.length}</p>
                            <ScrollArea className={clsx(receivedRequests.length > 0 ? "max-h-[35vh]" : "h-[75vh]", 'my-4 pr-4')}>
                            {sentRequests.map((friendship: any) => (
                                <UserRequestSent id={friendship.id} user={friendship.userSecond} cancelRequest={handleCancel} key={friendship.userSecond.id}/>
                            ))}
                            </ScrollArea>
                        </div>
                    )}

                    {receivedRequests.length > 0 && (
                        <div>
                            <p className="text-xs font-bold">RECEIVED - {receivedRequests.length}</p>
                            <ScrollArea className={clsx(sentRequests.length > 0 ? "max-h-[35vh]" : "h-[75vh]", "pr-4 my-4")}>
                            {receivedRequests.map((friendship: any) => (
                                <UserRequestReceived id={friendship.id} user={friendship.userFirst} handlers={handlers} key={friendship.userFirst.id}/>
                            ))}
                            </ScrollArea>
                        </div>
                    )}

                    {receivedRequests.length === 0 && sentRequests.length === 0 && (
                        <div className="w-full mt-4 flex justify-center text-gray-600">You do not have any pending friend requests</div>
                    )}
    

            </CardContent>
        </Card>
    )
}