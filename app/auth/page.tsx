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
    )
}