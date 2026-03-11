// types/index.ts mein yeh add karein (ya existing file mein paste karein)

export interface StoryItem {
  id: number
  video_vimeo_link: string
  name: string
  title: string
}

export interface ClientStoriesData {
  stories_subtitle: string
  stories_title: string
  stories_cta: string
  stories_cta_url: string
  reviews: StoryItem[]
}
