'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { AppConfig } from '@/config/appConfig'
import Image from 'next/image'
import { useHasMounted } from '@/hooks/useHasMounted'

export function PrivacyPolicy() {
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
            Privacy Policy
          </h1>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">1. Information We Collect</h2>
              <p>We collect information that you provide directly to us, including:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Account information (e.g., NEAR wallet address)</li>
                <li>User-generated content (e.g., artwork, NFTs)</li>
                <li>Communication preferences</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">2. How We Use Your Information</h2>
              <p>We use the collected information to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Provide and maintain our services</li>
                <li>Process your NFT transactions</li>
                <li>Send you updates and notifications</li>
                <li>Improve our platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">3. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information. 
                However, please note that no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">4. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
              </ul>
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
