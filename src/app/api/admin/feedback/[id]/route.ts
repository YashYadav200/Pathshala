import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Feedback from "@/lib/models/Feedback";
import { getCurrentUser } from "@/lib/auth";
import User from "@/lib/models/User";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    // Await the params since it's now a Promise
    const { id } = await params;
    const { response } = await req.json();

    if (!response) {
      return NextResponse.json({
        success: false,
        message: "Response is required"
      }, { status: 400 });
    }

    const updatedFeedback = await Feedback.findByIdAndUpdate(
      id,
      {
        response,
        status: 'responded',
        respondedBy: userId,
        respondedAt: new Date()
      },
      { new: true }
    );

    if (!updatedFeedback) {
      return NextResponse.json({
        success: false,
        message: "Feedback not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      feedback: updatedFeedback
    });
  } catch (error) {
    console.error("Error responding to feedback:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to respond to feedback"
    }, { status: 500 });
  }
}

async function checkIfUserIsAdmin(): Promise<boolean> {
  try {
    const userId = await getCurrentUser();
    if (!userId) return false;
    
    const user = await User.findById(userId);
    return user && user.role === 'admin';
  } catch (error) {
    console.error("Error checking admin status:", error);
    return false;
  }
}