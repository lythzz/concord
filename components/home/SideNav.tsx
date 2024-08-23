import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "../ui/button";
import { logout } from "@/lib/actions";


export default async function SideNav(){
    const session = await auth()
    if(!session){
        redirect('/auth')
    }
    return(
        <div className="w-1/5 h-full flex flex-col bg-sky-200">
            <section className="w-full h-1/6 flex justify-between items-center p-4">
            <div className="flex items-center space-x-4">
                <img 
                src={session.user?.image as string} 
                alt={session.user?.name + ' profile picture'}
                className="rounded-full h-14 border-2 border-sky-500"
                />
                <h1>{session.user?.name}</h1>
            </div>
            <div className="flex items-center">
                <form action={logout}>
                    <Button variant='link' type="submit">{'->'}</Button>
                </form>
            </div>
            </section>
        </div>
    )
}