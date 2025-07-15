import userModel from "@/app/models/model";
import connectDB from "@/app/lib/connect";
import { NextResponse } from "next/server";

export async function POST(req){
    try {
        await connectDB();
        const body = await req.json();
        const { author, to, message } = body;
        if(!author || !to || !message) return NextResponse.json({success: false, message: "Missing parameters"});

        const user = new userModel({ author, to, message });
        await user.save();
        return NextResponse.json({success: true, message: "message uploaded"});

    } catch (error) {
        return NextResponse.json({success: false, message: error.message});
    }
}