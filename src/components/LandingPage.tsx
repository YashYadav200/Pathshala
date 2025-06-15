import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Sparkles, Users, BarChart3, Award, BookOpen, Shield, Calendar, Trophy, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from 'next/link';


const Hero = () => {
  return (
    <section className="min-h-screen bg-black text-white flex items-center relative overflow-hidden">
     
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full animate-fade-in">
                <span className="text-purple-400 text-sm font-medium">
                  ✨ Next-Generation Learning Management
                </span>
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight animate-fade-in" style={{ animationDelay: '200ms' }}>
                Revolutionize Your
                <br />
                <span className="gradient-text">Academic Journey</span>
              </h1>
              
              <p className="text-gray-300 text-xl leading-relaxed max-w-lg animate-fade-in" style={{ animationDelay: '400ms' }}>
                Empower students, educators, and institutions with our cutting-edge learning management system. 
                Transform traditional classrooms into dynamic, interactive learning environments where knowledge meets innovation.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '600ms' }}>
              <Link href="/signin">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-6 text-lg shadow-lg shadow-purple-500/25">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Button variant="outline" size="lg" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 px-8 py-6 text-lg">
                <Play className="mr-2 h-5 w-5" />
                Discover Features
              </Button>
            </div>
          </div>

          <div className="relative flex justify-center animate-float">
            <div className="bg-gray-900/30 backdrop-blur-sm rounded-3xl border border-purple-500/10 overflow-hidden">
              {/* Replace img with Next.js Image component */}
              <Image
                src="/globe.svg"
                alt="Globe"
                width={500}
                height={300}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Features Component
const Features = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Digital Classroom Hub",
      description: "Seamlessly manage assignments, resources, and interactive lessons in one unified platform designed for modern education."
    },
    {
      icon: Users,
      title: "Collaborative Learning Spaces",
      description: "Foster peer-to-peer learning with real-time discussion forums, group projects, and interactive study sessions."
    },
    {
      icon: BarChart3,
      title: "Advanced Progress Analytics",
      description: "Track student performance with intelligent insights, predictive analytics, and personalized learning recommendations."
    },
    {
      icon: Award,
      title: "Achievement & Recognition System",
      description: "Motivate learners with digital badges, milestone celebrations, and comprehensive achievement tracking."
    },
    {
      icon: Sparkles,
      title: "AI-Powered Learning Assistant",
      description: "Personalized tutoring with adaptive learning paths that adjust to each student's unique pace and learning style."
    },
    {
      icon: Shield,
      title: "Secure Academic Environment",
      description: "Enterprise-grade security ensuring student data privacy, secure assessments, and protected academic integrity."
    }
  ];

  return (
    <section id="features" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
            <span className="text-purple-400 text-sm font-medium">
              🚀 Innovative Features
            </span>
          </div>
          <h2 className="text-5xl font-bold text-white mb-6">
            Everything Your Institution
            <br />
            <span className="gradient-text">Needs to Excel</span>
          </h2>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto">
            Comprehensive tools and features designed specifically for schools, colleges, and universities to enhance 
            educational outcomes and streamline academic operations.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 hover:bg-gray-900/70 group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-white font-bold text-xl mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


const Courses = () => {
  const programs = [
    {
      title: "High School Academic Management",
      description: "Comprehensive LMS solution for grades 9-12 with advanced curriculum tracking and college preparation tools.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop",
      students: "2,500+ Students",
      duration: "Year-Round Program",
      achievement: "98% Success Rate",
      category: "High School"
    },
    {
      title: "University Campus Suite",
      description: "Enterprise-grade learning management for universities with research integration and departmental collaboration.",
      image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=200&fit=crop",
      students: "15,000+ Students",
      duration: "Multi-Semester Support",
      achievement: "Campus-Wide Integration",
      category: "University"
    },
    {
      title: "Community College Platform",
      description: "Flexible LMS designed for diverse learning paths, professional development, and continuing education programs.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=200&fit=crop",
      students: "8,200+ Students",
      duration: "Flexible Scheduling",
      achievement: "Multi-Program Support",
      category: "Community College"
    }
  ];

  return (
    <section id="courses" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
            <span className="text-purple-400 text-sm font-medium">
              🎓 Academic Solutions
            </span>
          </div>
          <h2 className="text-5xl font-bold text-white mb-6">
            Tailored for Every
            <span className="gradient-text"> Educational Level</span>
          </h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            From high schools to universities, our platform adapts to meet the unique needs of every educational institution
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div key={index} className="bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-purple-500/10 hover:border-purple-500/30 transition-all duration-300 hover:bg-gray-900/70 group">
              <div className="relative">
                <Image
                  src={program.image} 
                  alt={program.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-purple-600/90 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {program.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-white font-semibold text-xl mb-3">{program.title}</h3>
                <p className="text-gray-400 mb-6 text-sm leading-relaxed">{program.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-400">
                    <Users className="h-4 w-4 mr-2 text-purple-400" />
                    {program.students}
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Calendar className="h-4 w-4 mr-2 text-purple-400" />
                    {program.duration}
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <Trophy className="h-4 w-4 mr-2 text-purple-400" />
                    {program.achievement}
                  </div>
                </div>

                <Button variant="outline" size="lg" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 px-4 py-3 text-lg w-40">
                  <Play className="mr-2 h-5 w-5" />
                  <a href="#features" className="flex items-center">
                    Learn More
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// CTA Component
const CTA = () => {
  return (
    <section className="py-24 bg-black">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
          <span className="text-purple-400 text-sm font-medium">
            🌟 Transform Your Institution
          </span>
        </div>
        
        <h2 className="text-5xl font-bold text-white mb-6">
          Ready to Revolutionize
          <br />
          <span className="gradient-text">
            Educational Excellence?
          </span>
        </h2>
        
        <p className="text-gray-300 text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
          Join hundreds of educational institutions worldwide who trust Pathshala to deliver exceptional 
          learning experiences. Elevate your academic programs with our comprehensive LMS solution.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10">
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-12 py-6 text-lg shadow-lg shadow-purple-500/25">
            Request Demo
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 px-12 py-6 text-lg">
            Contact Sales Team
          </Button>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/10 inline-block">
          <div className="text-gray-300 text-sm space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-8">
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 text-purple-400 mr-2" />
                Free consultation & setup
              </span>
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 text-purple-400 mr-2" />
                30-day trial period
              </span>
              <span className="flex items-center">
                <CheckCircle className="w-4 h-4 text-purple-400 mr-2" />
                Dedicated support team
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main LandingPage Component
const LandingPage = () => {
  return (
    <>
      <Hero />
      <Features />
      <Courses />
      <CTA />
    </>
  );
};

export default LandingPage;
