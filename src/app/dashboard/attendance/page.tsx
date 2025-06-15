"use client";

import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Calendar as CalendarIcon, UserCheck, UserX, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Student {
  studentId: string;
  studentName: string;
  present: boolean;
}

interface AttendanceRecord {
  _id: string;
  date: string;
  students: Student[];
  createdAt: string;
  updatedAt: string;
}

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [attendance, setAttendance] = useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [attendanceData, setAttendanceData] = useState<Student[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const presentCount = attendance?.students.filter(s => s.present).length || 0;
  const absentCount = attendance?.students.length ? attendance.students.length - presentCount : 0;
  const attendancePercentage = attendance?.students.length 
    ? Math.round((presentCount / attendance.students.length) * 100) 
    : 0;

  useEffect(() => {
    async function checkAdmin() {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.user && data.user.role === 'admin') {
            setIsAdmin(true);
          }
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      }
    }
    
    checkAdmin();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAttendance(selectedDate);
    }
  }, [selectedDate]);

  const fetchAttendance = async (date: Date) => {
    setLoading(true);
    setError("");
    
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const response = await fetch(`/api/attendance?date=${formattedDate}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch attendance");
      }
      
      const data = await response.json();
      setAttendance(data.attendance);
      
      if (data.attendance) {
        setAttendanceData(data.attendance.students);
      } else {
        setAttendanceData([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };
  
  const refreshStudentList = async () => {
    if (!selectedDate) return;
    
    setLoading(true);
    try {
      const formattedDate = format(selectedDate, "yyyy-MM-dd");
      const response = await fetch(`/api/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: formattedDate,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to refresh student list");
      }
      
      const data = await response.json();
      setAttendance(data.attendance);
      setAttendanceData(data.attendance.students);
      toast.success("Student list refreshed from database");
    } catch (err) {
      console.error(err);
      setError("Failed to refresh student list");
      toast.error("Failed to refresh student list");
    } finally {
      setLoading(false);
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
      
      const data = await response.json();
      setAttendance(data.attendance);
      toast.success("Attendance saved successfully");
    } catch (error) {
      console.error("Error submitting attendance:", error);
      toast.error("Failed to save attendance");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-2 sm:p-4 bg-black min-h-screen">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 flex items-center text-white">
          <CalendarIcon className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
          Attendance Records
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <Card className="bg-gray-900/50 backdrop-blur-sm border-purple-500/10">
              <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4">
                <CardTitle className="text-white text-base sm:text-lg">Select Date</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={refreshStudentList}
                    disabled={loading}
                    className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 text-xs h-8"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Refresh
                  </Button>
                  
                  {isAdmin && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-2 py-1 w-20 text-xs h-8"
                          disabled={loading}
                        >
                          <UserCheck className="h-3 w-2" />
                          Mark
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[95vw] sm:max-w-[600px] bg-gray-900/95 backdrop-blur-sm border-purple-500/10">
                        <DialogHeader>
                          <DialogTitle className="text-white text-base sm:text-lg">Mark Student Attendance</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mt-3">
                          <div>
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={setSelectedDate}
                              className="border border-purple-500/10 rounded-md bg-gray-900/50 [&_.rdp-day]:text-white [&_.rdp-day]:font-medium [&_.rdp-nav_button]:text-white [&_.rdp-nav_button]:hover:bg-purple-500/10 [&_.rdp-nav_button]:border-purple-500/30 [&_.rdp-nav_button]:bg-transparent [&_.rdp-head_cell]:text-purple-400 [&_.rdp-day_selected]:bg-purple-600 [&_.rdp-day_selected]:hover:bg-purple-700 [&_.rdp-day]:hover:bg-purple-500/10 [&_.rdp-button]:text-white [&_.rdp-button]:hover:bg-purple-500/10 [&_.rdp-button]:hover:text-white [&_.rdp-button]:focus:bg-purple-500/10 [&_.rdp-button]:focus:text-white [&_.rdp-button]:focus:ring-purple-500/30 [&_.rdp-caption]:text-white [&_.rdp-caption_label]:text-white [&_.rdp-nav]:text-white"
                            />
                            <div className="mt-3 space-y-2">
                              <Button 
                                type="button" 
                                variant="outline" 
                                className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10 text-xs h-8" 
                                onClick={markAllPresent}
                              >
                                <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                                Mark All Present
                              </Button>
                              <Button 
                                type="button" 
                                variant="outline" 
                                className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10 text-xs h-8" 
                                onClick={markAllAbsent}
                              >
                                <XCircle className="w-3 h-3 mr-2 text-red-500" />
                                Mark All Absent
                              </Button>
                            </div>
                          </div>
                          <div className="max-h-[350px] overflow-y-auto pr-2">
                            <div className="mb-2 flex justify-between items-center">
                              <span className="font-medium text-white text-xs sm:text-sm">Students</span>
                              <span className="text-xs text-purple-400">
                                {attendanceData.filter(s => s.present).length} / {attendanceData.length} Present
                              </span>
                            </div>
                            {isSubmitting ? (
                              <div className="flex justify-center py-6">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                              </div>
                            ) : attendanceData.length === 0 ? (
                              <div className="text-center py-6 text-purple-400 text-xs">
                                No students found. Click &quot;Refresh&quot; to load from database.
                              </div>
                            ) : (
                              <div className="space-y-1">
                                {attendanceData.map((student) => (
                                  <div 
                                    key={student.studentId} 
                                    className="flex items-center justify-between p-2 border border-purple-500/10 rounded-md bg-gray-900/50"
                                  >
                                    <span className="text-white text-xs">{student.studentName}</span>
                                    <div className="flex items-center">
                                      <span className={`mr-2 text-xs ${student.present ? 'text-green-500' : 'text-red-500'}`}>
                  
                                        <span className="text-sm text-gray-500">
                                          {student.present ? 'Present' : 'Absent'}
                                        </span>
                                      </span>
                                      <Checkbox 
                                        checked={student.present}
                                        onCheckedChange={() => toggleAttendance(student.studentId)}
                                        className="border-purple-500/30 h-3 w-3"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <Button 
                          className="w-full mt-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-xs h-8"
                          onClick={submitAttendance}
                          disabled={isSubmitting || attendanceData.length === 0}
                        >
                          {isSubmitting ? 'Saving...' : 'Save Attendance'}
                        </Button>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-4">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="border border-purple-500/10 rounded-md bg-gray-900/50 [&_.rdp-day]:text-white [&_.rdp-day]:font-medium [&_.rdp-nav_button]:text-white [&_.rdp-nav_button]:hover:bg-purple-500/10 [&_.rdp-nav_button]:border-purple-500/30 [&_.rdp-nav_button]:bg-transparent [&_.rdp-head_cell]:text-purple-400 [&_.rdp-day_selected]:bg-purple-600 [&_.rdp-day_selected]:hover:bg-purple-700 [&_.rdp-day]:hover:bg-purple-500/10 [&_.rdp-button]:text-white [&_.rdp-button]:hover:bg-purple-500/10 [&_.rdp-button]:hover:text-white [&_.rdp-button]:focus:bg-purple-500/10 [&_.rdp-button]:focus:text-white [&_.rdp-button]:focus:ring-purple-500/30 [&_.rdp-caption]:text-white [&_.rdp-caption_label]:text-white [&_.rdp-nav]:text-white"
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card className="bg-gray-900/50 backdrop-blur-sm border-purple-500/10">
              <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4">
                <CardTitle className="text-white text-base sm:text-lg">
                  {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "Select a date"}
                </CardTitle>
                {attendance && (
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs">
                      {attendancePercentage}% Present
                    </Badge>
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-3 sm:p-4">
                {loading ? (
                  <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                  </div>
                ) : error ? (
                  <div className="text-center text-red-500 py-6 text-sm">{error}</div>
                ) : !attendance ? (
                  <div className="text-center text-purple-400 py-6 text-xs">
                    No attendance record found for this date
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-green-500" />
                        <span className="text-white text-xs sm:text-sm">{presentCount} Present</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <UserX className="h-4 w-4 text-red-500" />
                        <span className="text-white text-xs sm:text-sm">{absentCount} Absent</span>
                      </div>
                    </div>
                    
                    <div className="border border-purple-500/10 rounded-md overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-purple-500/10">
                          <thead className="bg-gray-900/50">
                            <tr>
                              <th className="px-3 sm:px-4 py-2 text-left text-xs font-medium text-purple-400 uppercase tracking-wider">
                                Student
                              </th>
                              <th className="px-3 sm:px-4 py-2 text-right text-xs font-medium text-purple-400 uppercase tracking-wider">
                                Status
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-gray-900/30 divide-y divide-purple-500/10">
                            {attendance.students.map((student) => (
                              <tr key={student.studentId}>
                                <td className="px-3 sm:px-4 py-2 whitespace-nowrap text-white text-xs">
                                  {student.studentName}
                                </td>
                                <td className="px-3 sm:px-4 py-2 whitespace-nowrap text-right">
                                  {student.present ? (
                                    <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                                      Present
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20 text-xs">
                                      Absent
                                    </Badge>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}