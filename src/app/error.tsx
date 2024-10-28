'use client'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Home, RefreshCcw } from 'lucide-react'
import { AppConfig } from '@/config/appConfig'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to your error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {/* Error Icon */}
          <div className="mb-8">
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
              className="inline-block"
            >
              <span className="text-6xl">⚠️</span>
            </motion.div>
          </div>

          {/* Error Message */}
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-400 mb-8">
            {error.message || "We're having trouble processing your request. Please try again."}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="px-6 py-3 bg-gradient-to-r from-teal-500 to-purple-500 rounded-lg 
                hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
            >
              <RefreshCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>

            <Link
              href="/"
              className="px-6 py-3 bg-white/10 rounded-lg hover:bg-white/20 
                transition-colors flex items-center justify-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Error Details (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-gray-900 rounded-lg text-left">
              <p className="text-sm font-mono text-gray-400 break-all">
                {error.stack}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 text-sm text-gray-500">
            <p>© {new Date().getFullYear()} {AppConfig.appName}</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
