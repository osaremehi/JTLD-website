// client/src/components/layout/Navbar.tsx
import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, ChevronDown, Search, Globe, MapPin } from 'lucide-react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

type MegaColumn = { heading: string; links: { label: string; href: string }[] }
type NavItem = { label: string; href: string; mega?: MegaColumn[] }

const REGIONS = [
  { country: 'Canada', lang: 'English', code: 'CAN' },
  { country: 'United States', lang: 'English', code: 'USA' },
  { country: 'Ghana', lang: 'English', code: 'GHA' },
  { country: 'Nigeria', lang: 'English', code: 'NGA' },
  { country: 'Kenya', lang: 'English', code: 'KEN' },
  { country: 'South Africa', lang: 'English', code: 'ZAF' },
]

const NAV_ITEMS: NavItem[] = [
  {
    label: 'What We Do',
    href: '/services',
    mega: [
      {
        heading: 'Maximize Technology ROI',
        links: [
          { label: 'IT Strategy & Architecture', href: '/services' },
          { label: 'Cloud Strategy & Migration', href: '/services' },
          { label: 'Digital Transformation', href: '/services' },
          { label: 'Technology Roadmaps', href: '/services' },
        ],
      },
      {
        heading: 'Drive Business Outcomes',
        links: [
          { label: 'Program & Project Management', href: '/services' },
          { label: 'Agile Coaching & PMO', href: '/services' },
          { label: 'Change Management', href: '/services' },
          { label: 'Business Analysis', href: '/services' },
        ],
      },
      {
        heading: 'Build & Modernize',
        links: [
          { label: 'Custom Web & Mobile Apps', href: '/services' },
          { label: 'API Design & Integration', href: '/services' },
          { label: 'DevOps & Cloud Infrastructure', href: '/services' },
          { label: 'Legacy Modernization', href: '/services' },
        ],
      },
    ],
  },
  {
    label: 'Industries',
    href: '/industries',
    mega: [
      {
        heading: 'Public Sector',
        links: [
          { label: 'Government & Public Sector', href: '/industries' },
        ],
      },
      {
        heading: 'Financial Services',
        links: [
          { label: 'Banking & Capital Markets', href: '/industries' },
          { label: 'Insurance', href: '/industries' },
        ],
      },
      {
        heading: 'Energy & Healthcare',
        links: [
          { label: 'Energy & Resources', href: '/industries' },
          { label: 'Healthcare', href: '/industries' },
        ],
      },
    ],
  },
  { label: 'Blog', href: '/blog' },
  {
    label: 'Who We Are',
    href: '/about',
    mega: [
      {
        heading: 'Our Story',
        links: [
          { label: 'About JTLD', href: '/about' },
          { label: 'Our Values', href: '/about' },
          { label: 'Leadership', href: '/about' },
        ],
      },
      {
        heading: 'Technology Partnerships',
        links: [
          { label: 'Microsoft', href: '/about' },
          { label: 'AWS', href: '/about' },
          { label: 'Google Cloud', href: '/about' },
          { label: 'Salesforce', href: '/about' },
          { label: 'ServiceNow', href: '/about' },
          { label: 'Oracle', href: '/about' },
        ],
      },
    ],
  },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [regionOpen, setRegionOpen] = useState(false)
  const [selectedRegion, setSelectedRegion] = useState(REGIONS[0])
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function open(label: string) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveMenu(label)
  }

  function close() {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 120)
  }

  const activeMega = NAV_ITEMS.find(i => i.label === activeMenu && i.mega)

  return (
    <>
      {/* Region selector modal */}
      {regionOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-start justify-center pt-20" onClick={() => setRegionOpen(false)}>
          <div className="bg-white dark:bg-navy-900 rounded-xl shadow-2xl w-full max-w-2xl mx-4 p-8 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setRegionOpen(false)} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-navy-800 text-gray-500 dark:text-gray-400 transition-colors">
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold text-navy-900 dark:text-white mb-6">Choose your region:</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {REGIONS.map(r => (
                <button
                  key={r.code}
                  onClick={() => { setSelectedRegion(r); setRegionOpen(false) }}
                  className="text-left group"
                >
                  <p className="font-semibold text-navy-900 dark:text-white mb-1 group-hover:text-navy-600 dark:group-hover:text-blue-300 transition-colors">
                    {r.country}
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 group-hover:text-gold-500 transition-colors">
                    {r.lang}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav
        className={`fixed top-0 left-0 right-0 z-50 bg-white dark:bg-navy-950
          border-b border-gray-200 dark:border-gray-800 transition-shadow ${scrolled ? 'shadow-md' : ''}`}
        onMouseLeave={close}
      >
        {/* Utility bar */}
        <div className="hidden md:block border-b border-gray-100 dark:border-navy-800 bg-gray-50 dark:bg-navy-950">
          <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-end gap-1 h-9">
            <button className="flex items-center gap-1.5 px-3 h-full text-xs text-gray-500 dark:text-gray-400 hover:text-navy-800 dark:hover:text-white transition-colors">
              <MapPin size={13} />
              Locations
            </button>
            <div className="w-px h-4 bg-gray-300 dark:bg-navy-700" />
            <button
              onClick={() => setRegionOpen(true)}
              className="flex items-center gap-1.5 px-3 h-full text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-navy-800 dark:hover:text-white transition-colors"
            >
              <Globe size={13} />
              {selectedRegion.code} {selectedRegion.lang}
              <ChevronDown size={12} />
            </button>
            <div className="w-px h-4 bg-gray-300 dark:bg-navy-700" />
            <button className="flex items-center gap-1.5 px-3 h-full text-gray-500 dark:text-gray-400 hover:text-navy-800 dark:hover:text-white transition-colors" aria-label="Search">
              <Search size={14} />
            </button>
          </div>
        </div>

        {/* Main bar */}
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-[64px]">
          <Logo className="text-navy-900 dark:text-white" />

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center h-full">
            {NAV_ITEMS.map(item => (
              <li key={item.label} className="h-full flex items-center"
                onMouseEnter={() => item.mega ? open(item.label) : setActiveMenu(null)}
              >
                <Link
                  to={item.href}
                  className={`flex items-center gap-1 px-5 h-full text-sm font-semibold transition-colors
                    ${activeMenu === item.label
                      ? 'bg-navy-900 text-white dark:bg-navy-800'
                      : 'text-gray-700 dark:text-gray-200 hover:text-navy-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-navy-800'
                    }`}
                >
                  {item.label}
                  {item.mega && (
                    <ChevronDown size={14} className={`transition-transform ${activeMenu === item.label ? 'rotate-180' : ''}`} />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/#contact"
              className="text-sm font-semibold px-5 py-2.5 rounded-lg bg-navy-800 text-white hover:bg-navy-700 dark:bg-gold-400 dark:text-navy-950 dark:hover:bg-gold-300 transition-all"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile toggle */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button className="p-2 text-gray-700 dark:text-gray-300" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mega-menu panel */}
        {activeMega && (
          <div
            className="absolute left-0 right-0 bg-navy-950 border-t border-navy-800 shadow-2xl"
            onMouseEnter={() => open(activeMenu!)}
            onMouseLeave={close}
          >
            <div className="max-w-[1200px] mx-auto px-6 py-10">
              <p className="text-xs font-bold uppercase tracking-widest text-gold-400 mb-6">
                {activeMenu}
              </p>
              <div className="grid gap-10" style={{ gridTemplateColumns: `repeat(${activeMega.mega!.length}, minmax(0, 1fr))` }}>
                {activeMega.mega!.map(col => (
                  <div key={col.heading}>
                    <p className="text-xs font-bold uppercase tracking-wider text-white mb-4 pb-2 border-b border-navy-700">
                      {col.heading}
                    </p>
                    <ul className="space-y-3">
                      {col.links.map(link => (
                        <li key={link.label}>
                          <Link
                            to={link.href}
                            onClick={() => setActiveMenu(null)}
                            className="text-sm text-blue-300 hover:text-gold-400 transition-colors"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white dark:bg-navy-950 border-t border-gray-200 dark:border-gray-800 px-6 py-4">
            <ul className="space-y-1">
              {NAV_ITEMS.map(item => (
                <li key={item.label}>
                  <button
                    onClick={() => item.mega
                      ? setMobileExpanded(mobileExpanded === item.label ? null : item.label)
                      : setMenuOpen(false)
                    }
                    className="w-full flex items-center justify-between text-sm font-semibold py-3 px-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-navy-800"
                  >
                    {item.mega ? item.label : (
                      <Link to={item.href} onClick={() => setMenuOpen(false)} className="w-full text-left">
                        {item.label}
                      </Link>
                    )}
                    {item.mega && (
                      <ChevronDown size={16} className={`transition-transform ${mobileExpanded === item.label ? 'rotate-180' : ''}`} />
                    )}
                  </button>

                  {item.mega && mobileExpanded === item.label && (
                    <div className="mt-1 mb-2 bg-navy-950 rounded-xl px-4 py-4">
                      {item.mega.map(col => (
                        <div key={col.heading} className="mb-4 last:mb-0">
                          <p className="text-xs font-bold uppercase tracking-wider text-gold-400 mb-2">{col.heading}</p>
                          <ul className="space-y-2">
                            {col.links.map(link => (
                              <li key={link.label}>
                                <Link
                                  to={link.href}
                                  onClick={() => { setMenuOpen(false); setMobileExpanded(null) }}
                                  className="text-sm text-blue-300 hover:text-white"
                                >
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              ))}
              <li className="pt-2 flex items-center gap-3 border-t border-gray-100 dark:border-navy-800 mt-2">
                <button onClick={() => { setMenuOpen(false); setRegionOpen(true) }}
                  className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 py-2">
                  <Globe size={15} /> {selectedRegion.code} {selectedRegion.lang}
                </button>
              </li>
              <li className="pt-1">
                <Link to="/#contact" onClick={() => setMenuOpen(false)}
                  className="block text-center text-sm font-semibold px-5 py-2.5 rounded-lg bg-navy-800 text-white dark:bg-gold-400 dark:text-navy-950">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  )
}
