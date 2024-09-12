'use client'

import clsx from "clsx";
import { Button } from "../ui/button";


export default function HomeNav({state, setState}: any) {
    const unselectedStyle = "hover:bg-white text-black p-6 pb-4 text-md border-b-[3px] border-transparent rounded-none hover:border-orange-300";
    const selectedStyle = "hover:bg-white text-black cursor-default p-6 pb-4 text-md border-b-[3px] border-orange-500 rounded-none";
    return(
        <nav className="w-full border-b flex items-center">
            <Button variant='ghost' className={clsx(state === 'online' ?selectedStyle: unselectedStyle)} onClick={() => setState('online')}>Online</Button>
            <Button variant='ghost' className={clsx(state === 'all' ?selectedStyle: unselectedStyle)} onClick={() => setState('all')}>All</Button>
            <Button variant='ghost' className={clsx(state === 'pending' ?selectedStyle: unselectedStyle)} onClick={() => setState('pending')}>Pending</Button>
            <Button variant='ghost' className={clsx(state === 'new' ?selectedStyle: unselectedStyle)} onClick={() => setState('new')}>Add friends</Button>
        </nav>
    )
}