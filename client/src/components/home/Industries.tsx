// client/src/components/home/Industries.tsx
import { Landmark, Banknote, Droplets, HeartPulse } from 'lucide-react'

const INDUSTRIES = [
  { icon: Landmark, name: 'Government & Public Sector' },
  { icon: Banknote, name: 'Financial Services' },
  { icon: Droplets, name: 'Energy & Resources' },
  { icon: HeartPulse, name: 'Healthcare' },
]

export default function Industries() {
  return (
    <section id="industries" className="py-24 bg-gray-50 dark:bg-navy-900/50">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <div className="section-eyebrow">Industries</div>
          <h2 className="section-title">Sector Expertise That Matters</h2>
          <p className="section-subtitle">
            We bring domain knowledge across industries where technology
            decisions have the highest impact.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {INDUSTRIES.map(ind => (
            <div
              key={ind.name}
              className="text-center p-8 rounded-xl bg-white dark:bg-navy-800
                         border border-gray-200 dark:border-gray-700
                         hover:-translate-y-1 hover:shadow-md transition-all"
            >
              <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-navy-700
                              text-navy-600 dark:text-blue-300
                              flex items-center justify-center mx-auto mb-4">
                <ind.icon size={26} />
              </div>
              <h3 className="text-sm font-semibold text-navy-900 dark:text-white">{ind.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
