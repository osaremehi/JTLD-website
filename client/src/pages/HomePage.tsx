// client/src/pages/HomePage.tsx
import Hero from '@/components/home/Hero'
import TechPartners from '@/components/home/TechPartners'
import Services from '@/components/home/Services'
import About from '@/components/home/About'
import Industries from '@/components/home/Industries'
import WhyUs from '@/components/home/WhyUs'
import Contact from '@/components/home/Contact'
import CtaBanner from '@/components/home/CtaBanner'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <TechPartners />
      <Services />
      <About />
      <Industries />
      <WhyUs />
      <Contact />
      <CtaBanner />
    </main>
  )
}
