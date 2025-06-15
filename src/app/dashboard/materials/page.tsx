"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Calendar, Play } from "lucide-react";

interface Material {
  _id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  semester: number;
  createdAt: string;
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMaterials() {
      try {
        const url = selectedSemester 
          ? `/api/material?semester=${selectedSemester}` 
          : "/api/material";
          
        console.log("Fetching materials from:", url); 
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch materials");
        }
        const data = await response.json();
        console.log("Fetched materials:", data.materials); 
        setMaterials(data.materials);
      } catch (err) {
        setError("Failed to load materials");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchMaterials();
  }, [selectedSemester]);

  const handleSemesterChange = (semester: string | null) => {
    console.log("Changing semester filter to:", semester); 
    setSelectedSemester(semester);
    setLoading(true);
  };

  const getFileIcon = (fileType: string) => {
    const type = fileType.toLowerCase();
    
    if (type.includes('pdf')) {
      return <FileText className="h-8 w-8 text-red-400" />;
    } else if (type.includes('doc') || type.includes('docx')) {
      return <FileText className="h-8 w-8 text-blue-400" />;
    } else if (type.includes('ppt') || type.includes('pptx')) {
      return <FileText className="h-8 w-8 text-orange-400" />;
    } else if (type.includes('xls') || type.includes('xlsx')) {
      return <FileText className="h-8 w-8 text-green-400" />;
    } else if (type.includes('txt')) {
      return <FileText className="h-8 w-8 text-gray-400" />;
    } else if (type.includes('video')) {
      return <Play className="h-8 w-8 text-purple-400" />;
    } else {
      return <FileText className="h-8 w-8 text-blue-500" />;
    }
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
          <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-white">Study Materials</h1>
          
          {/* Semester filter buttons */}
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
            {materials.map((material) => (
              <Card key={material._id} className="overflow-hidden hover:shadow-lg transition-all bg-gray-900 border border-purple-500/20 hover:border-purple-500/40 group">
                <CardHeader className="bg-gray-800/50 border-b border-purple-500/20">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-white">{material.title}</CardTitle>
                    <div className="p-2 bg-purple-500/20 rounded-full group-hover:scale-110 transition-transform duration-300">
                      {getFileIcon(material.fileType)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-300 mb-4">
                    {material.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-purple-400" />
                      <span>
                        {new Date(material.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      {material.semester ? (
                        <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full text-xs border border-purple-500/30">
                          Semester {material.semester}
                        </span>
                      ) : (
                        <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded-full text-xs border border-gray-700">
                          No Semester
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full border-purple-500/20 text-white hover:bg-purple-500/10" 
                    asChild
                  >
                    <a href={material.fileUrl} target="_blank" rel="noopener noreferrer" download>
                      <Download className="h-4 w-4 mr-2 text-purple-400" />
                      Download
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {materials.length === 0 && (
            <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-purple-500/20">
              <FileText className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                {selectedSemester 
                  ? `No study materials available for Semester ${selectedSemester}` 
                  : "No study materials available yet"}
              </h3>
              <p className="text-gray-300">
                Check back later for new materials
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}