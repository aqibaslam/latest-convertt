import Image from 'next/image'
import type { HeroData } from '@/types'
import styles from './HeroSection.module.css'
import MarqueeSection from './MarqueeSection'

interface Props {
  data: HeroData
}

export default function HeroSection({ data }: Props) {
  return (
    <div className={styles.mainBg}>
      {/* ---- HERO ---- */}
      <section className={styles.heroRoi}>
        <div className={styles.pageWidth}>
          <div className={styles.wrapper}>

            {/* Badge */}
            <div className={styles.badge}>
              <span className={styles.badgeGradient}>{data.twenty_k_heading}</span>
              <span className={styles.badgeText}>{data.project_managed_heading}</span>
            </div>

            {/* Title */}
            <h1
              className={styles.heroTitle}
              dangerouslySetInnerHTML={{ __html: data.hero_title }}
            />

            {/* Benefits */}
            <div className={styles.benefits}>
              {data.hero_listing.map((item, i) => (
                <div key={i} className={styles.benefitItem}>
                  <Image
                    src="https://convertt.co/wp-content/uploads/2026/02/teenyicons_tick-circle-outline.svg"
                    alt=""
                    width={20}
                    height={20}
                    unoptimized
                  />
                  <span>{item.list_heading}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <a href={data.hero_cta_url} className={styles.ctaBtn}>
              {data.hero_cta}
              <Image
                className={styles.ctaArrow}
                src="https://convertt.co/wp-content/uploads/2026/02/Arrow-Placeholder-1.svg"
                alt=""
                width={40}
                height={40}
                unoptimized
              />
            </a>

            {/* Rating */}
            <div className={styles.rating}>
              <p dangerouslySetInnerHTML={{ __html: data.hero_rating_heading }} />
            </div>

          </div>
        </div>
      </section>

      {/* ---- MARQUEE ---- */}
      <MarqueeSection items={data.hero_marquee_block} />
    </div>
  )
}
