'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import type { CaseStudySectionData, CaseStudyItem } from '@/lib/api'
import styles from './CaseStudySection.module.css'

const CATEGORIES = [
  { slug: 'all', label: 'All Industries', icon: '' },
  { slug: 'beauty', label: 'Beauty', icon: '💄' },
  { slug: 'supplements', label: 'Supplements', icon: '💊' },
  { slug: 'ecommerce', label: 'eCommerce', icon: '🛒' },
  { slug: 'clothing', label: 'Clothing', icon: '👔' },
  { slug: 'food-beverage', label: 'Food & Beverage', icon: '🍔' },
  { slug: 'jewelry', label: 'Jewelry', icon: '💎' },
]

interface Props {
  data: CaseStudySectionData
}

function HoverScrollImage({ src, alt }: { src: string; alt: string }) {
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (!imgRef.current || !containerRef.current) return
    const containerH = containerRef.current.offsetHeight
    const imgH = imgRef.current.offsetHeight
    const diff = imgH - containerH
    if (diff > 0) {
      imgRef.current.style.transition = 'transform 8s ease'
      imgRef.current.style.transform = `translateY(-${diff}px)`
    }
  }

  const handleMouseLeave = () => {
    if (!imgRef.current) return
    imgRef.current.style.transition = 'transform 0.5s ease'
    imgRef.current.style.transform = 'translateY(0)'
  }

  return (
    <div
      ref={containerRef}
      className={styles.imageContainer}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={imgRef} src={src} alt={alt} loading="lazy" className={styles.scrollImg} />
    </div>
  )
}

function SlideCard({ cs, isMobile }: { cs: CaseStudyItem; isMobile: boolean }) {
  return (
    <div className={styles.slideContent}>
      <div className={styles.slideInner}>
        {/* Desktop view */}
        {!isMobile && (
          <div className={styles.deviceDesktop}>
            <div className={styles.imageSection}>
              <div className={styles.sectionTag}>BEFORE</div>
              <div className={styles.imagesWrapper}>
                <HoverScrollImage src={cs.before_desk_image.url} alt={cs.before_title} />
              </div>
              <div className={styles.scrollHint}>
                <span>Hover to scroll</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 13V3M8 3L12 7M8 3L4 7" stroke="#808080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className={styles.imageSection}>
              <div className={styles.sectionTag}>AFTER</div>
              <div className={styles.imagesWrapper}>
                <HoverScrollImage src={cs.after_desk_image.url} alt={cs.after_title} />
              </div>
              <div className={styles.scrollHint}>
                <span>Hover to scroll</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 13V3M8 3L12 7M8 3L4 7" stroke="#808080" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        )}
        {/* Mobile view */}
        {isMobile && (
          <div className={styles.deviceMobile}>
            <div className={styles.imageSection}>
              <div className={styles.sectionTag}>BEFORE</div>
              <div className={styles.imagesWrapper}>
                <HoverScrollImage src={cs.before_image.url} alt={cs.before_title} />
              </div>
            </div>
            <div className={styles.imageSection}>
              <div className={styles.sectionTag}>AFTER</div>
              <div className={styles.imagesWrapper}>
                <HoverScrollImage src={cs.after_image.url} alt={cs.after_title} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CaseStudySection({ data }: Props) {
  const [activeTab, setActiveTab] = useState('all')
  const [isMobile, setIsMobile] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const filtered = activeTab === 'all'
    ? data.case_studies
    : data.case_studies.filter(cs => cs.categories.includes(activeTab))

  // Reset index on tab change
  useEffect(() => { setCurrentIndex(0) }, [activeTab])

  const prev = () => setCurrentIndex(i => Math.max(0, i - 1))
  const next = () => setCurrentIndex(i => Math.min(filtered.length - 1, i + 1))

  // Count per category
  const countFor = (slug: string) =>
    slug === 'all'
      ? data.case_studies.length
      : data.case_studies.filter(cs => cs.categories.includes(slug)).length

  return (
    <section className={styles.section}>
      <div className={styles.pageWidth}>

        {/* Header */}
        <div className={styles.sectionHeader}>
          <div className={styles.sectionLabel}>{data.section_label}</div>
          <h2 className={styles.sectionTitle}>{data.section_title}</h2>
        </div>

        <div className={styles.container}>
          {/* Sidebar */}
          <div className={styles.allTabsContainer}>
            <div className={styles.sidebar}>
              <div className={styles.industriesHeader}>
                <span className={styles.industriesTitle}>Industries</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M6 12L10 8L14 12" stroke="black" strokeWidth="1.44" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className={styles.tabsContainer}>
                {CATEGORIES.filter(c => countFor(c.slug) > 0).map(cat => (
                  <button
                    key={cat.slug}
                    className={`${styles.tab} ${activeTab === cat.slug ? styles.tabActive : ''}`}
                    onClick={() => setActiveTab(cat.slug)}
                  >
                    {cat.icon && <span>{cat.icon}</span>}
                    <span className={styles.tabText}>{cat.label}</span>
                    <span className={styles.tabCount}>({countFor(cat.slug)})</span>
                  </button>
                ))}
              </div>
            </div>

            <a href={data.cta_url} className={styles.ctaButton}>
              {data.cta_text}
              <Image
                src="https://convertt.co/wp-content/uploads/2026/02/Arrow-Placeholder-1.svg"
                alt=""
                width={40}
                height={40}
                unoptimized
                style={{ borderRadius: '50%', background: '#fff' }}
              />
            </a>
          </div>

          {/* Content */}
          <div className={styles.contentArea}>
            {/* Device toggle */}
            <div className={styles.deviceToggle}>
              <span className={styles.deviceLabel}>Desktop</span>
              <label className={styles.toggleSwitch}>
                <input
                  type="checkbox"
                  checked={isMobile}
                  onChange={e => setIsMobile(e.target.checked)}
                />
                <span className={styles.toggleSlider} />
              </label>
              <span className={styles.deviceLabel}>Mobile</span>
            </div>

            {/* Slide */}
            {filtered.length > 0 && (
              <div className={styles.slideWrapper}>
                <SlideCard cs={filtered[currentIndex]} isMobile={isMobile} />

                {/* Controls */}
                <div className={styles.controls}>
                  <button
                    className={styles.navBtn}
                    onClick={prev}
                    disabled={currentIndex === 0}
                    aria-label="Previous"
                  >
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path d="M3.267 7.005H12.304V5.299H3.267L7.369 1.197L6.152 0L0 6.152L6.152 12.304L7.369 11.106L3.267 7.005Z" fill="#1E1E1E" />
                    </svg>
                  </button>
                  <div className={styles.pagination}>
                    {filtered.map((_, i) => (
                      <button
                        key={i}
                        className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ''}`}
                        onClick={() => setCurrentIndex(i)}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                  </div>
                  <button
                    className={styles.navBtn}
                    onClick={next}
                    disabled={currentIndex === filtered.length - 1}
                    aria-label="Next"
                  >
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                      <path d="M9.037 7.005H0V5.299H9.037L4.935 1.197L6.152 0L12.304 6.152L6.152 12.304L4.935 11.106L9.037 7.005Z" fill="#FF462E" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
