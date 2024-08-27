import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const POST = async(req: NextRequest) => {
    const authorizationHeader = req.headers.get("Authorization");
    if (authorizationHeader && authorizationHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        //clean up old tokens
        await db.verificationToken.deleteMany({
            where: {
                expiration: {
                    lt: new Date()
                }
            }
        })

        return NextResponse.json({ message: 'Tokens deleted' }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}