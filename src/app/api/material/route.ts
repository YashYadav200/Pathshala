import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Material from "@/lib/models/Material";
import { writeFile } from "fs/promises";
import path from "path";
import { mkdir } from "fs/promises";

export async function POST(req: Request) {
    try {
        await connectDB();

        const formData = await req.formData();
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const file = formData.get("file") as File;
        const semesterValue = formData.get("semester");
        
        console.log("Form data received:", {
            title,
            description,
            fileName: file?.name,
            semesterValue,
            semesterType: typeof semesterValue
        });
        
        const semester = semesterValue ? parseInt(semesterValue as string) : 1;
        
        if (!title || !file) {
            return NextResponse.json({
                success: false,
                message: "Title and file are required"
            }, { status: 400 });
        }

        if (isNaN(semester) || semester < 1 || semester > 8) {
            return NextResponse.json({
                success: false,
                message: "Semester must be a number between 1 and 8"
            }, { status: 400 });
        }

        const uploadsDir = path.join(process.cwd(), "public/uploads/materials");
        await mkdir(uploadsDir, { recursive: true });

        const bytes = new Uint8Array(8);
        crypto.getRandomValues(bytes);
        const uniqueId = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
        const fileName = `${uniqueId}-${file.name.replace(/\s+/g, '-')}`;
        const filePath = path.join(uploadsDir, fileName);

        const fileBuffer = await file.arrayBuffer();
        await writeFile(filePath, Buffer.from(fileBuffer));

        const fileExt = path.extname(file.name).substring(1).toLowerCase();
        const fileType = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt'].includes(fileExt) 
            ? fileExt 
            : 'other';

        const material = await Material.create({
            title,
            description,
            fileUrl: `/uploads/materials/${fileName}`,
            fileType,
            semester,
            size: file.size,
            uploadedBy: "admin",
        });

        console.log("Created material:", material);

        return NextResponse.json({
            success: true,
            material
        }, { status: 201 });

    } catch (error) {
        console.error("Error uploading material:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to upload material"
        }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        await connectDB();
        
        const { searchParams } = new URL(request.url);
        const semester = searchParams.get('semester');
        
        let query = {};
        
        if (semester) {
            query = { semester: parseInt(semester) };
        }
        
        console.log("Material query:", query);
        
        const materials = await Material.find(query).sort({ createdAt: -1 });
        console.log(`Found ${materials.length} materials for query:`, query);
        
        return NextResponse.json({
            success: true,
            materials
        });
    } catch (error) {
        console.error("Error fetching materials:", error);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch materials"
        }, { status: 500 });
    }
}