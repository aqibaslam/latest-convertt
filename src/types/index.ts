export interface HeroData {
  twenty_k_heading: string
  project_managed_heading: string
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
  title: string
  before_image: { url: string; alt: string }
  after_image: { url: string; alt: string }
  before_desk_image: { url: string; alt: string }
  after_desk_image: { url: string; alt: string }
  categories: string[]
}

export interface CaseStudySectionData {
  section_label: string
  section_title: string
  cta_text: string
  cta_url: string
  case_studies: CaseStudyItem[]
}

export interface StoryItem {
  id: number
  video_vimeo_link: string
  name: string
  title: string
  thumbnail: string
}

export interface ClientStoriesData {
  stories_subtitle: string
  stories_title: string
  stories_cta: string
  stories_cta_url: string
  reviews: StoryItem[]
}
