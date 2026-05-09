// client/src/pages/HomePage.tsx
import Hero from '@/components/home/Hero'
import TechPartners from '@/components/home/TechPartners'
import Contact from '@/components/home/Contact'
import CtaBanner from '@/components/home/CtaBanner'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TechPartners />
      <Contact />
      <CtaBanner />
    </main>
  )
}
