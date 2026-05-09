// client/src/components/home/Hero.tsx
import { ArrowRight, Calendar, Users, MapPin, Award } from 'lucide-react'

const STATS = [
  { icon: Calendar, number: '10+', label: 'Years of Experience' },
  { icon: Users, number: '50+', label: 'Enterprise Clients' },
  { icon: MapPin, number: '2', label: 'Continents' },
  { icon: Award, number: '150+', label: 'Projects Delivered' },
]

export default function Hero() {
  return (
    <section className="pt-[72px] bg-white dark:bg-navy-950">
      {/* Main hero */}
      <div className="max-w-[1200px] mx-auto px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: text */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-50 dark:bg-navy-800 border border-navy-200 dark:border-navy-700 text-xs font-semibold text-navy-700 dark:text-blue-300 uppercase tracking-wider mb-6">
              IT Consulting & Technology Services
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-navy-900 dark:text-white leading-tight mb-6">
              Accelerate Business Growth Through Technology
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8 max-w-lg">
              JTLD Consulting delivers real-world expertise to solve complex technology
              and business challenges — from strategy through execution, across North America and Africa.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/#contact" className="inline-flex items-center gap-2 px-6 py-3 bg-navy-800 text-white rounded-lg font-semibold hover:bg-navy-700 dark:bg-gold-400 dark:text-navy-950 dark:hover:bg-gold-300 transition-all">
                Start a Conversation <ArrowRight size={18} />
              </a>
              <a href="/#services" className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:border-navy-800 hover:text-navy-800 dark:hover:border-gray-400 transition-all">
                Explore Services
              </a>
            </div>
          </div>

          {/* Right: visual card grid */}
          <div className="relative hidden md:grid grid-cols-2 gap-4">
            <div className="col-span-2 bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-8 text-white">
              <div className="text-4xl font-extrabold text-gold-400 mb-1">150+</div>
              <div className="text-sm text-blue-200">Projects successfully delivered across industries</div>
            </div>
            <div className="bg-navy-50 dark:bg-navy-800 rounded-2xl p-6 border border-navy-100 dark:border-navy-700">
              <div className="text-3xl font-extrabold text-navy-800 dark:text-white mb-1">50+</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Enterprise clients served</div>
            </div>
            <div className="bg-gold-400/10 dark:bg-navy-800 rounded-2xl p-6 border border-gold-400/20 dark:border-navy-700">
              <div className="text-3xl font-extrabold text-navy-800 dark:text-white mb-1">10+</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Years of excellence</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-navy-900">
        <div className="max-w-[1200px] mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(stat => (
              <div key={stat.label} className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-navy-100 dark:bg-navy-800 text-navy-700 dark:text-blue-300 flex items-center justify-center flex-shrink-0">
                  <stat.icon size={22} />
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-navy-900 dark:text-white">{stat.number}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
