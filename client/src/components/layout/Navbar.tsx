// client/src/components/layout/Navbar.tsx
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

const NAV_LINKS = [
  { label: 'About', href: '/#about' },
  { label: 'Services', href: '/#services' },
  { label: 'Industries', href: '/#industries' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/#contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all
        bg-white/92 dark:bg-navy-950/92 backdrop-blur-xl
        border-b border-gray-200 dark:border-gray-700
        ${scrolled ? 'shadow-md' : ''}`}
    >
      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-[72px]">
        <Logo className="text-navy-900 dark:text-white" />

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(link => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-sm font-medium text-gray-600 dark:text-gray-300
                           hover:text-navy-800 dark:hover:text-gold-400 transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="/#contact"
              className="text-sm font-semibold px-5 py-2.5 rounded-lg
                         bg-navy-800 text-white hover:bg-navy-700
                         dark:bg-gold-400 dark:text-navy-950 dark:hover:bg-gold-300 transition-all"
            >
              Get Started
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            className="md:hidden p-2 text-gray-700 dark:text-gray-300"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-navy-950 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
          <ul className="space-y-3">
            {NAV_LINKS.map(link => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block text-sm font-medium py-2 text-gray-700 dark:text-gray-300 hover:text-navy-800 dark:hover:text-gold-400"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="/#contact"
                onClick={() => setMenuOpen(false)}
                className="block text-center text-sm font-semibold px-5 py-2.5 rounded-lg
                           bg-navy-800 text-white dark:bg-gold-400 dark:text-navy-950 mt-2"
              >
                Get Started
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
