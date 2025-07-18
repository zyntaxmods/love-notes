import userModel from "@/app/models/model";
import connectDB from "@/app/lib/connect";
import { NextResponse } from "next/server";


export async function POST(req){
    const { name } = await req.json();
    
    if (!name) return NextResponse.json({ success: false, message: "Name is required" });
    try {
        await connectDB();
        const user = await userModel.find({
            to: { $regex: new RegExp(name, "i")},
        }).sort({createdAt: -1});
        return NextResponse.json({success: true, data: user});
    } catch (error) {
        return NextResponse.json({success: false, message: error.message});
    }
}