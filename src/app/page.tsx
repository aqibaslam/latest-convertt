import Navbar from '@/components/Navbar/Navbar'
import HeroSection from '@/components/HeroSection/HeroSection'
import BrandLogoSection from '@/components/BrandLogoSection/BrandLogoSection'
import CaseStudySection from '@/components/CaseStudySection/CaseStudySection'
import ClientStoriesSection from '@/components/ClientStoriesSection/ClientStoriesSection'
import { getHeroData, getBrandLogoData, getCaseStudyData, getClientStoriesData } from '@/lib/api'

export default async function Home() {
  const [heroData, brandLogoData, caseStudyData, clientStoriesData] = await Promise.all([
    getHeroData(),
    getBrandLogoData(),
    getCaseStudyData(),
    getClientStoriesData(),
  ])

  return (
    <>
      <Navbar />
      <main>
        <HeroSection data={heroData} />
        <BrandLogoSection data={brandLogoData} />
        <CaseStudySection data={caseStudyData} />
        <ClientStoriesSection data={clientStoriesData} />
      </main>
    </>
  )
}
