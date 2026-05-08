// client/src/components/home/WhyUs.tsx
import { Globe, Users, Target, ShieldCheck } from 'lucide-react'

const REASONS = [
  {
    icon: Globe,
    title: 'Cross-Border Perspective',
    desc: 'With deep roots across North America and Africa, we understand the nuances of operating across markets, regulations, and cultures.',
  },
  {
    icon: Users,
    title: 'Senior-Led Engagements',
    desc: 'Every project is led by experienced consultants who stay involved from kickoff through delivery — no bait-and-switch staffing.',
  },
  {
    icon: Target,
    title: 'Outcome-Focused Delivery',
    desc: 'We measure success by your results, not our billable hours. Clear KPIs, transparent reporting, and real accountability.',
  },
  {
    icon: ShieldCheck,
    title: 'Proven Methodologies',
    desc: 'We leverage industry-standard frameworks — TOGAF, PMBOK, Agile, ITIL — tailored to your organization\'s maturity and goals.',
  },
]

export default function WhyUs() {
  return (
    <section className="py-24 bg-navy-950 text-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-16">
          <div className="text-sm font-semibold uppercase tracking-wider text-gold-300 mb-2">Why JTLD</div>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 font-serif">Built on Trust, Driven by Results</h2>
          <p className="text-blue-300 max-w-2xl mx-auto">
            We bring more than technical expertise — we bring partnership,
            accountability, and a relentless focus on your outcomes.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {REASONS.map(r => (
            <div
              key={r.title}
              className="p-8 rounded-xl bg-white/[0.04] border border-white/[0.08]
                         hover:bg-white/[0.07] hover:border-white/[0.14] transition-all"
            >
              <div className="w-11 h-11 rounded-lg bg-gold-500/[0.12] text-gold-400
                              flex items-center justify-center mb-4">
                <r.icon size={22} />
              </div>
              <h3 className="text-base font-bold mb-2">{r.title}</h3>
              <p className="text-sm text-blue-300 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
