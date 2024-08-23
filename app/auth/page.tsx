'use client'
import LoginForm from "@/components/auth/login-form"
import RegisterForm from "@/components/auth/register-form"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Link from "next/link"
import Image from "next/image";

export default function Page(){
    return(
        <main className="w-screen h-screen flex flex-col items-center bg-none">
            <Image src="/background.png" width={1920} height={1080} className="absolute w-screen -z-10 h-screen object-cover" alt="background"/>
            <Link href="/">
                <div className="select-none sm:fixed sm:top-4 items-center space-x-4 sm:left-4 flex cursor-pointer">
                    <img src="https://res.cloudinary.com/dnlclcfck/image/upload/v1724330735/cmoe5428z1jpen8enhnq.png" alt="Concord" className="h-16"/>
                    <h1 className="text-white font-bold text-2xl">Concord</h1>
                    </div>
            </Link>
            
            <Tabs defaultValue="login" className="w-[400px] mt-10">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger className="hover:bg-orange-200" value="login">Login</TabsTrigger>
                    <TabsTrigger className="hover:bg-orange-200" value="register">Register</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <LoginForm/>
                </TabsContent>
                <TabsContent value="register">
                    <RegisterForm/>
                </TabsContent>
            </Tabs>
        </main>
    )
}