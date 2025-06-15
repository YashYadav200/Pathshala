"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, MessageCircle, Send } from "lucide-react";

type FeedbackItem = {
  _id: string;
  subject: string;
  message: string;
  type: "feedback" | "doubt";
  status: "pending" | "responded";
  createdAt: string;
  response?: string;
  respondedAt?: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
};

export default function AdminFeedbackPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [responseText, setResponseText] = useState("");
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          if (data.user && data.user.role === 'admin') {
            setIsAuthorized(true);
            fetchFeedback();
          } else {
            toast.error("Access Denied", {
              description: "You don't have permission to access this page.",
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

  const fetchFeedback = async () => {
    try {
      const response = await fetch('/api/admin/feedback');
      
      if (!response.ok) {
        throw new Error('Failed to fetch feedback');
      }
      
      const data = await response.json();
      if (data.success) {
        setFeedback(data.feedback);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast.error('Failed to load feedback');
    }
  };

  const handleRespond = async (feedbackId: string) => {
    if (!responseText.trim()) {
      toast.error("Response cannot be empty");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/admin/feedback/${feedbackId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: responseText }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to respond');
      }
      
      const data = await response.json();
      
      setFeedback(prev => prev.map(item => 
        item._id === feedbackId ? { ...item, status: 'responded', response: responseText, respondedAt: new Date().toISOString() } : item
      ));
      
      setResponseText("");
      setRespondingTo(null);
      
      toast.success("Response sent successfully");
    } catch (error) {
      console.error("Error responding to feedback:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send response. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFeedback = feedback.filter(item => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return item.status === "pending";
    if (activeTab === "responded") return item.status === "responded";
    if (activeTab === "feedback") return item.type === "feedback";
    if (activeTab === "doubt") return item.type === "doubt";
    return true;
  });

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

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center text-white">
            <MessageSquare className="mr-2 h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
            Manage Feedback & Doubts
          </h1>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6 sm:mb-8">
            <TabsList className="grid grid-cols-5 w-full max-w-2xl bg-gray-900 border border-purple-500/20">
              <TabsTrigger value="all" className="text-gray-300 data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">All</TabsTrigger>
              <TabsTrigger value="pending" className="text-gray-300 data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">Pending</TabsTrigger>
              <TabsTrigger value="responded" className="text-gray-300 data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">Responded</TabsTrigger>
              <TabsTrigger value="feedback" className="text-gray-300 data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">Feedback</TabsTrigger>
              <TabsTrigger value="doubt" className="text-gray-300 data-[state=active]:bg-purple-500/20 data-[state=active]:text-white">Questions</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {filteredFeedback.length === 0 ? (
            <div className="text-center py-12 bg-gray-900/50 rounded-lg border border-purple-500/20">
              <MessageCircle className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white">No feedback found</h3>
              <p className="text-gray-300">There are no items matching your current filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:gap-6">
              {filteredFeedback.map((item) => (
                <Card key={item._id} className={`bg-gray-900 border ${item.status === "responded" ? "border-purple-500/20" : "border-purple-500/20"}`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-white">{item.subject}</CardTitle>
                        <CardDescription className="text-gray-300">
                          From: {item.userId.name} ({item.userId.email}) • 
                          {new Date(item.createdAt).toLocaleDateString()} • 
                          <Badge variant={item.type === "feedback" ? "default" : "secondary"} className="bg-purple-500/20 text-white border-purple-500/30">
                            {item.type === "feedback" ? "Feedback" : "Question"}
                          </Badge> • 
                          <Badge variant={item.status === "responded" ? "outline" : "destructive"} className={item.status === "responded" ? "border-purple-500/30 text-white" : "bg-red-500/20 text-white border-red-500/30"}>
                            {item.status === "responded" ? "Responded" : "Pending"}
                          </Badge>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-800/50 p-4 rounded-md mb-4 border border-purple-500/10">
                      <p className="whitespace-pre-wrap text-white">{item.message}</p>
                    </div>
                    
                    {item.response && (
                      <div className="mt-4 pt-4 border-t border-purple-500/20">
                        <h4 className="text-sm font-medium mb-2 text-white">Your Response:</h4>
                        <div className="bg-purple-500/5 p-4 rounded-md border border-purple-500/10">
                          <p className="whitespace-pre-wrap text-white">{item.response}</p>
                        </div>
                        {item.respondedAt && (
                          <p className="text-xs text-gray-300 mt-2">
                            Responded on {new Date(item.respondedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    {item.status === "pending" ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            onClick={() => setRespondingTo(item._id)}
                            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                          >
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Respond
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-900 border-purple-500/20">
                          <DialogHeader>
                            <DialogTitle className="text-white">Respond to {item.type === "feedback" ? "Feedback" : "Question"}</DialogTitle>
                            <DialogDescription className="text-gray-300">
                              You are responding to: {item.subject}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="bg-gray-800/50 p-4 rounded-md mb-4 max-h-40 overflow-y-auto border border-purple-500/10">
                            <p className="text-sm text-white">{item.message}</p>
                          </div>
                          <Textarea
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            placeholder="Type your response here..."
                            rows={5}
                            className="bg-gray-800 border-purple-500/20 text-white placeholder:text-gray-400"
                          />
                          <DialogFooter>
                            <Button 
                              onClick={() => handleRespond(item._id)}
                              disabled={isSubmitting}
                              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                            >
                              {isSubmitting ? (
                                <>
                                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                  Sending...
                                </>
                              ) : (
                                <>
                                  <Send className="mr-2 h-4 w-4" />
                                  Send Response
                                </>
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Button variant="outline" className="w-full border-purple-500/20 text-white hover:bg-purple-500/10" disabled>
                        Already Responded
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}