// client/src/components/home/Services.tsx
import { Compass, GanttChart, Code2 } from 'lucide-react'

const SERVICES = [
  {
    icon: Compass,
    title: 'IT Strategy & Architecture',
    desc: 'Aligning technology investments with business objectives through clear roadmaps, architecture reviews, and transformation planning.',
    items: ['Enterprise Architecture', 'Cloud Strategy & Migration', 'Digital Transformation', 'Technology Roadmaps'],
  },
  {
    icon: GanttChart,
    title: 'Project & Change Management',
    desc: 'Delivering complex programs on time and on budget with proven methodologies and strong stakeholder engagement.',
    items: ['Program & Project Management', 'Agile Coaching & PMO', 'Change Management', 'Business Analysis'],
  },
  {
    icon: Code2,
    title: 'Software Development',
    desc: 'Building modern, scalable applications that solve real business problems — from concept through deployment and support.',
    items: ['Custom Web & Mobile Apps', 'API Design & Integration', 'DevOps & Cloud Infrastructure', 'Legacy Modernization'],
  },
]

export default function Services() {
  return (
    <section id="services" className="py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <div className="section-eyebrow">What We Do</div>
          <h2 className="section-title">End-to-End IT Consulting &amp; Delivery</h2>
          <p className="section-subtitle">
            We partner with organizations at every stage — from strategic planning
            through implementation and ongoing optimization.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {SERVICES.map(svc => (
            <div
              key={svc.title}
              className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700
                         rounded-xl p-8 hover:shadow-lg hover:-translate-y-1 transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-navy-50 dark:bg-navy-700 text-navy-700 dark:text-blue-300
                              flex items-center justify-center mb-6 group-hover:bg-gold-400 group-hover:text-white transition-colors">
                <svc.icon size={26} />
              </div>
              <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-3">{svc.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-5">{svc.desc}</p>
              <ul className="space-y-2">
                {svc.items.map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-navy-800 dark:text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
