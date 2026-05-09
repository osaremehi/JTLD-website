// client/src/pages/CareersPage.tsx
import { Link } from 'react-router-dom'
import { ArrowRight, Globe, Users, TrendingUp, Shield } from 'lucide-react'
import CtaBanner from '@/components/home/CtaBanner'

const WHY = [
  { icon: Globe, title: 'Cross-Border Reach', desc: 'Work on engagements spanning North America and Africa with a globally minded team.' },
  { icon: Users, title: 'Senior-Led Culture', desc: 'Learn from experienced consultants who are hands-on from day one — no bench time.' },
  { icon: TrendingUp, title: 'Career Growth', desc: 'Clear paths across strategy, delivery, and technology disciplines at every level.' },
  { icon: Shield, title: 'Impactful Work', desc: 'Solve real problems for enterprise clients in government, finance, energy, and health.' },
]

const OPENINGS = [
  { title: 'IT Strategy Consultant', type: 'Full-Time', location: 'Calgary, AB / Remote', dept: 'Consulting' },
  { title: 'Project Manager (PMP)', type: 'Contract', location: 'Toronto, ON / Hybrid', dept: 'Delivery' },
  { title: 'Cloud Solutions Architect', type: 'Full-Time', location: 'Remote — North America', dept: 'Technology' },
  { title: 'Business Analyst', type: 'Full-Time', location: 'Lagos, Nigeria / Remote', dept: 'Consulting' },
  { title: 'Software Developer (Full Stack)', type: 'Contract', location: 'Remote', dept: 'Technology' },
  { title: 'Change Management Lead', type: 'Full-Time', location: 'Edmonton, AB / Hybrid', dept: 'Delivery' },
]

export default function CareersPage() {
  return (
    <main className="pt-[100px]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-navy-950 to-navy-800 text-white py-24">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-gold-300 uppercase tracking-wider mb-6">
            Careers
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6 max-w-2xl">
            Build Your Career.<br />Drive Real Change.
          </h1>
          <p className="text-lg text-blue-200 max-w-xl mb-10">
            Join a team of consultants and technologists solving complex challenges for enterprise clients across North America and Africa.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/careers/signup"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold-400 text-navy-950 rounded-lg font-semibold hover:bg-gold-300 transition-all">
              Create Your Profile <ArrowRight size={18} />
            </Link>
            <Link to="/careers/login"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white rounded-lg font-semibold hover:border-white transition-all">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Why JTLD */}
      <section className="py-24 bg-white dark:bg-navy-950">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-14">
            <div className="section-eyebrow">Why Join Us</div>
            <h2 className="section-title">A Team Worth Joining</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY.map(w => (
              <div key={w.title} className="p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-navy-800">
                <div className="w-10 h-10 rounded-lg bg-navy-100 dark:bg-navy-700 text-navy-700 dark:text-blue-300 flex items-center justify-center mb-4">
                  <w.icon size={20} />
                </div>
                <h3 className="font-bold text-navy-900 dark:text-white mb-2">{w.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open positions */}
      <section className="py-24 bg-gray-50 dark:bg-navy-900/50">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="section-eyebrow">Open Roles</div>
              <h2 className="section-title !mb-0">Current Opportunities</h2>
            </div>
            <Link to="/careers/signup" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-navy-800 dark:text-gold-400 hover:underline">
              Create profile to apply <ArrowRight size={15} />
            </Link>
          </div>
          <div className="space-y-3">
            {OPENINGS.map(job => (
              <div key={job.title}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700 rounded-xl px-6 py-5 hover:border-navy-400 dark:hover:border-navy-500 transition-all">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-navy-100 dark:bg-navy-700 text-navy-700 dark:text-blue-300">
                      {job.dept}
                    </span>
                    <span className="text-xs text-gray-400">{job.type}</span>
                  </div>
                  <h3 className="font-bold text-navy-900 dark:text-white">{job.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{job.location}</p>
                </div>
                <Link to="/careers/signup"
                  className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-navy-800 text-white text-sm font-semibold hover:bg-navy-700 dark:bg-gold-400 dark:text-navy-950 dark:hover:bg-gold-300 transition-all">
                  Apply Now <ArrowRight size={15} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </main>
  )
}
