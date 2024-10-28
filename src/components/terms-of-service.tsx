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
              <p className="mb-4">
                By accessing and using {AppConfig.appName}, you acknowledge that you have read, 
                understood, and agree to be bound by these Terms of Service. These terms govern 
                your access to and use of our digital art creation and NFT minting platform.
              </p>
              <p>
                We reserve the right to modify these terms at any time. Changes will be effective 
                immediately upon posting to the platform. Your continued use of {AppConfig.appName} 
                constitutes acceptance of any modifications.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">2. User Accounts</h2>
              <p className="mb-4">Users must:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Be at least 18 years old or have legal guardian consent</li>
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of account credentials</li>
                <li>Accept responsibility for all activities under their account</li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">3. Digital Art Creation</h2>
              <p className="mb-4">When using our creative tools:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>You retain ownership of your original artwork</li>
                <li>You must not violate any third-party intellectual property rights</li>
                <li>You grant us a non-exclusive license to display your work on the platform</li>
                <li>You accept responsibility for backing up your work</li>
                <li>We provide tools "as is" without guarantee of availability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">4. NFT Minting and Ownership</h2>
              <p className="mb-4">For NFT creation and trading:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>You warrant you have all necessary rights to mint the content</li>
                <li>You understand blockchain transactions are irreversible</li>
                <li>You are responsible for all associated gas fees and costs</li>
                <li>You grant us the right to display and promote your NFTs</li>
                <li>Smart contract terms are supplementary to these terms</li>
                <li>We are not responsible for third-party marketplace interactions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">5. Prohibited Activities</h2>
              <p className="mb-4">Users must not:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Mint content that infringes on intellectual property rights</li>
                <li>Use the platform for illegal activities</li>
                <li>Attempt to manipulate platform metrics or rankings</li>
                <li>Harass other users or engage in abusive behavior</li>
                <li>Circumvent platform security measures</li>
                <li>Scrape or copy platform content without permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">6. Fees and Payments</h2>
              <p className="mb-4">
                Users are responsible for:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>All applicable platform fees</li>
                <li>Blockchain network gas fees</li>
                <li>Any applicable taxes</li>
                <li>Payment processing fees</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">7. Intellectual Property</h2>
              <p className="mb-4">
                {AppConfig.appName} and its content are protected by copyright, trademark, and other laws. 
                Our platform, including its code, appearance, and functionality, remains our exclusive property.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">8. Limitation of Liability</h2>
              <p className="mb-4">
                {AppConfig.appName} is provided "as is" without warranties of any kind. We are not liable for:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Service interruptions or data loss</li>
                <li>Blockchain network issues or gas fee fluctuations</li>
                <li>Third-party marketplace actions</li>
                <li>User content or interactions</li>
                <li>Financial losses from trading or minting</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">9. Termination</h2>
              <p className="mb-4">
                We reserve the right to suspend or terminate accounts that violate these terms. 
                Upon termination:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Access to platform features will be revoked</li>
                <li>Minted NFTs will remain on the blockchain</li>
                <li>Outstanding fees must be paid</li>
                <li>License to display artwork may be revoked</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">10. Governing Law</h2>
              <p>
                These terms are governed by applicable laws. Any disputes will be resolved in 
                appropriate courts having jurisdiction.
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