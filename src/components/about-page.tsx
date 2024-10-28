'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Github, Twitter, Linkedin } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { AppConfig } from '@/config/appConfig'
import { useHasMounted } from '@/hooks/useHasMounted'
import { getTwitterProfileImage } from '@/utils/twitter'

export function AboutPage() {
  const hasMounted = useHasMounted()

  if (!hasMounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <BackgroundAnimation />

      {/* Header */}
      <header className="container mx-auto px-4 py-6 relative z-10">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-6 h-6" />
              <span>Back</span>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.svg"
              alt={AppConfig.appName}
              width={40}
              height={40}
              priority
            />
            <span className="text-xl font-bold bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">
              {AppConfig.appName}
            </span>
          </div>
        </nav>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">
            About {AppConfig.appName}
          </h1>

          <div className="space-y-12 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Our Mission</h2>
              <p className="text-lg leading-relaxed">
                At {AppConfig.appName}, we're revolutionizing digital art creation and ownership through blockchain technology.
                Our platform empowers artists to create, mint, and truly own their digital creations with unprecedented ease and security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">The Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {AppConfig.team.map((member, index) => (
                  <TeamMember
                    key={index}
                    name={member.name}
                    role={member.role}
                    image={member.avatar}
                    twitter={member.twitter}
                  />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Our Vision</h2>
              <p className="text-lg leading-relaxed">
                We envision a future where digital artists have complete control over their creations,
                supported by a vibrant community and powered by cutting-edge blockchain technology.
                {AppConfig.appName} is more than just a platform—it's a movement towards democratizing digital art.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">Contact Us</h2>
              <p className="text-lg leading-relaxed mb-6">
                Have questions or suggestions? We'd love to hear from you!
              </p>
              <div className="flex space-x-6">
                <a
                  href="mailto:studionexus@duck.com"
                  className="px-6 py-3 bg-gradient-to-r from-teal-500 to-purple-500 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Email Us
                </a>
              
              </div>
            </section>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-8 relative z-10 border-t border-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center">
            <span className="text-sm text-gray-400">
              © {new Date().getFullYear()} {AppConfig.appName}. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}

function TeamMember({
  name,
  role,
  image,
  twitter,
}: {
  name: string;
  role: string;
  image: string;
  twitter: string;
}) {
  const [profileImage, setProfileImage] = useState(image)

  useEffect(() => {
    // Try to load Twitter profile image
    const twitterImage = getTwitterProfileImage(twitter)
    
    // Check if image loads successfully
    const img = document.createElement('img')
    img.onload = () => {
      setProfileImage(twitterImage)
    }
    img.src = twitterImage
  }, [twitter, image])

  return (
    <div className="text-center">
      <div className="relative w-32 h-32 mx-auto mb-4">
        <Image
          src={profileImage}
          alt={`${name} - ${role}`}
          fill
          className="rounded-full object-cover"
          unoptimized // Add this for external URLs
        />
      </div>
      <h3 className="text-xl font-semibold text-white">{name}</h3>
      <p className="text-gray-400 mb-4">{role}</p>
      <div className="flex justify-center space-x-4">
        <a
          href={twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-teal-500 transition-colors"
          aria-label={`Visit ${name}'s Twitter profile`}
        >
          <span className="sr-only">Twitter profile of {name}</span>
          <Twitter className="w-5 h-5" aria-hidden="true" />
        </a>
      </div>
    </div>
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
        transition={{ repeat: Infinity, duration: 10 }}
      />
    </div>
  )
}
