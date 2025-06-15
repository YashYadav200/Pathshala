import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Feedback from "@/lib/models/Feedback";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const userId = await getCurrentUser();
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "Authentication required"
      }, { status: 401 });
    }
    
    const body = await req.json();
    const { subject, message, type } = body;
    
    if (!subject || !message || !type) {
      return NextResponse.json({
        success: false,
        message: "Subject, message, and type are required"
      }, { status: 400 });
    }
    
    if (type !== 'feedback' && type !== 'doubt') {
      return NextResponse.json({
        success: false,
        message: "Type must be either 'feedback' or 'doubt'"
      }, { status: 400 });
    }
    
    const feedback = await Feedback.create({
      subject,
      message,
      type,
      userId,
      status: 'pending'
    });
    
    return NextResponse.json({
      success: true,
      feedback
    }, { status: 201 });
    
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to submit feedback"
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    
    const userId = await getCurrentUser();
    if (!userId) {
      return NextResponse.json({
        success: false,
        message: "Authentication required"
      }, { status: 401 });
    }
    
    const feedback = await Feedback.find({ userId })
      .sort({ createdAt: -1 })
      .select("subject message type status response createdAt respondedAt");
    
    return NextResponse.json({
      success: true,
      feedback
    });
    
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch feedback"
    }, { status: 500 });
  }
}