'use client'
import { useEffect, useRef } from 'react'
import Image from 'next/image'
import styles from './MarqueeSection.module.css'

interface MarqueeItem {
  marquee_image: { url: string; alt: string }
}

interface Props {
  items: MarqueeItem[]
}

export default function MarqueeSection({ items }: Props) {
  const trackRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (trackRef.current && contentRef.current) {
      const clone = contentRef.current.cloneNode(true) as HTMLElement
      clone.setAttribute('aria-hidden', 'true')
      trackRef.current.appendChild(clone)
    }
  }, [])

  return (
    <section className={styles.marqueeSection}>
      <div className={styles.container}>
        <div className={styles.track} ref={trackRef}>
          <div className={styles.content} ref={contentRef}>
            {items.map((item, i) => (
              <div key={i} className={styles.card}>
                <Image
                  src={item.marquee_image.url}
                  alt={item.marquee_image.alt}
                  fill
                  style={{ objectFit: 'cover', borderRadius: '8px' }}
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
