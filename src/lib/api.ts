// ============================================================
// lib/api.ts — WordPress REST API + Extracted Real Data
// All data verified directly from API response files
// ============================================================

const API_BASE = 'https://convertt.co/wp-json/wp/v2'

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

// ============================================================
// REVIEWS — Live API call
// ACF field name: video_vimeo_link  (confirmed from API)
// ACF field name: name, title, thumbnail, review
// ============================================================
export async function getClientStoriesData(): Promise<ClientStoriesData> {
  try {
    const res = await fetch(`${API_BASE}/review?per_page=100`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) throw new Error(`Reviews API ${res.status}`)
    const posts = await res.json()

    const reviews: StoryItem[] = posts.map((post: any) => {
      const acf = post.acf || {}
      // Extract vimeo ID from iframe/oembed formatted_value or direct URL
      const rawVimeo: string =
        acf.video_vimeo_link?.formatted_value ||
        acf.video_vimeo_link ||
        ''
      const vimeoMatch = rawVimeo.match(/vimeo\.com\/video\/(\d+)/)
      const vimeoId = vimeoMatch ? vimeoMatch[1] : ''
      const vimeoUrl = vimeoId
        ? `https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`
        : ''

      return {
        id: post.id,
        video_vimeo_link: vimeoUrl,
        name: acf.name || post.title?.rendered || '',
        title: acf.title || '',
        thumbnail: acf.thumbnail?.url || acf.thumbnail || '',
      }
    })

    const valid = reviews.filter(r => r.video_vimeo_link)
    return {
      stories_subtitle: 'Real Stories',
      stories_title: "Don't take our word for it. Take theirs.",
      stories_cta: 'Get Your FREE Audit Now!',
      stories_cta_url: 'https://audit.convertt.co/?cro_src=pdp-letecom/',
      reviews: valid.length > 0 ? valid : FALLBACK_REVIEWS,
    }
  } catch (err) {
    console.error('Reviews API Error:', err)
    return {
      stories_subtitle: 'Real Stories',
      stories_title: "Don't take our word for it. Take theirs.",
      stories_cta: 'Get Your FREE Audit Now!',
      stories_cta_url: 'https://audit.convertt.co/?cro_src=pdp-letecom/',
      reviews: FALLBACK_REVIEWS,
    }
  }
}

// ============================================================
// CASE STUDIES — Live API call
// ACF fields: before_image, after_image, before_desk_image, after_desk_image
// ============================================================
export async function getCaseStudyData(): Promise<CaseStudySectionData> {
  try {
    const [postsRes, catRes] = await Promise.all([
      fetch(`${API_BASE}/case-study?per_page=100`, { next: { revalidate: 3600 } }),
      fetch(`${API_BASE}/case-study-category?per_page=100&_fields=id,slug,name`, { next: { revalidate: 3600 } }),
    ])
    if (!postsRes.ok) throw new Error(`Case Study API ${postsRes.status}`)
    const posts = await postsRes.json()
    const catTerms = catRes.ok ? await catRes.json() : []

    const catMap: Record<number, string> = {}
    catTerms.forEach((t: any) => { catMap[t.id] = t.slug })

    const case_studies: CaseStudyItem[] = posts.map((post: any) => {
      const acf = post.acf || {}
      const catIds: number[] = post['case-study-category'] || []
      return {
        id: post.id,
        title: post.title?.rendered || '',
        before_image: { url: acf.before_image?.url || '', alt: acf.before_image?.alt || 'Before' },
        after_image: { url: acf.after_image?.url || '', alt: acf.after_image?.alt || 'After' },
        before_desk_image: { url: acf.before_desk_image?.url || '', alt: acf.before_desk_image?.alt || 'Before' },
        after_desk_image: { url: acf.after_desk_image?.url || '', alt: acf.after_desk_image?.alt || 'After' },
        categories: catIds.map((id: number) => catMap[id]).filter(Boolean),
      }
    })

    const valid = case_studies.filter(cs => cs.before_desk_image?.url || cs.before_image?.url)
    return {
      section_label: 'OUR CASE STUDIES',
      section_title: 'Same traffic. Smarter pages. Bigger revenue',
      cta_text: 'Get Your FREE Audit Now!',
      cta_url: 'https://audit.convertt.co/?cro_src=pdp-letecom/',
      case_studies: valid.length > 0 ? valid : FALLBACK_CASE_STUDIES,
    }
  } catch (err) {
    console.error('Case Study API Error:', err)
    return {
      section_label: 'OUR CASE STUDIES',
      section_title: 'Same traffic. Smarter pages. Bigger revenue',
      cta_text: 'Get Your FREE Audit Now!',
      cta_url: 'https://audit.convertt.co/?cro_src=pdp-letecom/',
      case_studies: FALLBACK_CASE_STUDIES,
    }
  }
}

