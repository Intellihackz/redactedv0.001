'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Home } from 'lucide-react'
import { AppConfig } from '@/config/appConfig'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {/* 404 Icon */}
          <div className="mb-8">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
              className="inline-block"
            >
              <span className="text-8xl font-bold bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">
                404
              </span>
            </motion.div>
          </div>

          {/* Message */}
          <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
          <p className="text-gray-400 mb-8">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Action Button */}
          <div className="flex justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-purple-500 rounded-lg 
                hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Footer */}
          <div className="mt-12 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} {AppConfig.appName}</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
