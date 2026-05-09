// client/src/components/home/TechPartners.tsx

const PARTNERS = [
  'Microsoft', 'AWS', 'Google Cloud', 'Salesforce', 'ServiceNow', 'Oracle'
]

export default function TechPartners() {
  return (
    <section className="py-14 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-navy-950">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="text-center text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-8">
          Our Technology Partnerships
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {PARTNERS.map(name => (
            <div key={name}
              className="text-lg font-bold text-gray-300 dark:text-gray-600 hover:text-navy-400 dark:hover:text-gray-400 transition-colors tracking-tight">
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