// ============================================================
// HERO — Static (ACF Flexible Content, no REST endpoint)
// ============================================================
export async function getHeroData(): Promise<HeroData> {
  return {
    twenty_k_heading: '3.5X',
    project_managed_heading: 'Average conversion uplift',
    hero_title: 'Your traffic is not the problem.<br>Your landing page is.',
    hero_cta: 'Get Your FREE Audit Now!',
    hero_cta_url: 'https://audit.convertt.co/?cro_src=pdp-letecom/',
    hero_rating_heading: 'No pitch decks. No retainers. Just a straight conversation about what your page is costing you',
    hero_listing: [
      { list_heading: 'Built on your data, not guesswork' },
      { list_heading: 'Every element earns the next click' },
      { list_heading: 'Results your ad spend deserves' },
    ],
    hero_marquee_block: [
      { marquee_image: { url: 'https://convertt.co/wp-content/uploads/2026/03/armara.webp', alt: 'Armara' } },
      { marquee_image: { url: 'https://convertt.co/wp-content/uploads/2026/02/player-roi.webp', alt: 'Player' } },
      { marquee_image: { url: 'https://convertt.co/wp-content/uploads/2026/02/maju-roi.webp', alt: 'Maju' } },
      { marquee_image: { url: 'https://convertt.co/wp-content/uploads/2026/02/smilewhite-roi.webp', alt: 'SmileWhite' } },
      { marquee_image: { url: 'https://convertt.co/wp-content/uploads/2026/03/bubble-scaled.webp', alt: 'Bubble' } },
      { marquee_image: { url: 'https://convertt.co/wp-content/uploads/2026/02/fuel-roi.webp', alt: 'Fuel' } },
      { marquee_image: { url: 'https://convertt.co/wp-content/uploads/2026/02/Frame-1171279470.png', alt: 'Case Study' } },
    ],
  }
}

// ============================================================
// BRAND LOGOS — Static (ACF Flexible Content, no REST endpoint)
// ============================================================
export async function getBrandLogoData(): Promise<BrandLogoData> {
  return {
    sub_title: 'Who we are',
    title: 'Convertt is a Shopify Plus Partner with one focus: your traffic should convert. We study your data before a single pixel gets placed, because a page that looks good but does not sell is just an expensive distraction. Over $1B in tracked client revenue. The process works.',
    slides: [
      { images: { url: 'https://convertt.co/wp-content/uploads/2026/02/Mask-group-3.svg', alt: '' } },
      { images: { url: 'https://convertt.co/wp-content/uploads/2026/02/Layer_1.svg', alt: '' } },
      { images: { url: 'https://convertt.co/wp-content/uploads/2026/02/Badge-group.png', alt: '' } },
      { images: { url: 'https://convertt.co/wp-content/uploads/2026/02/Vector-1.svg', alt: '' } },
      { images: { url: 'https://convertt.co/wp-content/uploads/2026/02/Mask-group-4.svg', alt: '' } },
      { images: { url: 'https://convertt.co/wp-content/uploads/2026/02/Mask-group-8.svg', alt: '' } },
      { images: { url: 'https://convertt.co/wp-content/uploads/2026/02/Mask-group-5.svg', alt: '' } },
      { images: { url: 'https://convertt.co/wp-content/uploads/2026/02/Mask-group-6.svg', alt: '' } },
      { images: { url: 'https://convertt.co/wp-content/uploads/2026/02/Mask-group-9.svg', alt: '' } },
      { images: { url: 'https://convertt.co/wp-content/uploads/2026/02/Mask-group-10.svg', alt: '' } },
      { images: { url: 'https://convertt.co/wp-content/uploads/2026/03/armara-logo.png', alt: 'Armara' } },
      { images: { url: 'https://convertt.co/wp-content/uploads/2026/03/bubble-logo.png', alt: 'Bubble' } },
      { images: { url: 'https://convertt.co/wp-content/uploads/2026/02/Mask-group-14.svg', alt: '' } },
      { images: { url: 'https://convertt.co/wp-content/uploads/2026/02/image-2762.svg', alt: '' } },
      { images: { url: 'https://convertt.co/wp-content/uploads/2026/02/image-2765.svg', alt: '' } },
      { images: { url: 'https://convertt.co/wp-content/uploads/2026/02/Mask-group-16.svg', alt: '' } },
      { images: { url: 'https://convertt.co/wp-content/uploads/2026/02/Group-1707479509.svg', alt: '' } },
    ],
    brandslogo: [
      { brand_image: { url: 'https://convertt.co/wp-content/uploads/2026/02/Logo-1.svg', alt: '' } },
      { brand_image: { url: 'https://convertt.co/wp-content/uploads/2026/02/SVG.svg', alt: '' } },
      { brand_image: { url: 'https://convertt.co/wp-content/uploads/2026/02/logo-4-1.svg', alt: '' } },
      { brand_image: { url: 'https://convertt.co/wp-content/uploads/2026/02/Image-1.svg', alt: '' } },
    ],
  }
}

