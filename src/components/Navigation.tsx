import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Link from 'next/link';

const Navigation = () => {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-xl border-b border-purple-500/10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="text-white h-5 w-5" />
            </div>
            <span className="text-white text-2xl font-bold">
              Pathshala
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-purple-400 transition-colors">
              Features
            </a>
            <a href="#courses" className="text-gray-300 hover:text-purple-400 transition-colors">
              Courses
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-purple-400 transition-colors">
              Pricing
            </a>
            <a href="#about" className="text-gray-300 hover:text-purple-400 transition-colors">
              About
            </a>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/signin">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-purple-500/10">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
