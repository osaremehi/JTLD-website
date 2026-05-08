// client/src/components/layout/Footer.tsx
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-blue-300 pt-16">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <Logo className="text-white" />
            <p className="text-sm text-gray-400 mt-4 max-w-[280px] leading-relaxed">
              Enterprise IT strategy, management consulting, and software
              solutions — delivered with excellence across North America and Africa.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-5">Services</h4>
            <ul className="space-y-3">
              <li><a href="/#services" className="text-sm text-gray-400 hover:text-gold-400 transition-colors">IT Strategy</a></li>
              <li><a href="/#services" className="text-sm text-gray-400 hover:text-gold-400 transition-colors">Project Management</a></li>
              <li><a href="/#services" className="text-sm text-gray-400 hover:text-gold-400 transition-colors">Software Development</a></li>
              <li><a href="/#services" className="text-sm text-gray-400 hover:text-gold-400 transition-colors">Change Management</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-5">Company</h4>
            <ul className="space-y-3">
              <li><a href="/#about" className="text-sm text-gray-400 hover:text-gold-400 transition-colors">About Us</a></li>
              <li><a href="/#industries" className="text-sm text-gray-400 hover:text-gold-400 transition-colors">Industries</a></li>
              <li><a href="/blog" className="text-sm text-gray-400 hover:text-gold-400 transition-colors">Blog</a></li>
              <li><a href="/#contact" className="text-sm text-gray-400 hover:text-gold-400 transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-5">Connect</h4>
            <ul className="space-y-3">
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-gold-400 transition-colors">LinkedIn</a></li>
              <li><a href="mailto:admin@jtldconsulting.com" className="text-sm text-gray-400 hover:text-gold-400 transition-colors">admin@jtldconsulting.com</a></li>
              <li><a href="https://jtldinc.com" className="text-sm text-gray-400 hover:text-gold-400 transition-colors">jtldinc.com</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <span>&copy; {new Date().getFullYear()} JTLD Consulting Inc. All rights reserved.</span>
          <span className="flex gap-5">
            <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors">Terms of Service</a>
          </span>
        </div>
      </div>
    </footer>
  )
}