// ============================================================
// FALLBACK DATA — From real API (used if live call fails)
// All data extracted directly from API response files
// ============================================================

const FALLBACK_REVIEWS: StoryItem[] = [
  {
    id: 6738,
    name: 'Henry',
    title: 'E-commerce Entrepreneur',
    video_vimeo_link: 'https://player.vimeo.com/video/1131704385?badge=0&autopause=0&player_id=0&app_id=58479',
    thumbnail: '',
  },
  {
    id: 6736,
    name: 'Clare',
    title: 'Founder of Yourdayly',
    video_vimeo_link: 'https://player.vimeo.com/video/1131703823?badge=0&autopause=0&player_id=0&app_id=58479',
    thumbnail: '',
  },
  {
    id: 6734,
    name: 'Lisa De Rosa',
    title: 'Director of Corporate Partnerships',
    video_vimeo_link: 'https://player.vimeo.com/video/1131702115?badge=0&autopause=0&player_id=0&app_id=58479',
    thumbnail: '',
  },
  {
    id: 6495,
    name: 'June',
    title: 'Founder of Elvora',
    video_vimeo_link: 'https://player.vimeo.com/video/1103737000?badge=0&autopause=0&player_id=0&app_id=58479',
    thumbnail: 'https://convertt.co/wp-content/uploads/2025/07/june-scaled.png',
  },
  {
    id: 6493,
    name: 'Jeff',
    title: 'Founder of Ethelete',
    video_vimeo_link: 'https://player.vimeo.com/video/1103737045?badge=0&autopause=0&player_id=0&app_id=58479',
    thumbnail: 'https://convertt.co/wp-content/uploads/2025/07/jeff-scaled.png',
  },
  {
    id: 6487,
    name: 'Mustafa',
    title: 'Founder of BMG',
    video_vimeo_link: 'https://player.vimeo.com/video/1103737249?badge=0&autopause=0&player_id=0&app_id=58479',
    thumbnail: 'https://convertt.co/wp-content/uploads/2025/07/Mustufa.png',
  },
  {
    id: 5435,
    name: 'Mark Rushworth',
    title: 'Head of SEO at YDS GROUP',
    video_vimeo_link: 'https://player.vimeo.com/video/1103737220?badge=0&autopause=0&player_id=0&app_id=58479',
    thumbnail: 'https://convertt.co/wp-content/uploads/2024/12/convertt_mark_rushworth.png',
  },
  {
    id: 5102,
    name: 'Jonathan Farris',
    title: 'Senior Vice President of Vane.ag',
    video_vimeo_link: 'https://player.vimeo.com/video/1103751115?badge=0&autopause=0&player_id=0&app_id=58479',
    thumbnail: 'https://convertt.co/wp-content/uploads/2024/12/video-testimonial-3-1.png',
  },
  {
    id: 5085,
    name: 'Dr. Khaled Sadek',
    title: 'CEO',
    video_vimeo_link: 'https://player.vimeo.com/video/1103737201?badge=0&autopause=0&player_id=0&app_id=58479',
    thumbnail: 'https://convertt.co/wp-content/uploads/2024/12/WhatsApp-Video-2024-10-14-at-21.59.10_988d4cf1-1-1.png',
  },
  {
    id: 5055,
    name: 'Dr. Hassan & Hussein Dalghous',
    title: 'CEO',
    video_vimeo_link: 'https://player.vimeo.com/video/1103736959?badge=0&autopause=0&player_id=0&app_id=58479',
    thumbnail: 'https://convertt.co/wp-content/uploads/2024/12/WhatsApp-Video-2024-10-14-at-21.59.10_988d4cf1-1.png',
  },
]

