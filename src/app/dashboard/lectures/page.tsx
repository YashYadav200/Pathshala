"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Lecture {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  semester: number;
  createdAt: string;
}

export default function LecturesPage() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLectures() {
      try {
        const url = selectedSemester 
          ? `/api/lectures?semester=${selectedSemester}` 
          : "/api/lectures";
          
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch lectures");
        }
        const data = await response.json();
        setLectures(data.lectures);
      } catch (err) {
        setError("Failed to load lectures");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchLectures();
  }, [selectedSemester]);

  const handleSemesterChange = (semester: string | null) => {
    setSelectedSemester(semester);
    setLoading(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex justify-center items-center text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-white">Available Lectures</h1>
          
          <div className="mb-6 sm:mb-8 flex flex-wrap gap-2">
            <Button
              variant={selectedSemester === null ? "default" : "outline"}
              onClick={() => handleSemesterChange(null)}
              className={selectedSemester === null 
                ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white" 
                : "border-purple-500/20 text-purple-400 hover:bg-purple-500/10 hover:text-white"}
            >
              All Semesters
            </Button>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <Button
                key={sem}
                variant={selectedSemester === sem.toString() ? "default" : "outline"}
                onClick={() => handleSemesterChange(sem.toString())}
                className={selectedSemester === sem.toString()
                  ? "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                  : "border-purple-500/20 text-purple-400 hover:bg-purple-500/10 hover:text-white"}
              >
                Semester {sem}
              </Button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {lectures.map((lecture) => (
              <Card key={lecture._id} className="overflow-hidden bg-gray-900 border border-purple-500/20 hover:border-purple-500/40 group">
                <CardHeader className="bg-gray-800/50 border-b border-purple-500/20">
                  <CardTitle className="text-white">{lecture.title}</CardTitle>
                  <div className="text-sm text-purple-400">
                    Semester {lecture.semester}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="relative rounded-lg overflow-hidden bg-gray-800/50 border border-purple-500/10">
                    <video 
                      controls 
                      className="w-full"
                    >
                      <source 
                        src={lecture.videoUrl} 
                        type="video/mp4" 
                      />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  
                  <p className="text-gray-300">
                    {lecture.description}
                  </p>
                  
                  <div className="text-sm text-gray-400 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Posted on {new Date(lecture.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {lectures.length === 0 && (
            <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-purple-500/20">
              <svg className="h-12 w-12 text-purple-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-white mb-2">
                {selectedSemester 
                  ? `No lectures available for Semester ${selectedSemester}` 
                  : "No lectures available yet"}
              </h3>
              <p className="text-gray-300">
                Check back later for new lectures
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}