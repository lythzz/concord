import { Button } from "../ui/button"
import { FaGoogle, FaGithub } from "react-icons/fa"
import { signInWithProvider } from "@/lib/actions"

export default function Social(){
    return(
        <div className="flex">
            <Button 
                type="submit" 
                className="w-full mx-2 bg-orange-500 hover:bg-orange-600"
                onClick={() => signInWithProvider('google')}>
                <FaGoogle className="mx-2 scale-125"/>
                </Button>
                <Button 
                type="submit" 
                className="w-full mx-2 bg-orange-500 hover:bg-orange-600"
                onClick={() => signInWithProvider('github')}>
                <FaGithub className="mx-2 scale-125"/>
                </Button>
        </div>
    )
}