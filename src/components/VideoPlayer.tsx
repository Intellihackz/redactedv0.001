'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, Loader2 } from 'lucide-react'
import Image from 'next/image'
import ReactPlayer from 'react-player'
import { useHasMounted } from '@/hooks/useHasMounted'

interface VideoPlayerProps {
  thumbnailUrl: string
  videoUrl: string
}

export function VideoPlayer({ thumbnailUrl, videoUrl }: VideoPlayerProps) {
  const hasMounted = useHasMounted()
  const [isPlaying, setIsPlaying] = useState(false)
  const [showThumbnail, setShowThumbnail] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<ReactPlayer>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting)
          if (!entry.isIntersecting && isPlaying) {
            setIsPlaying(false)
            setShowThumbnail(true)
          }
        })
      },
      {
        threshold: 0.5 // Trigger when 50% of the player is visible
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [isPlaying])

  // Handle visibility change when tab/window is hidden
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isPlaying) {
        setIsPlaying(false)
        setShowThumbnail(true)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isPlaying])

  const handlePlayClick = async () => {
    if (isReady && isVisible) {
      if (isPlaying) {
        setIsPlaying(false)
        setShowThumbnail(true)
      } else {
        setIsLoading(true)
        try {
          setIsPlaying(true)
          setShowThumbnail(false)
        } catch (error) {
          console.error('Error playing video:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }
  }

  const handleReady = () => {
    setIsReady(true)
    setIsLoading(false)
  }

  const handleBuffer = () => {
    setIsLoading(true)
  }

  const handleBufferEnd = () => {
    setIsLoading(false)
  }

  const handleError = (error: any) => {
    console.error('Video error:', error)
    setIsLoading(false)
    setIsPlaying(false)
    setShowThumbnail(true)
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setShowThumbnail(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
    setShowThumbnail(true)
  }

  if (!hasMounted) {
    return (
      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl">
        <Image
          src={thumbnailUrl}
          alt="Video Thumbnail"
          fill
          className="object-cover"
        />
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className="relative aspect-video rounded-lg overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl"
    >
      {showThumbnail && (
        <div className="absolute inset-0 z-10">
          <Image
            src={thumbnailUrl}
            alt="Video Thumbnail"
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <div className="absolute inset-0">
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          width="100%"
          height="100%"
          playing={isPlaying && isVisible}
          onReady={handleReady}
          onBuffer={handleBuffer}
          onBufferEnd={handleBufferEnd}
          onError={handleError}
          onEnded={handleEnded}
          onPause={handlePause}
          controls={!showThumbnail}
          config={{
            youtube: {
              playerVars: { 
                showinfo: 1, 
                controls: 1,
                rel: 0, // Disable related videos
                modestbranding: 1 // Hide YouTube logo
              }
            },
            vimeo: {
              playerOptions: { 
                title: true, 
                byline: true,
                dnt: true // Do Not Track
              }
            }
          }}
        />
      </div>

      {showThumbnail && (
        <button
          onClick={handlePlayClick}
          disabled={isLoading || !isReady || !isVisible}
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 20 }}
          aria-label={isLoading ? "Loading video" : "Play video"}
          title={isLoading ? "Loading video" : "Play video"}
        >
          <span className="sr-only">
            {isLoading ? "Loading video" : "Play video"}
          </span>
          {isLoading ? (
            <div 
              className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center"
              role="status"
              aria-label="Loading"
            >
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-110">
              <Play className="w-10 h-10 text-white fill-white" aria-hidden="true" />
            </div>
          )}
        </button>
      )}

      {/* Loading Progress Indicator */}
      {isLoading && (
        <div 
          className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800"
          role="progressbar"
          aria-label="Loading progress"
          style={{ zIndex: 20 }}
        >
          <div className="h-full bg-gradient-to-r from-teal-500 to-purple-500 animate-progress" />
        </div>
      )}
    </div>
  )
}
