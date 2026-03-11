'use client'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import type { ClientStoriesData, StoryItem } from '@/types/stories'
import styles from './ClientStoriesSection.module.css'

// Desktop initial: 8, mobile: 4
const DESKTOP_INITIAL = 8
const DESKTOP_PER_PAGE = 4
const MOBILE_INITIAL = 4
const MOBILE_PER_PAGE = 2

// --- Single Video Card ---
function VideoCard({ review, isMobile }: { review: StoryItem; isMobile: boolean }) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const sendMessage = (method: string, value?: number) => {
    if (!iframeRef.current?.contentWindow) return
    const msg = value !== undefined
      ? JSON.stringify({ method, value })
      : JSON.stringify({ method })
    iframeRef.current.contentWindow.postMessage(msg, '*')
  }

  const play = () => {
    sendMessage('play')
    setIsPlaying(true)
  }

  const pause = () => {
    sendMessage('pause')
    setIsPlaying(false)
  }

  // Listen for video ended
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (!e.data || typeof e.data !== 'string') return
      try {
        const data = JSON.parse(e.data)
        if (data.event === 'ended') {
          sendMessage('pause')
          sendMessage('setCurrentTime', 0)
          setIsPlaying(false)
        }
      } catch {}
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  return (
    <div
      className={`${styles.review} ${isPlaying ? styles.playing : ''}`}
      onMouseEnter={() => !isMobile && play()}
      onMouseLeave={() => !isMobile && pause()}
      onClick={() => {
        if (isPlaying) pause()
        else play()
      }}
    >
      <iframe
        ref={iframeRef}
        className={styles.video}
        src={`${review.video_vimeo_link}${review.video_vimeo_link.includes('?') ? '&' : '?'}api=1`}
        allow="autoplay; fullscreen"
        allowFullScreen
        title={review.name}
      />
      <div
        className={styles.videoOverlay}
        style={{ display: isPlaying ? 'none' : 'block' }}
      />
      <div
        className={styles.videoContent}
        style={{ display: isPlaying ? 'none' : 'block' }}
      >
        <div className={styles.nameRow}>
          <span className={styles.name}>{review.name}</span>
        </div>
        <div className={styles.jobTitle}>{review.title}</div>
      </div>
    </div>
  )
}

// --- Main Component ---
interface Props {
  data: ClientStoriesData
}

export default function ClientStoriesSection({ data }: Props) {
  const [desktopCount, setDesktopCount] = useState(DESKTOP_INITIAL)
  const [mobileCount, setMobileCount] = useState(MOBILE_INITIAL)
  const [loadingDesktop, setLoadingDesktop] = useState(false)
  const [loadingMobile, setLoadingMobile] = useState(false)

  const desktopReviews = data.reviews.slice(0, desktopCount)
  const mobileReviews = data.reviews.slice(0, mobileCount)
  const hasMoreDesktop = desktopCount < data.reviews.length
  const hasMoreMobile = mobileCount < data.reviews.length

  const loadMoreDesktop = () => {
    setLoadingDesktop(true)
    setTimeout(() => {
      setDesktopCount(c => Math.min(c + DESKTOP_PER_PAGE, data.reviews.length))
      setLoadingDesktop(false)
    }, 500)
  }

  const loadMoreMobile = () => {
    setLoadingMobile(true)
    setTimeout(() => {
      setMobileCount(c => Math.min(c + MOBILE_PER_PAGE, data.reviews.length))
      setLoadingMobile(false)
    }, 500)
  }

  return (
    <section className={styles.section} id="reviews">
      <div className={styles.pageWidth}>
        <div className={styles.wrapper}>

          {/* Subtitle */}
          <div className={styles.subtitle}>{data.stories_subtitle}</div>

          {/* Title + CTA row */}
          <div className={styles.titleRow}>
            <h2 className={styles.title}>{data.stories_title}</h2>
            <a href={data.stories_cta_url} className={styles.ctaBtn}>
              {data.stories_cta}
              <Image
                className={styles.ctaArrow}
                src="https://convertt.co/wp-content/uploads/2026/02/Arrow-Placeholder-1.svg"
                alt=""
                width={40}
                height={40}
                unoptimized
              />
            </a>
          </div>

          {/* ---- DESKTOP GRID (hidden on mobile) ---- */}
          <div className={styles.desktopOnly}>
            <div className={styles.grid}>
              {desktopReviews.map(review => (
                <VideoCard key={review.id} review={review} isMobile={false} />
              ))}
            </div>
            {hasMoreDesktop && (
              <div className={styles.loadMoreWrapper}>
                <button
                  className={styles.loadMoreBtn}
                  onClick={loadMoreDesktop}
                  disabled={loadingDesktop}
                >
                  {loadingDesktop ? 'Loading...' : 'See More'}
                  {!loadingDesktop && (
                    <Image
                      src="https://convertt.co/wp-content/uploads/2026/02/Arrow-Placeholder-3.svg"
                      alt=""
                      width={40}
                      height={40}
                      unoptimized
                    />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* ---- MOBILE GRID (hidden on desktop) ---- */}
          <div className={styles.mobileOnly}>
            <div className={styles.gridMobile}>
              {mobileReviews.map(review => (
                <VideoCard key={review.id} review={review} isMobile={true} />
              ))}
            </div>
            {hasMoreMobile && (
              <div className={styles.loadMoreWrapper}>
                <button
                  className={styles.loadMoreBtn}
                  onClick={loadMoreMobile}
                  disabled={loadingMobile}
                >
                  {loadingMobile ? 'Loading...' : 'See More'}
                  {!loadingMobile && (
                    <Image
                      src="https://convertt.co/wp-content/uploads/2026/02/Arrow-Placeholder-3.svg"
                      alt=""
                      width={40}
                      height={40}
                      unoptimized
                    />
                  )}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
