'use client'
import LoginForm from "@/components/auth/login-form"
import RegisterForm from "@/components/auth/register-form"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"


export default function Page(){
    return(
        <main className="w-screen h-screen flex items-center justify-center bg-stone-200">
            <Tabs defaultValue="login" className="w-[400px] fixed top-20">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger className="hover:bg-sky-200" value="login">Login</TabsTrigger>
                    <TabsTrigger className="hover:bg-sky-200" value="register">Register</TabsTrigger>
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