'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Infinity, Play, Paintbrush, Laptop, Zap, Palette, Rocket, Bell } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import emailjs from '@emailjs/browser'
import { EmailConfig } from '@/config/emailConfig'
import { AppConfig } from '@/config/appConfig'
import confetti from 'canvas-confetti'
import { useHasMounted } from '@/hooks/useHasMounted'
import { Carousel } from './Carousel'

// Add this function to trigger confetti
const triggerConfetti = () => {
  // First burst
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#14B8A6', '#A855F7', '#ffffff'] // teal and purple to match theme
  });

  // Second burst after a small delay
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ['#14B8A6', '#A855F7', '#ffffff']
    });
  }, 200);

  // Third burst after another small delay
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ['#14B8A6', '#A855F7', '#ffffff']
    });
  }, 400);
}

// Add this helper function at the top of the file
const getIconComponent = (iconName: string) => {
  const icons = {
    Infinity: <Infinity className="h-12 w-12 text-teal-500" />,
    Zap: <Zap className="h-12 w-12 text-teal-500" />,
    Palette: <Palette className="h-12 w-12 text-teal-500" />,
    Paintbrush: <Paintbrush className="h-12 w-12 text-teal-500" />,
    Bell: <Bell className="h-12 w-12 text-teal-500" />,
    Laptop: <Laptop className="h-12 w-12 text-teal-500" />,
    Rocket: <Rocket className="h-12 w-12 text-teal-500" />,
    // Add other icons as needed
  };
  return icons[iconName as keyof typeof icons];
};

