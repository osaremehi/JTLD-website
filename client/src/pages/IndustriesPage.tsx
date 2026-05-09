// client/src/pages/IndustriesPage.tsx
import Industries from '@/components/home/Industries'
import CtaBanner from '@/components/home/CtaBanner'

export default function IndustriesPage() {
  return (
    <main className="pt-[100px]">
      <div className="bg-white dark:bg-navy-950 py-16">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-50 dark:bg-navy-800 border border-navy-200 dark:border-navy-700 text-xs font-semibold text-navy-700 dark:text-blue-300 uppercase tracking-wider mb-6">
            Industries
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy-900 dark:text-white leading-tight mb-4">
            Sector Expertise That Matters
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
            We bring deep domain knowledge across industries where technology decisions have the highest impact.
          </p>
        </div>
      </div>
      <Industries />
      <CtaBanner />
    </main>
  )
}
