import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Lecture from "@/lib/models/Lecture";
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(req: Request) {
  try {
    await connectDB();

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const video = formData.get("video") as File;
    const semester = parseInt(formData.get("semester") as string);

    if (isNaN(semester) || semester < 1 || semester > 8) {
      return NextResponse.json({
        success: false,
        error: "Semester must be a number between 1 and 8",
      }, { status: 400 });
    }

    const bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    const uniqueSuffix = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    const fileName = `${uniqueSuffix}-${video.name}`;

    const videoBuf = await video.arrayBuffer();
    const videoPath = path.join(process.cwd(), 'public', 'uploads', 'videos', fileName);
    await writeFile(videoPath, Buffer.from(videoBuf));

    const videoUrl = `/uploads/videos/${fileName}`;

    const lecture = await Lecture.create({
      title,
      description,
      videoUrl,
      semester,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: lecture,
    }, { status: 201 });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({
      success: false,
      error: "Failed to create lecture",
    }, { status: 500 });
  }
}