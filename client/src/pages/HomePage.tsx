// client/src/pages/HomePage.tsx
import Hero from '@/components/home/Hero'
import About from '@/components/home/About'
import Services from '@/components/home/Services'
import WhyUs from '@/components/home/WhyUs'
import Industries from '@/components/home/Industries'
import Contact from '@/components/home/Contact'
import CtaBanner from '@/components/home/CtaBanner'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Services />
      <WhyUs />
      <Industries />
      <Contact />
      <CtaBanner />
    </main>
  )
}
