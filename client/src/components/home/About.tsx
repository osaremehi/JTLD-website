// client/src/components/home/About.tsx
import { Building2, Check } from 'lucide-react'

const VALUES = ['Strategic Advisory', 'Delivery Excellence', 'Client-First Approach', 'Cross-Border Expertise']

export default function About() {
  return (
    <section id="about" className="py-24 bg-gray-50 dark:bg-navy-900/50">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image placeholder */}
          <div className="relative">
            <div className="aspect-[4/3] bg-gradient-to-br from-navy-100 to-navy-200 dark:from-navy-800 dark:to-navy-700 rounded-2xl flex items-center justify-center">
              <Building2 size={120} className="text-navy-400 dark:text-navy-500" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-navy-800 rounded-xl p-5 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="text-2xl font-extrabold text-navy-900 dark:text-white">10+</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Years of Excellence</div>
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="section-eyebrow">Who We Are</div>
            <h2 className="section-title">A Trusted Partner in IT Transformation</h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
              JTLD Consulting Inc is a management consulting and IT services firm
              with operations spanning North America and Africa. We help
              organizations navigate complex technology landscapes with clarity,
              confidence, and measurable results.
            </p>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              From enterprise architecture and cloud strategy to agile project
              delivery and custom software development, our team brings deep
              expertise across the full technology lifecycle.
            </p>
            <ul className="grid grid-cols-2 gap-3">
              {VALUES.map(v => (
                <li key={v} className="flex items-center gap-2 text-sm font-medium text-navy-900 dark:text-gray-200">
                  <span className="w-5 h-5 rounded-full bg-gold-400/15 text-gold-500 flex items-center justify-center flex-shrink-0">
                    <Check size={12} />
                  </span>
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
