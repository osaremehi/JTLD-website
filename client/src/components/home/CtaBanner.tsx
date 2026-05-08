// client/src/components/home/CtaBanner.tsx
import { ArrowRight } from 'lucide-react'

export default function CtaBanner() {
  return (
    <section className="py-20 bg-gradient-to-br from-navy-800 to-navy-600 text-white text-center">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
          Ready to Transform Your Technology Landscape?
        </h2>
        <p className="text-blue-200 max-w-lg mx-auto mb-8 text-base">
          Partner with JTLD Consulting Inc and turn your technology challenges
          into competitive advantages.
        </p>
        <a href="#contact" className="btn-primary">
          Schedule a Free Consultation
          <ArrowRight size={18} />
        </a>
      </div>
    </section>
  )
}
