'use client'

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import Link from "next/link";
import {  FaArrowRight, FaGithub } from "react-icons/fa";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Image src="/background.png" width={1920} height={1080} className="absolute -z-10 w-screen h-screen object-cover" alt="background"/>
      <div className="relative flex max-h-[50vh] mx-10 flex-col md:flex-row flex-grow my-36 p-4 rounded-xl bg-white bg-opacity-90 ">
        <div className="md:w-2/3 flex items-center md:items-start flex-col">
          <div className="mx-6">
            <img 
            src="https://res.cloudinary.com/dnlclcfck/image/upload/v1724330735/cmoe5428z1jpen8enhnq.png" 
            className="h-24"
            alt="Concord" />
          </div>
          <div className="m-6 h-full flex items-end">
            <h1 className="text-2xl sm:text-3xl text-center md:text-left md:text-4xl text-black font-medium">
              Welcome to <span className="text-orange-500 italic font-bold">Concord!</span><br/>
              A <em>fake</em> web chatting service
            </h1>
          </div>
        </div>
        <div className="md:w-1/3 flex-grow flex flex-col items-center justify-center">
          <Link href={'https://github.com/lythzz/concord'} className="w-full flex justify-center" target="_blank">
            <Button className="bg-black hover:bg-gray-800 w-4/5 py-6 text-lg m-4 font-medium antialiased">
              <FaGithub className="mr-2"/> Github repository
            </Button>
          </Link>
          <Link href={'/auth'} className="w-full flex justify-center">
            <Button className="bg-orange-500 hover:bg-orange-600 w-4/5 py-6 m-4 text-lg font-medium antialiased">
               Start chatting <FaArrowRight className="ml-2"/>
            </Button>
          </Link>
        </div>
        <footer className="absolute my-1 hover:underline cursor-pointer bottom-1 text-center w-full text-sm"><Link href='https://github.com/lythzz' target="_blank">&copy; Lucas Hartmann 2024</Link></footer>
      </div>
    </main>
  );
}
