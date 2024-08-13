import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { FaGithub, FaGoogle } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "@/auth"
import FormSeparator from "../ui/separator"

export default function LoginForm(){
    const handleSignIn = async (provider: string) => {
        'use server'
        await signIn(provider);
    }

    return(   
            <Card>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                    Log in into an already existing account
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <form action={async () => {
                    'use server'
                    await signIn('google')
                }}>
                    <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600"><FaGoogle className="mx-2 scale-125"/> Sign in with Google</Button>
                </form>
                <form action={async () => {
                    'use server'
                    await signIn('github')
                }}>
                    <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600"><FaGithub className="mx-2 scale-125"/>Sign in with Github</Button>
                </form>
                 
                <form action={async () => {
                    "use server"
                    await signIn("google")
                 }}>

                <FormSeparator/>

                <div className="space-y-1">
                <Label htmlFor="email">E-mail</Label>
                <Input type="email" id="email" placeholder="Enter your email"/>
                </div>
                <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter password"/>
                </div>
                </form>
            </CardContent>
            <CardFooter>
                <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700">Log in</Button>
            </CardFooter>
            </Card>
    )
}