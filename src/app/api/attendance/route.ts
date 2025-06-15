import { NextResponse } from "next/server";

import  connectDB  from '../../../lib/db';
import Attendance from "@/lib/models/Attendance";
import User from "@/lib/models/User";


export async function GET(req: Request) {
  try {
    await connectDB();
    
    const url = new URL(req.url);
    const date = url.searchParams.get("date");
    
    if (!date) {
      return NextResponse.json({
        success: false,
        message: "Date parameter is required"
      }, { status: 400 });
    }
    
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    const attendance = await Attendance.findOne({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });
    
    return NextResponse.json({
      success: true,
      attendance: attendance || null
    });
    
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to fetch attendance"
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const body = await req.json();
    const { date, students } = body;
    
    if (!date) {
      return NextResponse.json({
        success: false,
        message: "Date is required"
      }, { status: 400 });
    }
    
    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);
    
    if (students && Array.isArray(students)) {
      const result = await Attendance.findOneAndUpdate(
        { date: attendanceDate },
        {
          date: attendanceDate,
          students: students,
        },
        { 
          new: true, 
          upsert: true 
        }
      );
      
      return NextResponse.json({
        success: true,
        attendance: result
      }, { status: 201 });
    }
    
    const users = await User.find({ role: 'user' }).select('_id name');
    
    const existingAttendance = await Attendance.findOne({ date: attendanceDate });
    
    const studentRecords = users.map(user => {
      const userId = user._id.toString();
      const existingStudent = existingAttendance?.students.find(
        (student: { studentId: string }) => student.studentId === userId
      );
      
      return {
        studentId: userId,
        studentName: user.name,
        present: existingStudent ? existingStudent.present : false
      };
    });
    
    if (existingAttendance) {
      const result = await Attendance.findOneAndUpdate(
        { date: attendanceDate },
        {
          students: studentRecords
        },
        { new: true }
      );
      
      return NextResponse.json({
        success: true,
        attendance: result
      }, { status: 200 });
    } else {
      const newAttendance = new Attendance({
        date: attendanceDate,
        students: studentRecords
      });
      
      const result = await newAttendance.save();
      
      return NextResponse.json({
        success: true,
        attendance: result
      }, { status: 201 });
    }
    
  } catch (error) {
    console.error("Error marking attendance:", error);
    return NextResponse.json({
      success: false,
      message: "Failed to mark attendance"
    }, { status: 500 });
  }
}