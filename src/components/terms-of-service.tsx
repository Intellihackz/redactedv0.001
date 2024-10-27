'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { AppConfig } from '@/config/appConfig'
import Image from 'next/image'
import { useHasMounted } from '@/hooks/useHasMounted'

export function TermsOfService() {
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
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">
            Terms of Service
          </h1>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">1. Acceptance of Terms</h2>
              <p>
                By accessing and using {AppConfig.appName}, you agree to be bound by these Terms of Service 
                and all applicable laws and regulations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">2. User Responsibilities</h2>
              <p>As a user of {AppConfig.appName}, you agree to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Provide accurate information</li>
                <li>Maintain the security of your account</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Respect intellectual property rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">3. NFT Minting and Ownership</h2>
              <p>When minting NFTs on our platform:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>You retain ownership of your original artwork</li>
                <li>You grant us license to display and promote your NFTs</li>
                <li>You are responsible for any fees associated with minting</li>
                <li>You warrant that you have the right to mint the content</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">4. Platform Usage</h2>
              <p>We reserve the right to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Modify or terminate services for any reason</li>
                <li>Remove content that violates our policies</li>
                <li>Update these terms at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">5. Limitation of Liability</h2>
              <p>
                {AppConfig.appName} is provided &quot;as is&quot; without warranties of any kind.
              </p>
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
