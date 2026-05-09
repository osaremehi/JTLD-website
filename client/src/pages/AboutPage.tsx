// client/src/pages/AboutPage.tsx
import About from '@/components/home/About'
import CtaBanner from '@/components/home/CtaBanner'

export default function AboutPage() {
  return (
    <main className="pt-[100px]">
      <div className="bg-white dark:bg-navy-950 py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-50 dark:bg-navy-800 border border-navy-200 dark:border-navy-700 text-xs font-semibold text-navy-700 dark:text-blue-300 uppercase tracking-wider mb-6">
            Who We Are
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy-900 dark:text-white leading-tight mb-4">
            A Trusted Partner in IT Transformation
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            JTLD Consulting Inc is a management consulting and IT services firm with operations spanning North America and Africa.
          </p>
        </div>
      </div>
      <About />
      <CtaBanner />
    </main>
  )
}
