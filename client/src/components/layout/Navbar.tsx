// client/src/components/layout/Navbar.tsx
import { useState, useEffect, useRef } from 'react'
import { Menu, X, ChevronDown, Search } from 'lucide-react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

const NAV_ITEMS = [
  {
    label: 'What We Do',
    href: '/#services',
    dropdown: [
      { label: 'IT Strategy & Architecture', href: '/#services' },
      { label: 'Project & Change Management', href: '/#services' },
      { label: 'Software Development', href: '/#services' },
      { label: 'Cloud & Infrastructure', href: '/#services' },
    ],
  },
  {
    label: 'Industries',
    href: '/#industries',
    dropdown: [
      { label: 'Government & Public Sector', href: '/#industries' },
      { label: 'Financial Services', href: '/#industries' },
      { label: 'Energy & Resources', href: '/#industries' },
      { label: 'Healthcare', href: '/#industries' },
    ],
  },
  { label: 'Blog', href: '/blog' },
  { label: 'Who We Are', href: '/#about' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function openDropdown(label: string) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveDropdown(label)
  }

  function closeDropdown() {
    timeoutRef.current = setTimeout(() => setActiveDropdown(null), 150)
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all bg-white dark:bg-navy-950
      border-b border-gray-200 dark:border-gray-800 ${scrolled ? 'shadow-md' : ''}`}>
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-[72px]">
        <Logo className="text-navy-900 dark:text-white" />

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(item => (
            <li key={item.label} className="relative"
              onMouseEnter={() => item.dropdown && openDropdown(item.label)}
              onMouseLeave={() => item.dropdown && closeDropdown()}
            >
              <a
                href={item.href}
                className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300
                           hover:text-navy-800 dark:hover:text-white transition-colors rounded-md hover:bg-gray-50 dark:hover:bg-navy-800"
              >
                {item.label}
                {item.dropdown && <ChevronDown size={14} className={`transition-transform ${activeDropdown === item.label ? 'rotate-180' : ''}`} />}
              </a>

              {item.dropdown && activeDropdown === item.label && (
                <div
                  className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-navy-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-2"
                  onMouseEnter={() => openDropdown(item.label)}
                  onMouseLeave={() => closeDropdown()}
                >
                  {item.dropdown.map(sub => (
                    <a
                      key={sub.label}
                      href={sub.href}
                      className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-navy-50 dark:hover:bg-navy-800 hover:text-navy-900 dark:hover:text-white transition-colors"
                    >
                      {sub.label}
                    </a>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <button className="p-2 text-gray-500 hover:text-navy-800 dark:text-gray-400 dark:hover:text-white transition-colors" aria-label="Search">
            <Search size={18} />
          </button>
          <ThemeToggle />
          <a
            href="/#contact"
            className="text-sm font-semibold px-5 py-2.5 rounded-lg bg-navy-800 text-white hover:bg-navy-700 dark:bg-gold-400 dark:text-navy-950 dark:hover:bg-gold-300 transition-all"
          >
            Contact Us
          </a>
        </div>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button className="p-2 text-gray-700 dark:text-gray-300" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-navy-950 border-t border-gray-200 dark:border-gray-800 px-6 py-4">
          <ul className="space-y-1">
            {NAV_ITEMS.map(item => (
              <li key={item.label}>
                <a href={item.href} onClick={() => setMenuOpen(false)}
                  className="block text-sm font-medium py-2.5 px-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-navy-800">
                  {item.label}
                </a>
                {item.dropdown && (
                  <ul className="ml-4 mt-1 space-y-1">
                    {item.dropdown.map(sub => (
                      <li key={sub.label}>
                        <a href={sub.href} onClick={() => setMenuOpen(false)}
                          className="block text-sm py-2 px-3 text-gray-500 dark:text-gray-400 hover:text-navy-800 dark:hover:text-white">
                          {sub.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
            <li className="pt-2">
              <a href="/#contact" onClick={() => setMenuOpen(false)}
                className="block text-center text-sm font-semibold px-5 py-2.5 rounded-lg bg-navy-800 text-white dark:bg-gold-400 dark:text-navy-950">
                Contact Us
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
