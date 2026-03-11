import Image from 'next/image'
import type { BrandLogoData } from '@/types'
import styles from './BrandLogoSection.module.css'

interface Props {
  data: BrandLogoData
}

export default function BrandLogoSection({ data }: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.pageWidth}>
        <div className={styles.wrapper}>

          <div className={styles.subtitle}>{data.sub_title}</div>
          <div className={styles.desc}>{data.title}</div>

          {/* Project images grid */}
          <div className={styles.grid}>
            {data.slides.map((slide, i) => (
              <div key={i} className={styles.gridItem}>
                <Image
                  src={slide.images.url}
                  alt={slide.images.alt || ''}
                  width={80}
                  height={50}
                  style={{ objectFit: 'contain' }}
                  unoptimized
                />
              </div>
            ))}
            {/* "+ Many more" button */}
            <div className={styles.gridItem}>
              <span className={styles.moreBtn}>+ Many more</span>
            </div>
          </div>

          {/* Partner logos row */}
          <div className={styles.logosRow}>
            {data.brandslogo.map((brand, i) => (
              <Image
                key={i}
                src={brand.brand_image.url}
                alt={brand.brand_image.alt || ''}
                width={120}
                height={28}
                style={{ objectFit: 'contain', height: '28px', width: 'auto' }}
                unoptimized
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
