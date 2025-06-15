import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Feedback from "@/lib/models/Feedback";
import { getCurrentUser } from "@/lib/auth";
import mongoose from "mongoose";

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
    
    const isAdmin = await checkIfUserIsAdmin();
    if (!isAdmin) {
      return NextResponse.json({
        success: false,
        message: "Admin access required"
      }, { status: 403 });
    }
    
    const feedback = await Feedback.find({})
      .sort({ createdAt: -1 })
      .populate('userId', 'name email')
      .select("subject message type status response createdAt userId respondedAt");
    
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

async function checkIfUserIsAdmin(): Promise<boolean> {
  try {
    const userId = await getCurrentUser();
    if (!userId) return false;
    
    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    const user = await User.findById(userId);
    
    return user && user.role === 'admin';
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}