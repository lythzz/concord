import { CiSearch } from "react-icons/ci";
import { Input } from "../ui/input";

export default function OnlineFriends() {
    return (
        <div className="w-full h-full flex flex-col p-6">
            <div className="w-full flex items-center relative">
            <Input
            className="pl-10 border-orange-500 focus-visible:border-2 focus-visible:ring-offset-0 focus-visible:ring-0"
            placeholder="Search"
           
            />
            <CiSearch className="absolute left-2 text-2xl"/>
            </div>
        </div>
    )
}