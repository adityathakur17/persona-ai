import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Github, Twitter, Linkedin, Instagram } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-black">Persona AI</h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#features" className="text-gray-600 hover:text-black px-3 py-2 text-sm font-medium">
                  Features
                </a>
                <a href="#about" className="text-gray-600 hover:text-black px-3 py-2 text-sm font-medium">
                  About
                </a>
                <a href="#contact" className="text-gray-600 hover:text-black px-3 py-2 text-sm font-medium">
                  Contact
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">Persona AI</h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">Now your mentors are just a click away!</p>

          {/* Mentor Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto" id="about">
            {/* Hitesh Choudhary Card */}
            <Card className="border-2 border-gray-200 hover:border-black transition-colors">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-black mb-4">Hitesh Choudhary</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  A passionate educator and full-stack developer with expertise in JavaScript, React, Node.js, and
                  modern web technologies. Known for his clear teaching style and practical approach to coding, Hitesh
                  has helped thousands of developers master web development through his comprehensive courses and
                  tutorials.
                </p>
                <Link href="/chat">  
                <Button className="w-full bg-black text-white hover:bg-gray-800">Talk now</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Piyush Garg Card */}
            <Card className="border-2 border-gray-200 hover:border-black transition-colors">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-black mb-4">Piyush Garg</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  An experienced software engineer and tech entrepreneur specializing in system design, backend
                  development, and DevOps. Piyush is known for his deep technical knowledge and ability to explain
                  complex concepts in simple terms, making him an excellent mentor for aspiring developers and
                  engineers.
                </p>
                <Link href="/chat">
                
                <Button className="w-full bg-black text-white hover:bg-gray-800">Talk now</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50" id="features">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-black mb-6">Talk to your mentors</h2>
          <p className="text-xl text-gray-600 mb-8">
            Ask them any doubts. Many people have tried it, now it&apos;s your turn.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">💬</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Interactive Conversations</h3>
              <p className="text-gray-600">
                Have real-time conversations with AI mentors who understand your learning style.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Personalized Guidance</h3>
              <p className="text-gray-600">
                Get tailored advice and solutions based on your specific questions and goals.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">Instant Responses</h3>
              <p className="text-gray-600">
                No waiting time - get immediate answers to your coding and career questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-6">Persona AI</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Connect with AI mentors and accelerate your learning journey.
            </p>

            {/* Social Media Links */}
            <div className="flex justify-center space-x-6 mb-8">
              <a href="https://x.com/adxtya_thakur" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="https://github.com/adityathakur17/persona-ai/tree/main" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-6 h-6" />
              </a>
              <a href="https://www.linkedin.com/in/aditya-thakur-267991229/" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>

            <div className="border-t border-gray-800 pt-8">
              <p className="text-gray-400 text-sm">© 2025 Persona AI. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
