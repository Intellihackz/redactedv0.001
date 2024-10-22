'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Infinity, Zap, Share2 } from 'lucide-react'
import Image from 'next/image'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#121212] text-[#E6E6FA] overflow-hidden">
      <BackgroundAnimation />
      
      {/* Header Section */}
      <header className="container mx-auto px-4 py-6 relative z-10">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Infinity className="h-8 w-8 text-[#008080]" />
            <span className="text-2xl font-bold">CanvasNFT</span>
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="#features" className="hover:text-[#008080] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[#008080] transition-colors">How It Works</a>
            <a href="#login" className="hover:text-[#008080] transition-colors">Login</a>
          </div>
          <button className="bg-[#008080] text-white px-4 py-2 rounded-full hover:bg-[#006666] transition-colors">
            Get Started
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative z-10">
        <motion.h1 
          className="text-5xl md:text-7xl font-bold mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Infinite Canvas, Infinite Possibilities
        </motion.h1>
        <motion.p 
          className="text-xl md:text-2xl mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Create, Mint, and Own Your Digital Art with Ease
        </motion.p>
        <motion.button 
          className="bg-[#008080] text-white text-lg px-8 py-4 rounded-full hover:bg-[#006666] transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Start Creating
        </motion.button>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Infinity className="h-12 w-12 text-[#008080]" />}
              title="Infinite Canvas"
              description="Unleash your creativity without boundaries on our limitless digital canvas."
            />
            <FeatureCard 
              icon={<Zap className="h-12 w-12 text-[#008080]" />}
              title="Easy NFT Minting"
              description="Turn your artwork into NFTs with just a few clicks, powered by NEAR blockchain."
            />
            <FeatureCard 
              icon={<Share2 className="h-12 w-12 text-[#008080]" />}
              title="Share & Sell"
              description="Showcase your NFTs to the world and sell them on our integrated marketplace."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StepCard number={1} title="Draw" description="Create your masterpiece on our infinite canvas" />
            <StepCard number={2} title="Customize" description="Add details and metadata to your NFT" />
            <StepCard number={3} title="Mint" description="Turn your art into an NFT with one click" />
            <StepCard number={4} title="Own & Share" description="Showcase and sell your digital creation" />
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">NFT Showcase</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <motion.div 
                key={i} 
                className="aspect-square bg-[#1E1E1E] rounded-lg overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Image 
                  src={`/placeholder.svg?height=300&width=300&text=NFT ${i + 1}`} 
                  alt={`NFT ${i + 1}`} 
                  width={300}
                  height={300}
                  className="w-full h-full object-cover" 
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="py-20 bg-gradient-to-r from-[#4A0E4E] to-[#008080] relative z-10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Ready to Turn Your Creativity into NFTs?</h2>
          <button className="bg-white text-[#4A0E4E] text-lg px-8 py-4 rounded-full hover:bg-[#E6E6FA] transition-colors">
            Start Your Endless Journey
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1E1E1E] py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/3 mb-8 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <Infinity className="h-8 w-8 text-[#008080]" />
                <span className="text-2xl font-bold">CanvasNFT</span>
              </div>
              <p className="text-sm text-[#E6E6FA]">Create, mint, and own your digital art with ease.</p>
            </div>
            <div className="w-full md:w-1/3 mb-8 md:mb-0">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-[#E6E6FA] hover:text-[#008080] transition-colors">About</a></li>
                <li><a href="#" className="text-[#E6E6FA] hover:text-[#008080] transition-colors">FAQ</a></li>
                <li><a href="#" className="text-[#E6E6FA] hover:text-[#008080] transition-colors">Support</a></li>
                <li><a href="#" className="text-[#E6E6FA] hover:text-[#008080] transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-[#E6E6FA] hover:text-[#008080] transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div className="w-full md:w-1/3">
              <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
              <form className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-[#2A2A2A] text-[#E6E6FA] px-4 py-2 rounded-l-full focus:outline-none"
                />
                <button 
                  type="submit" 
                  className="bg-[#008080] text-white px-4 py-2 rounded-r-full hover:bg-[#006666] transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div 
      className="bg-[#1E1E1E] text-[#E6E6FA] p-6 rounded-lg"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p>{description}</p>
    </motion.div>
  )
}

function StepCard({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <motion.div 
      className="bg-[#1E1E1E] text-[#E6E6FA] p-6 rounded-lg relative"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute top-4 right-4 bg-[#008080] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
        {number}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p>{description}</p>
    </motion.div>
  )
}

function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 z-0">
      <motion.div
        className="absolute inset-0 bg-[#4A0E4E] opacity-20"
        animate={{
          background: [
            "radial-gradient(circle, #4A0E4E 0%, #121212 100%)",
            "radial-gradient(circle, #008080 0%, #121212 100%)",
            "radial-gradient(circle, #4A0E4E 0%, #121212 100%)",
          ],
        }}
        transition={{ repeat: 30000, duration: 10 }}
      />
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white rounded-full"
          style={{
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * 100 - 50],
            opacity: [0, 1, 0],
          }}
          transition={{
            repeat: 30000,
            duration: Math.random() * 5 + 5,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}
