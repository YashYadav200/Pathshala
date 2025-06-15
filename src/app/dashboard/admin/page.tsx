"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Video, FileText, Bell, AlertTriangle, Calendar, CheckCircle, XCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { MessageSquare } from "lucide-react";
import Link from "next/link";

const MOCK_STUDENTS = Array.from({ length: 40 }, (_, i) => ({
  studentId: `student-${i + 1}`,
  studentName: `Student ${i + 1}`,
}));

export default function AdminPage() {
  const router = useRouter();

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [materialTitle, setMaterialTitle] = useState("");
  const [materialDescription, setMaterialDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [materialSemester, setMaterialSemester] = useState("1");
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementDescription, setAnnouncementDescription] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState(
    MOCK_STUDENTS.map(student => ({ ...student, present: false }))
  );
  const [semester, setSemester] = useState("1");

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.user && data.user.role === 'admin') {
            setIsAuthorized(true);
          } else {
            toast.error("Access Denied", {
              description: "You don't have permission to access the admin page.",
            });
            router.replace('/dashboard');
          }
        } else {
          toast.error("Authentication Required", {
            description: "Please sign in to continue.",
          });
          router.replace('/signin');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        toast.error("Error", {
          description: "An error occurred while checking your permissions.",
        });
        router.replace('/signin');
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  const handleVideoFileClick = () => {
    const input = document.getElementById('video') as HTMLInputElement;
    input?.click();
  };

  const handleMaterialFileClick = () => {
    const input = document.getElementById('file') as HTMLInputElement;
    input?.click();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("semester", semester);
    if (video) {
      formData.append("video", video);
    }

    try {
      const response = await fetch("/api/lectures/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload lecture");
      }

      setTitle("");
      setDescription("");
      setVideo(null);
      setSemester("1");

      toast.success("Lecture uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload lecture");
    }
  };

  const handleMaterialSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const semesterNumber = parseInt(materialSemester);

    const formData = new FormData();
    formData.append("title", materialTitle);
    formData.append("description", materialDescription);
    formData.append("semester", semesterNumber.toString());
    if (file) {
      formData.append("file", file);
    }

    console.log("Submitting material with semester:", semesterNumber);

    try {
      const response = await fetch("/api/material", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        throw new Error(`Failed to upload material: ${errorData.message || 'Unknown error'}`);
      }

      setMaterialTitle("");
      setMaterialDescription("");
      setFile(null);
      setMaterialSemester("1");

      toast.success("Material uploaded successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload material");
    }
  };

  const handleAnnouncementSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/announcement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: announcementTitle,
          description: announcementDescription,
          important: isImportant,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create announcement");
      }

      setAnnouncementTitle("");
      setAnnouncementDescription("");
      setIsImportant(false);

      toast.success("Announcement created successfully");
    } catch (error) {
      console.error("Announcement error:", error);
      toast.error("Failed to create announcement");
    }
  };

  const fetchAttendanceForDate = async (date: Date) => {
    if (!date) return;

    setIsSubmitting(true);
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const response = await fetch(`/api/attendance?date=${formattedDate}`);

      if (!response.ok) {
        throw new Error("Failed to fetch attendance");
      }

      const data = await response.json();

      if (data.attendance) {
        setAttendanceData(data.attendance.students);
      } else {
        setAttendanceData(MOCK_STUDENTS.map(student => ({ ...student, present: false })));
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setAttendanceData(MOCK_STUDENTS.map(student => ({ ...student, present: false })));
      toast.error("Failed to fetch attendance data");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateSelect = (date: Date | null) => {
    setSelectedDate(date || new Date());
    if (date) {
      fetchAttendanceForDate(date);
    }
  };

  const toggleAttendance = (studentId: string) => {
    setAttendanceData(prev =>
      prev.map(student =>
        student.studentId === studentId
          ? { ...student, present: !student.present }
          : student
      )
    );
  };

  const markAllPresent = () => {
    setAttendanceData(prev =>
      prev.map(student => ({ ...student, present: true }))
    );
  };

  const markAllAbsent = () => {
    setAttendanceData(prev =>
      prev.map(student => ({ ...student, present: false }))
    );
  };

  const submitAttendance = async () => {
    if (!selectedDate) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: selectedDate,
          students: attendanceData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit attendance");
      }

      toast.success("Attendance submitted successfully");
    } catch (error) {
      console.error("Error submitting attendance:", error);
      toast.error("Failed to submit attendance");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>
            <div className="flex flex-wrap gap-2 sm:gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Lecture
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-gray-900 border-purple-500/20">
                  <DialogHeader>
                    <DialogTitle className="text-white">Upload New Lecture</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-white">Lecture Title</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter lecture title"
                        required
                        className="bg-gray-800 border-purple-500/20 text-white placeholder:text-gray-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-white">Description</Label>
                      <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter lecture description"
                        required
                        className="bg-gray-800 border-purple-500/20 text-white placeholder:text-gray-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="semester" className="text-white">Semester</Label>
                      <select
                        id="semester"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        className="w-full p-2 bg-gray-800 border border-purple-500/20 rounded-md text-white"
                        required
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                          <option key={sem} value={sem}>
                            Semester {sem}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="video" className="text-white">Video</Label>
                      <div className="border-2 border-dashed border-purple-500/20 rounded-lg p-4 hover:border-purple-500/50 transition-colors bg-gray-800">
                        <Input
                          id="video"
                          type="file"
                          accept="video/*"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVideo(e.target.files ? e.target.files[0] : null)}
                          className="hidden"
                        />
                        <div
                          onClick={handleVideoFileClick}
                          className="flex flex-col items-center gap-2 cursor-pointer"
                        >
                          <Video className="w-8 h-8 text-purple-400/70" />
                          <span className="text-sm text-purple-400/70">
                            {video ? video.name : "Click to upload video"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white">
                      Upload Lecture
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white">
                    <FileText className="w-4 h-4 mr-2" />
                    Upload Material
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-gray-900 border-purple-500/20">
                  <DialogHeader>
                    <DialogTitle className="text-white">Upload Study Material</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleMaterialSubmit} className="space-y-6 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="materialTitle" className="text-white">Material Title</Label>
                      <Input
                        id="materialTitle"
                        value={materialTitle}
                        onChange={(e) => setMaterialTitle(e.target.value)}
                        placeholder="Enter material title"
                        required
                        className="bg-gray-800 border-purple-500/20 text-white placeholder:text-gray-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="materialDescription" className="text-white">Description</Label>
                      <Textarea
                        id="materialDescription"
                        value={materialDescription}
                        onChange={(e) => setMaterialDescription(e.target.value)}
                        placeholder="Enter material description"
                        required
                        className="bg-gray-800 border-purple-500/20 text-white placeholder:text-gray-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="materialSemester" className="text-white">Semester</Label>
                      <select
                        id="materialSemester"
                        value={materialSemester}
                        onChange={(e) => setMaterialSemester(e.target.value)}
                        className="w-full p-2 bg-gray-800 border border-purple-500/20 rounded-md text-white"
                        required
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                          <option key={sem} value={sem}>
                            Semester {sem}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="file" className="text-white">Document</Label>
                      <div className="border-2 border-dashed border-purple-500/20 rounded-lg p-4 hover:border-purple-500/50 transition-colors bg-gray-800">
                        <Input
                          id="file"
                          type="file"
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFile(e.target.files ? e.target.files[0] : null)}
                          className="hidden"
                        />
                        <div
                          onClick={handleMaterialFileClick}
                          className="flex flex-col items-center gap-2 cursor-pointer"
                        >
                          <FileText className="w-8 h-8 text-purple-400/70" />
                          <span className="text-sm text-purple-400/70">
                            {file ? file.name : "Click to upload document"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white">
                      Upload Material
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white">
                    <Bell className="w-4 h-4 mr-2" />
                    Add Announcement
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-gray-900 border-purple-500/20">
                  <DialogHeader>
                    <DialogTitle className="text-white">Create New Announcement</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAnnouncementSubmit} className="space-y-6 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="announcementTitle" className="text-white">Announcement Title</Label>
                      <Input
                        id="announcementTitle"
                        value={announcementTitle}
                        onChange={(e) => setAnnouncementTitle(e.target.value)}
                        placeholder="Enter announcement title"
                        required
                        className="bg-gray-800 border-purple-500/20 text-white placeholder:text-gray-400"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="announcementDescription" className="text-white">Announcement Content</Label>
                      <Textarea
                        id="announcementDescription"
                        value={announcementDescription}
                        onChange={(e) => setAnnouncementDescription(e.target.value)}
                        placeholder="Enter announcement content"
                        className="min-h-[150px] bg-gray-800 border-purple-500/20 text-white placeholder:text-gray-400"
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="important"
                        checked={isImportant}
                        onCheckedChange={(checked) => setIsImportant(checked === true)}
                        className="border-purple-500/20"
                      />
                      <div className="grid gap-1.5 leading-none">
                        <Label
                          htmlFor="important"
                          className="flex items-center text-sm font-medium leading-none gap-1 text-white"
                        >
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          Mark as important
                        </Label>
                      </div>
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white">
                      Publish Announcement
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white">
                    <Calendar className="w-4 h-4 mr-2" />
                    Mark Attendance
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[700px] bg-gray-900 border-purple-500/20">
                  <DialogHeader>
                    <DialogTitle className="text-white">Mark Student Attendance</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <Label className="text-white">Select Date</Label>
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={(day: Date | undefined) => handleDateSelect(day || null)}
                        className="border border-purple-500/20 rounded-md bg-gray-800 [&_.rdp-day]:text-white [&_.rdp-day]:font-medium [&_.rdp-nav_button]:text-white [&_.rdp-nav_button]:hover:bg-purple-500/10 [&_.rdp-nav_button]:border-purple-500/30 [&_.rdp-nav_button]:bg-transparent [&_.rdp-head_cell]:text-purple-400 [&_.rdp-day_selected]:bg-purple-600 [&_.rdp-day_selected]:hover:bg-purple-700 [&_.rdp-day]:hover:bg-purple-500/10 [&_.rdp-button]:text-white [&_.rdp-button]:hover:bg-purple-500/10 [&_.rdp-button]:hover:text-white [&_.rdp-button]:focus:bg-purple-500/10 [&_.rdp-button]:focus:text-white [&_.rdp-button]:focus:ring-purple-500/30 [&_.rdp-caption]:text-white [&_.rdp-caption_label]:text-white [&_.rdp-nav]:text-white"
                      />
                      <div className="mt-4 space-y-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full border-purple-500/20 text-purple-400 hover:bg-purple-500/10"
                          onClick={markAllPresent}
                        >
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                          Mark All Present
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full border-purple-500/20 text-purple-400 hover:bg-purple-500/10"
                          onClick={markAllAbsent}
                        >
                          <XCircle className="w-4 h-4 mr-2 text-red-500" />
                          Mark All Absent
                        </Button>
                      </div>
                    </div>
                    <div className="max-h-[400px] overflow-y-auto pr-2">
                      <Label className="mb-2 block text-white">Students</Label>
                      {isSubmitting ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {attendanceData.map((student) => (
                            <div
                              key={student.studentId}
                              className="flex items-center justify-between p-2 border border-purple-500/20 rounded-md bg-gray-800"
                            >
                              <span className="text-white">{student.studentName}</span>
                              <div className="flex items-center">
                                <span className={`mr-2 text-sm ${student.present ? 'text-green-500' : 'text-red-500'}`}>
                                  {student.present ? 'Present' : 'Absent'}
                                </span>
                                <Checkbox
                                  checked={student.present}
                                  onCheckedChange={() => toggleAttendance(student.studentId)}
                                  className="border-purple-500/20"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    className="w-full mt-6 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                    onClick={submitAttendance}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Attendance'}
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <Link href="/dashboard/admin/feedback" className="p-4 sm:p-6 rounded-xl bg-gray-900 hover:bg-purple-500/10 border border-purple-500/20 transition-colors group">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400/70 group-hover:scale-110 transition-transform duration-300">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Manage Feedback</h3>
              <p className="text-sm text-purple-400/70">
                View and respond to user feedback and questions
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}