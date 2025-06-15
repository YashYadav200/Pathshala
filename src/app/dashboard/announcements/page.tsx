"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar } from "lucide-react";

interface Announcement {
  _id: string;
  title: string;
  description: string;
  important: boolean;
  createdAt: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const response = await fetch("/api/announcement");
        if (!response.ok) {
          throw new Error("Failed to fetch announcements");
        }
        const data = await response.json();
        setAnnouncements(data.announcements);
      } catch (err) {
        setError("Failed to load announcements");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnnouncements();
  }, []);

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
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-6 sm:mb-8">
            <Bell className="h-6 w-6 text-purple-400" />
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Announcements</h1>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            {announcements.map((announcement) => (
              <Card 
                key={announcement._id} 
                className={`overflow-hidden transition-all bg-gray-900 border ${
                  announcement.important 
                    ? "border-purple-500/40 shadow-lg shadow-purple-500/10" 
                    : "border-purple-500/20 hover:border-purple-500/40"
                }`}
              >
                <CardHeader className={`${
                  announcement.important 
                    ? "bg-purple-500/10" 
                    : "bg-gray-800/50"
                } border-b border-purple-500/20`}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-white">{announcement.title}</CardTitle>
                    {announcement.important && (
                      <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30">
                        Important
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-300 mb-4 whitespace-pre-line">
                    {announcement.description}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="h-4 w-4 mr-2 text-purple-400" />
                    <span>
                      {new Date(announcement.createdAt).toLocaleDateString()} at {' '}
                      {new Date(announcement.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {announcements.length === 0 && (
            <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-purple-500/20">
              <Bell className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                No announcements available
              </h3>
              <p className="text-gray-300">
                Check back later for new announcements
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}