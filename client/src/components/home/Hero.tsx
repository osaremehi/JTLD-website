// client/src/components/home/Hero.tsx
import { ArrowRight } from 'lucide-react'

const STATS = [
  { number: '150+', label: 'Projects Delivered' },
  { number: '50+', label: 'Enterprise Clients' },
  { number: '2', label: 'Continents' },
  { number: '10+', label: 'Years Experience' },
]

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-navy-950 via-navy-900 to-navy-800 text-white overflow-hidden">
      {/* Dot grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-6 py-32 w-full">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Trusted IT Partner — North America &amp; Africa
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
            Transforming Business
            <br />
            Through <span className="text-gold-400 font-serif">Technology</span>
          </h1>

          <p className="text-lg text-blue-200 leading-relaxed mb-10 max-w-xl">
            JTLD Consulting Inc delivers enterprise IT strategy, management consulting,
            and software solutions that drive measurable outcomes for organizations
            across North America and Africa.
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="#contact" className="btn-primary">
              Start a Conversation
              <ArrowRight size={18} />
            </a>
            <a href="#services" className="btn-outline border-white/30 text-white hover:bg-white/10 hover:text-white dark:border-white/30">
              Explore Services
            </a>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 bg-navy-950/70 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          {STATS.map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-extrabold text-gold-400">{stat.number}</div>
              <div className="text-sm text-blue-300 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
