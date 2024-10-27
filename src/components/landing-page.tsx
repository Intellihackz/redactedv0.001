'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Infinity } from 'lucide-react'
import { AppConfig } from '@/config/appConfig'
import Link from 'next/link'
import Image from 'next/image'
import emailjs from '@emailjs/browser'
import { EmailConfig } from '@/config/emailConfig'
import confetti from 'canvas-confetti'

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

export function LandingPage() {
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

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <BackgroundAnimation />

      {/* Header Section */}
      <header className="container mx-auto px-4 py-6 relative z-10">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image 
              src="/logo.svg" 
              alt={AppConfig.appName} 
              width={50} 
              height={50}
              priority
            />
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">
              {AppConfig.appName}
            </span>
          </div>
          <div className="hidden md:flex space-x-6">
            <a href="#features" className="hover:text-teal-500 transition-colors">Features</a>
            <a href="#waitlist" className="hover:text-teal-500 transition-colors">Join Waitlist</a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">
            Coming Soon
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-gray-300">
            {AppConfig.appDescription}
          </p>
          
          {/* Waitlist Form */}
          <div id="waitlist" className="max-w-md mx-auto">
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
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">
            What to Expect
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {AppConfig.landingPage.features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={<Infinity className="h-12 w-12 text-teal-500" />}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 relative z-10 border-t border-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center">
            <div className="w-full md:w-auto mb-8 md:mb-0">
              <div className="flex items-center space-x-2 mb-4">
                <Infinity className="h-8 w-8 text-teal-500" />
                <span className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">
                  {AppConfig.appName}
                </span>
              </div>
              <p className="text-sm text-gray-400">Version: {AppConfig.appVersion}</p>
            </div>
            <div className="flex space-x-6 text-gray-400">
              <Link href="/privacy" className="hover:text-teal-500 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-teal-500 transition-colors">
                Terms of Service
              </Link>
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
