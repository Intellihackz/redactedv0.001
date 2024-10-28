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
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">1.1 Information You Provide</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Account information (email, username, profile details)</li>
                    <li>Blockchain wallet addresses</li>
                    <li>Digital artwork and NFT metadata</li>
                    <li>Communications with our support team</li>
                    <li>Survey responses and feedback</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">1.2 Automatically Collected Information</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Device information (browser type, IP address)</li>
                    <li>Usage data (features accessed, time spent)</li>
                    <li>Transaction data on public blockchains</li>
                    <li>Performance and error data</li>
                    <li>Cookies and similar technologies</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">2. How We Use Your Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">2.1 Core Service Provision</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Facilitating NFT creation and transactions</li>
                    <li>Managing your account and preferences</li>
                    <li>Processing payments and withdrawals</li>
                    <li>Providing customer support</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">2.2 Platform Improvement</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Analyzing usage patterns and trends</li>
                    <li>Debugging and optimizing performance</li>
                    <li>Developing new features</li>
                    <li>Personalizing user experience</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">2.3 Communications</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Service updates and announcements</li>
                    <li>Security alerts and notifications</li>
                    <li>Marketing communications (with consent)</li>
                    <li>Community engagement</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">3. Blockchain Data</h2>
              <p className="mb-4">
                Please be aware that blockchain networks are public, and certain information will be 
                visible to anyone, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Wallet addresses and transaction history</li>
                <li>NFT ownership and transfer records</li>
                <li>Smart contract interactions</li>
                <li>Token metadata and properties</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">4. Data Sharing and Disclosure</h2>
              <p className="mb-4">We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Other users (public profile information)</li>
                <li>Analytics and security services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">5. Data Security</h2>
              <p className="mb-4">We implement industry-standard security measures:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Encryption of sensitive data</li>
                <li>Regular security audits</li>
                <li>Access controls and monitoring</li>
                <li>Secure data storage and transmission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">6. Your Rights and Choices</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">6.1 Access and Control</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access your personal information</li>
                    <li>Update or correct your data</li>
                    <li>Request data deletion (where possible)</li>
                    <li>Export your data</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2 text-white">6.2 Communication Preferences</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Opt-out of marketing emails</li>
                    <li>Manage notification settings</li>
                    <li>Control cookie preferences</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">7. Children's Privacy</h2>
              <p>
                Our services are not intended for users under 18. We do not knowingly collect 
                information from children. If you believe we have collected information from a 
                child, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">8. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your own. 
                We ensure appropriate safeguards are in place for such transfers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">9. Changes to This Policy</h2>
              <p>
                We may update this policy periodically. We will notify you of significant changes 
                through our platform or via email.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">10. Contact Us</h2>
              <p>
                If you have questions about this privacy policy or your data, please contact our 
                privacy team at privacy@{AppConfig.appName.toLowerCase()}.com
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