import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lecture from "@/lib/models/Lecture";

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const semester = searchParams.get('semester');
    
    const query = semester ? { semester: parseInt(semester) } : {};

    const lectures = await Lecture.find(query)
      .sort({ createdAt: -1 })
      .select("title description videoUrl semester createdAt");

    return NextResponse.json({
      success: true,
      lectures,
    });

  } catch (error) {
    console.log(error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch lectures",
    }, { status: 500 });
  }
}