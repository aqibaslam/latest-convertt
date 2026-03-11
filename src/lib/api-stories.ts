// lib/api-stories.ts
// Jab real API ready ho, sirf yahan fetch() call update karein

import type { ClientStoriesData } from '@/types/stories'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

export async function getClientStoriesData(): Promise<ClientStoriesData> {
  // TODO: Real API se replace karein:
  // const res = await fetch(`${API_BASE}/api/client-stories`)
  // return res.json()

  return {
    stories_subtitle: 'Real Stories',
    stories_title: "Don't take our word for it. Take theirs.",
    stories_cta: 'Get Your FREE Audit Now!',
    stories_cta_url: 'https://audit.convertt.co/?cro_src=pdp-letecom/',
    reviews: [
      {
        id: 1,
        video_vimeo_link: 'https://player.vimeo.com/video/1051774539?badge=0&autopause=0&player_id=0&app_id=58479&background=1',
        name: 'Henry',
        title: 'E-commerce Entrepreneur',
      },
      {
        id: 2,
        video_vimeo_link: 'https://player.vimeo.com/video/1051774539?badge=0&autopause=0&player_id=0&app_id=58479&background=1',
        name: 'Clare',
        title: 'Founder of Yourdayly',
      },
      {
        id: 3,
        video_vimeo_link: 'https://player.vimeo.com/video/1051774539?badge=0&autopause=0&player_id=0&app_id=58479&background=1',
        name: 'Lisa De Rosa',
        title: 'Director of Corporate Partnerships',
      },
      {
        id: 4,
        video_vimeo_link: 'https://player.vimeo.com/video/1051774539?badge=0&autopause=0&player_id=0&app_id=58479&background=1',
        name: 'June',
        title: 'Founder of Elvora',
      },
      {
        id: 5,
        video_vimeo_link: 'https://player.vimeo.com/video/1051774539?badge=0&autopause=0&player_id=0&app_id=58479&background=1',
        name: 'Jeff',
        title: 'Founder of Ethelete',
      },
      {
        id: 6,
        video_vimeo_link: 'https://player.vimeo.com/video/1051774539?badge=0&autopause=0&player_id=0&app_id=58479&background=1',
        name: 'Mustafa',
        title: 'Founder of BMG',
      },
      {
        id: 7,
        video_vimeo_link: 'https://player.vimeo.com/video/1051774539?badge=0&autopause=0&player_id=0&app_id=58479&background=1',
        name: 'Mark Rushworth',
        title: 'Head of SEO at YDS GROUP',
      },
      {
        id: 8,
        video_vimeo_link: 'https://player.vimeo.com/video/1051774539?badge=0&autopause=0&player_id=0&app_id=58479&background=1',
        name: 'Jonathan Farris',
        title: 'Senior Vice President of Vane.ag',
      },
      {
        id: 9,
        video_vimeo_link: 'https://player.vimeo.com/video/1051774539?badge=0&autopause=0&player_id=0&app_id=58479&background=1',
        name: 'Sarah',
        title: 'Founder of GlowCo',
      },
      {
        id: 10,
        video_vimeo_link: 'https://player.vimeo.com/video/1051774539?badge=0&autopause=0&player_id=0&app_id=58479&background=1',
        name: 'Ahmed',
        title: 'CEO of NutriPlus',
      },
      {
        id: 11,
        video_vimeo_link: 'https://player.vimeo.com/video/1051774539?badge=0&autopause=0&player_id=0&app_id=58479&background=1',
        name: 'Emma',
        title: 'Co-Founder of BeautyBox',
      },
      {
        id: 12,
        video_vimeo_link: 'https://player.vimeo.com/video/1051774539?badge=0&autopause=0&player_id=0&app_id=58479&background=1',
        name: 'Tom',
        title: 'Founder of FitLife',
      },
    ],
  }
}
