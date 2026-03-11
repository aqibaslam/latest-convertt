// ============================================================
// Types — yahan se API ke sath data shapes define hain
// Agar aapki API different fields return kare to sirf
// yahan update karein, baki components automatically adjust honge
// ============================================================

export interface HeroData {
  twenty_k_heading: string       // e.g. "3.5X"
  project_managed_heading: string // e.g. "Average conversion uplift"
  hero_title: string
  hero_cta: string
  hero_cta_url: string
  hero_rating_heading: string
  hero_listing: { list_heading: string }[]
  hero_marquee_block: { marquee_image: { url: string; alt: string } }[]
}

export interface BrandLogoData {
  title: string
  sub_title: string
  slides: { images: { url: string; alt: string } }[]
  brandslogo: { brand_image: { url: string; alt: string } }[]
}

export interface CaseStudyItem {
  id: number
  before_title: string
  after_title: string
  before_image: { url: string; alt: string }
  after_image: { url: string; alt: string }
  before_desk_image: { url: string; alt: string }
  after_desk_image: { url: string; alt: string }
  categories: string[] // slugs: ['beauty', 'supplements', etc.]
}

export interface CaseStudySectionData {
  section_label: string
  section_title: string
  cta_text: string
  cta_url: string
  case_studies: CaseStudyItem[]
}
