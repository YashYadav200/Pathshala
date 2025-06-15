"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Send, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

type FeedbackItem = {
  _id: string;
  type: string;
  subject: string;
  message: string;
  createdAt: string;
  status: string;
  response?: string;
  respondedAt?: string;
};

export default function FeedbackPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("feedback"); // "feedback" or "doubt"
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [previousFeedback, setPreviousFeedback] = useState<FeedbackItem[]>([]);

  // Fetch previous feedback from API
  useEffect(() => {
    async function fetchFeedback() {
      try {
        const response = await fetch('/api/feedback');
        
        if (!response.ok) {
          throw new Error('Failed to fetch feedback');
        }
        
        const data = await response.json();
        if (data.success) {
          setPreviousFeedback(data.feedback);
        }
      } catch (error) {
        console.error('Error fetching feedback:', error);
        toast.error('Failed to load your previous submissions');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchFeedback();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, message, type }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit');
      }
      
      const data = await response.json();
      
      // Add to local state
      setPreviousFeedback(prev => [data.feedback, ...prev]);
      
      // Reset form
      setSubject("");
      setMessage("");
      setType("feedback");
      
      toast.success(type === "feedback" ? "Feedback submitted successfully" : "Question submitted successfully");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center text-white">
            <MessageSquare className="mr-2 h-8 w-8 text-purple-400" />
            Feedback & Doubts
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Submission Form */}
            <Card className="bg-gray-900 border border-purple-500/20">
              <CardHeader className="border-b border-purple-500/20">
                <CardTitle className="text-white">Submit Your Thoughts</CardTitle>
                <CardDescription className="text-gray-300">
                  Share your feedback or ask questions about your courses.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-gray-300">Type</Label>
                    <Select 
                      value={type} 
                      onValueChange={setType}
                    >
                      <SelectTrigger className="bg-gray-800 border-purple-500/20 text-white">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-900 border-purple-500/20">
                        <SelectItem value="feedback" className="text-white hover:bg-purple-500/10">Feedback</SelectItem>
                        <SelectItem value="doubt" className="text-white hover:bg-purple-500/10">Question/Doubt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-gray-300">Subject</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder={type === "feedback" ? "What's your feedback about?" : "What's your question about?"}
                      className="bg-gray-800 border-purple-500/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-gray-300">Message</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={type === "feedback" ? "Share your detailed feedback..." : "Describe your question in detail..."}
                      rows={5}
                      className="bg-gray-800 border-purple-500/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit {type === "feedback" ? "Feedback" : "Question"}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
            
            {/* Previous Submissions */}
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-xl font-semibold text-white">Your Previous Submissions</h2>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                </div>
              ) : previousFeedback.length === 0 ? (
                <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-purple-500/20">
                  <MessageSquare className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">
                    No submissions yet
                  </h3>
                  <p className="text-gray-300">
                    Share your thoughts or ask questions to get started
                  </p>
                </div>
              ) : (
                previousFeedback.map((item) => (
                  <Card 
                    key={item._id} 
                    className={`bg-gray-900 border ${
                      item.status === "responded" 
                        ? "border-purple-500/40" 
                        : "border-purple-500/20 hover:border-purple-500/40"
                    }`}
                  >
                    <CardHeader className="pb-2 border-b border-purple-500/20">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base text-white">{item.subject}</CardTitle>
                          <CardDescription className="text-xs text-gray-400">
                            {new Date(item.createdAt).toLocaleDateString()} • 
                            {item.type === "feedback" ? "Feedback" : "Question"}
                          </CardDescription>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs ${
                          item.status === "responded" 
                            ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" 
                            : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        }`}>
                          {item.status === "responded" ? "Responded" : "Pending"}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="text-sm text-gray-300">{item.message}</p>
                      
                      {item.response && (
                        <div className="mt-4 pt-4 border-t border-purple-500/20">
                          <p className="text-xs font-medium text-purple-400 mb-1">Response:</p>
                          <p className="text-sm text-gray-300">{item.response}</p>
                          {item.respondedAt && (
                            <p className="text-xs text-gray-400 mt-1">
                              Responded on {new Date(item.respondedAt).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}