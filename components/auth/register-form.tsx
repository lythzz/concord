import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { signIn } from "@/auth"
import FormSeparator from "../ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaGithub, FaGoogle } from "react-icons/fa"

export default function RegisterForm(){
    return(
        <Card>
            <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>
                    Create a new account
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <form action={async () => {
                    'use server'
                    await signIn('google')
                }}>
                    <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600"><FaGoogle className="mx-2 scale-125"/> Register with Google</Button>
                </form>
                <form action={async () => {
                    'use server'
                    await signIn('github')
                }}>
                    <Button type="submit" className="w-full bg-sky-500 hover:bg-sky-600"><FaGithub className="mx-2 scale-125"/>Register with Github</Button>
                </form>
                 
                <form action={async () => {
                    "use server"
                    await signIn("google")
                 }}>

                <FormSeparator/>

                <div className="space-y-1">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type='email' placeholder="Enter your email"/>
                </div>
                <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Enter password"/>
                </div>
                <div className="space-y-1">
                <Label htmlFor="confirm_password">Confirm password</Label>
                <Input id="confirm_password" type="password" placeholder="Enter password"/>
                </div>
                </form>
            </CardContent>
            <CardFooter>
                <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700">Log in</Button>
            </CardFooter>
            </Card>
    )
}