export function LandingPage() {
  const hasMounted = useHasMounted()
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const templateParams = {
        to_email: EmailConfig.toEmail,
        from_email: email,
        message: `New waitlist signup from: ${email}`,
        subject: 'New Waitlist Signup'
      }

      await emailjs.send(
        EmailConfig.serviceId,
        EmailConfig.templateId,
        templateParams,
        EmailConfig.publicKey
      )

      setIsSubmitted(true)
      setEmail('')
      
      // Store email in localStorage
      const existingEmails = JSON.parse(localStorage.getItem('waitlistEmails') || '[]')
      localStorage.setItem('waitlistEmails', JSON.stringify([...existingEmails, email]))

      // Trigger confetti animation on successful submission
      triggerConfetti()

    } catch (err) {
      console.error('Failed to send email:', err)
      setError('Failed to join waitlist. Please try again later.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!hasMounted) {
    return null // or a loading spinner
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <BackgroundAnimation />

      {/* Header */}
      <header className="container mx-auto px-4 py-6 relative z-10">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image src="/logo.svg" alt="Nexus" width={50} height={50} priority />
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">
              Nexus
            </span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="hover:text-teal-500 transition-colors">Features</a>
            <a href="#demo" className="hover:text-teal-500 transition-colors">Demo</a>
            <a href="#how-it-works" className="hover:text-teal-500 transition-colors">How it Works</a>
            <a href="#waitlist" className="hover:text-teal-500 transition-colors">Join Waitlist</a>
          </div>
        </nav>
      </header>

      {/* Updated Hero Section */}
      <section className="container mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <span className="px-4 py-2 rounded-full bg-gradient-to-r from-teal-500/10 to-purple-500/10 text-teal-500 text-sm font-medium mb-4 inline-block">
            Create • Mint • Trade
          </span>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">
            Your All-in-One Digital Art Platform
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-300">
            Create, mint, and trade digital art NFTs seamlessly on NEAR blockchain. Professional tools, low fees, and instant settlement - all in one platform.
          </p>

          {/* Hero Waitlist Form */}
          <div className="max-w-md mx-auto mb-10">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-grow px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 focus:border-teal-500 focus:outline-none transition-colors"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  className={`px-6 py-3 bg-gradient-to-r from-teal-500 to-purple-500 rounded-lg 
                    hover:opacity-90 transition-opacity flex items-center justify-center space-x-2
                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isSubmitting}
                >
                  <span>{isSubmitting ? 'Joining...' : 'Join Waitlist'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
            
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-red-500"
              >
                {error}
              </motion.p>
            )}
            
            {isSubmitted && !error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-teal-500"
              >
                Thanks for joining! We&apos;ll notify you when we launch.
              </motion.p>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link 
              href={AppConfig.landingPage.cta.primary.href}
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-purple-500 rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
            >
              <Play className="w-5 h-5" />
              <span>{AppConfig.landingPage.cta.primary.text}</span>
            </Link>
            <a 
              href={AppConfig.landingPage.cta.secondary.href}
              className="px-8 py-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              {AppConfig.landingPage.cta.secondary.text}
            </a>
          </div>

          {/* Updated Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-500">Near</div>
              <div className="text-gray-400 mt-2">Blockchain</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-500">Instant</div>
              <div className="text-gray-400 mt-2">Minting</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-500">Low</div>
              <div className="text-gray-400 mt-2">Transaction Fees</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-500">∞</div>
              <div className="text-gray-400 mt-2">Canvas</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">
              Sneak Peak
            </h2>
            <Carousel
              images={[
                {
                  src: '/dark-demo.png',
                  alt: 'Dashboard Overview'
                },
                {
                  src: '/light-demo.png',
                  alt: 'Canvas Editor'
                },
               
                // Add more screenshots as needed
              ]}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-20 bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">
            Why Choose Nexus
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Paintbrush className="h-12 w-12 text-teal-500" />}
              title="Professional Creation Tools"
              description="Access professional-grade digital art tools with an infinite canvas workspace and built-in design features."
            />
            <FeatureCard
              icon={<Zap className="h-12 w-12 text-teal-500" />}
              title="Instant NFT Minting"
              description="Convert your artwork to NFTs with one click. Seamless integration with NEAR blockchain for fast, low-cost minting."
            />
            <FeatureCard
              icon={<Rocket className="h-12 w-12 text-teal-500" />}
              title="Built-in Marketplace"
              description="Trade your digital art NFTs with low fees, instant settlement, and secure ownership verification."
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-20 relative z-10 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-20 bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">
            How it Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <StepCard
              number={1}
              icon={<Palette className="h-12 w-12 text-teal-500" />}
              title="Create"
              description="Use our professional-grade tools to create your digital masterpiece on an infinite canvas."
            />
            <StepCard
              number={2}
              icon={<Laptop className="h-12 w-12 text-teal-500" />}
              title="Mint"
              description="Convert your artwork to an NFT with one click using NEAR blockchain."
            />
            <StepCard
              number={3}
              icon={<Rocket className="h-12 w-12 text-teal-500" />}
              title="List"
              description="Set your price and list your NFT on our integrated marketplace."
            />
            <StepCard
              number={4}
              icon={<Bell className="h-12 w-12 text-teal-500" />}
              title="Sell"
              description="Reach collectors globally with instant settlements and secure transactions."
            />
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist" className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">
              Be the First to Know
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Join our waitlist and get early access when we launch.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-grow px-4 py-3 rounded-lg bg-gray-900 border border-gray-800 focus:border-teal-500 focus:outline-none transition-colors"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  className={`px-6 py-3 bg-gradient-to-r from-teal-500 to-purple-500 rounded-lg 
                    hover:opacity-90 transition-opacity flex items-center justify-center space-x-2
                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isSubmitting}
                >
                  <span>{isSubmitting ? 'Joining...' : 'Join Waitlist'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
            
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-red-500"
              >
                {error}
              </motion.p>
            )}
            
            {isSubmitted && !error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-teal-500"
              >
                Thanks for joining! We&apos;ll notify you when we launch.
              </motion.p>
            )}
          </div>
        </div>
      </section>

      {/* Updated Footer */}
      <footer className="py-12 relative z-10 border-t border-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image src="/logo.svg" alt="Nexus" width={40} height={40} />
                <span className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">
                  Nexus
                </span>
              </div>
              <p className="text-gray-400">
                Empowering artists with an end-to-end digital art creation and NFT trading platform.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-teal-500 transition-colors">Features</a></li>
                <li><a href="#demo" className="hover:text-teal-500 transition-colors">Demo</a></li>
                <li><a href="#how-it-works" className="hover:text-teal-500 transition-colors">How it Works</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-teal-500 transition-colors">About</Link></li>
                <li><Link href="/privacy" className="hover:text-teal-500 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-teal-500 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href={`mailto:${AppConfig.contactEmail}`} className="hover:text-teal-500 transition-colors">Email Us</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} Nexus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      className="p-6 rounded-lg bg-gradient-to-b from-gray-900 to-black border border-gray-800"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  )
}

function StepCard({ number, icon, title, description }: { number: number; icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      className="relative p-6 rounded-lg bg-gradient-to-b from-gray-900 to-black border border-gray-800"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="absolute -top-4 left-6 bg-gradient-to-r from-teal-500 to-purple-500 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold">
        {number}
      </div>
      <div className="mt-4">
        {icon}
        <h3 className="text-xl font-semibold mt-4 mb-2 text-white">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>
    </motion.div>
  )
}

function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 z-0">
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle, rgba(20, 184, 166, 0.2) 0%, rgba(0, 0, 0, 1) 100%)",
            "radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, rgba(0, 0, 0, 1) 100%)",
            "radial-gradient(circle, rgba(20, 184, 166, 0.2) 0%, rgba(0, 0, 0, 1) 100%)",
          ],
        }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 10 }}
      />
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-gradient-to-r from-teal-500 to-purple-500 rounded-full"
          style={{
            width: Math.random() * 2 + 1,
            height: Math.random() * 2 + 1,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * 100 - 50],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: Math.random() * 5 + 5,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}