const FALLBACK_CASE_STUDIES: CaseStudyItem[] = [
  {
    id: 9091, title: 'Armra',
    before_image: { url: 'https://convertt.co/wp-content/uploads/2026/03/armara-before-mobile-1-scaled.png', alt: 'Before' },
    after_image: { url: 'https://convertt.co/wp-content/uploads/2026/03/armara-after-mobile-2-scaled.jpg', alt: 'After' },
    before_desk_image: { url: 'https://convertt.co/wp-content/uploads/2026/03/armara-before-desktop-scaled.jpg', alt: 'Before' },
    after_desk_image: { url: 'https://convertt.co/wp-content/uploads/2026/03/armara-after-desktop-scaled.jpg', alt: 'After' },
    categories: ['beauty'],
  },
  {
    id: 9065, title: 'Phit Balance',
    before_image: { url: 'https://convertt.co/wp-content/uploads/2026/03/phitbalance-after-desktop-4-scaled.jpg', alt: 'Before' },
    after_image: { url: 'https://convertt.co/wp-content/uploads/2026/03/phitbalance-after-desktop-1-scaled.jpg', alt: 'After' },
    before_desk_image: { url: 'https://convertt.co/wp-content/uploads/2026/03/phitbalance-after-desktop-2-scaled.jpg', alt: 'Before' },
    after_desk_image: { url: 'https://convertt.co/wp-content/uploads/2026/03/phitbalance-after-desktop-3-scaled.jpg', alt: 'After' },
    categories: ['supplements'],
  },
  {
    id: 9060, title: 'Allaura',
    before_image: { url: 'https://convertt.co/wp-content/uploads/2026/03/allaura-before-mobile-1-scaled.jpg', alt: 'Before' },
    after_image: { url: 'https://convertt.co/wp-content/uploads/2026/03/allaura-after-mobile-scaled.jpg', alt: 'After' },
    before_desk_image: { url: 'https://convertt.co/wp-content/uploads/2026/03/allaura-before-desktop-1-scaled.jpg', alt: 'Before' },
    after_desk_image: { url: 'https://convertt.co/wp-content/uploads/2026/03/allaura-after-desktop-scaled.jpg', alt: 'After' },
    categories: ['beauty'],
  },
  {
    id: 9055, title: 'CyperGlow',
    before_image: { url: 'https://convertt.co/wp-content/uploads/2026/03/cyperglow-before-1-scaled.jpg', alt: 'Before' },
    after_image: { url: 'https://convertt.co/wp-content/uploads/2026/03/cyperglow-after-mobile-scaled.jpg', alt: 'After' },
    before_desk_image: { url: 'https://convertt.co/wp-content/uploads/2026/03/cyperglow-before-scaled.jpg', alt: 'Before' },
    after_desk_image: { url: 'https://convertt.co/wp-content/uploads/2026/03/cyperglow-after-desktop-scaled.jpg', alt: 'After' },
    categories: ['beauty'],
  },
  {
    id: 9048, title: 'Olivea',
    before_image: { url: 'https://convertt.co/wp-content/uploads/2026/03/olivea-before-mobile-1-scaled.jpg', alt: 'Before' },
    after_image: { url: 'https://convertt.co/wp-content/uploads/2026/03/olivea-after-mobile-scaled.jpg', alt: 'After' },
    before_desk_image: { url: 'https://convertt.co/wp-content/uploads/2026/03/olivea-before-desktop-1-scaled.jpg', alt: 'Before' },
    after_desk_image: { url: 'https://convertt.co/wp-content/uploads/2026/03/olivea-After-Desktop-scaled.jpg', alt: 'After' },
    categories: ['ecommerce'],
  },
  {
    id: 9043, title: 'Pure Filth',
    before_image: { url: 'https://convertt.co/wp-content/uploads/2026/03/purefilth-before-mobile-scaled.jpg', alt: 'Before' },
    after_image: { url: 'https://convertt.co/wp-content/uploads/2026/03/purefilth-After-mobile-scaled.jpg', alt: 'After' },
    before_desk_image: { url: 'https://convertt.co/wp-content/uploads/2026/03/purefilth-before-Desktop-scaled.jpg', alt: 'Before' },
    after_desk_image: { url: 'https://convertt.co/wp-content/uploads/2026/03/purefilth-After-Desktop-scaled.jpg', alt: 'After' },
    categories: ['clothing'],
  },
  {
    id: 9037, title: 'Fourth Youth',
    before_image: { url: 'https://convertt.co/wp-content/uploads/2026/03/fourthyouth-before-mobile-scaled.png', alt: 'Before' },
    after_image: { url: 'https://convertt.co/wp-content/uploads/2026/03/fourthyouth-After-mobile-1-scaled.jpg', alt: 'After' },
    before_desk_image: { url: 'https://convertt.co/wp-content/uploads/2026/03/fourthyouth-before-Desktop-scaled.png', alt: 'Before' },
    after_desk_image: { url: 'https://convertt.co/wp-content/uploads/2026/03/fourthyouth-After-Desktop-scaled.jpg', alt: 'After' },
    categories: ['beauty'],
  },
  {
    id: 7625, title: 'Eyeoflove',
    before_image: { url: 'https://convertt.co/wp-content/uploads/2025/12/eyeoflove-before-scaled.jpg', alt: 'Before' },
    after_image: { url: 'https://convertt.co/wp-content/uploads/2025/12/eyeoflove-after-scaled.jpg', alt: 'After' },
    before_desk_image: { url: 'https://convertt.co/wp-content/uploads/2025/12/1440w-default-3-scaled.png', alt: 'Before' },
    after_desk_image: { url: 'https://convertt.co/wp-content/uploads/2025/12/Product-Page-Desktop-scaled.png', alt: 'After' },
    categories: ['beauty'],
  },
  {
    id: 7622, title: 'Fuel',
    before_image: { url: 'https://convertt.co/wp-content/uploads/2025/12/fuel-before-1-scaled.jpg', alt: 'Before' },
    after_image: { url: 'https://convertt.co/wp-content/uploads/2025/12/Fuel-after-scaled.jpg', alt: 'After' },
    before_desk_image: { url: 'https://convertt.co/wp-content/uploads/2025/12/fuel-before-scaled.png', alt: 'Before' },
    after_desk_image: { url: 'https://convertt.co/wp-content/uploads/2025/12/fuel-after-scaled.png', alt: 'After' },
    categories: ['supplements'],
  },
  {
    id: 7619, title: 'Hemp Collect',
    before_image: { url: 'https://convertt.co/wp-content/uploads/2025/12/HEMP-BEFORE-scaled.jpg', alt: 'Before' },
    after_image: { url: 'https://convertt.co/wp-content/uploads/2025/12/hemp-collect-after-1-1-scaled.jpg', alt: 'After' },
    before_desk_image: { url: 'https://convertt.co/wp-content/uploads/2025/12/hamp-collect-before-scaled.png', alt: 'Before' },
    after_desk_image: { url: 'https://convertt.co/wp-content/uploads/2025/12/hamp-collect-after-scaled.png', alt: 'After' },
    categories: ['supplements'],
  },
]
