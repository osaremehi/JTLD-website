// client/src/components/home/Contact.tsx
import { useState } from 'react'
import { Mail, MapPin, Globe } from 'lucide-react'
import { submitContact } from '@/lib/api'

const CONTACT_DETAILS = [
  { icon: Mail, label: 'Email', value: 'admin@jtldconsulting.com' },
  { icon: MapPin, label: 'North America', value: 'Alberta, Canada' },
  { icon: MapPin, label: 'Africa', value: 'Lagos, Nigeria' },
  { icon: Globe, label: 'Website', value: 'www.jtldinc.com' },
]

export default function Contact() {
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormState('sending')
    setErrorMsg('')

    const form = e.currentTarget
    const fd = new FormData(form)

    try {
      const res = await submitContact({
        first_name: fd.get('firstName') as string,
        last_name: fd.get('lastName') as string,
        email: fd.get('email') as string,
        company: fd.get('company') as string,
        service: fd.get('service') as string,
        message: fd.get('message') as string,
      })

      if (res.error) {
        setFormState('error')
        setErrorMsg(res.error.message)
        return
      }

      setFormState('sent')
      form.reset()
      setTimeout(() => setFormState('idle'), 4000)
    } catch {
      setFormState('error')
      setErrorMsg('Something went wrong. Please try again.')
    }
  }

  return (
    <section id="contact" className="py-24">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid md:grid-cols-[1fr_1.2fr] gap-12">
          {/* Info side */}
          <div>
            <h3 className="text-2xl font-extrabold text-navy-900 dark:text-white mb-4">
              Let's Build Something Together
            </h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-8">
              Whether you're planning a digital transformation, need expert
              project delivery, or want to build a custom solution — we'd love to hear from you.
            </p>

            <div className="space-y-6">
              {CONTACT_DETAILS.map(d => (
                <div key={d.label} className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-lg bg-blue-50 dark:bg-navy-800 text-navy-700 dark:text-blue-300
                                  flex items-center justify-center flex-shrink-0">
                    <d.icon size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-navy-900 dark:text-white">{d.label}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{d.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form side */}
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-navy-800 border border-gray-200 dark:border-gray-700
                       rounded-xl p-10 shadow-md"
          >
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  First Name *
                </label>
                <input type="text" id="firstName" name="firstName" required placeholder="John"
                  className="w-full px-3.5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm
                             bg-white dark:bg-navy-950 text-gray-800 dark:text-gray-200
                             focus:outline-none focus:ring-2 focus:ring-navy-500/30 focus:border-navy-500 transition" />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                  Last Name *
                </label>
                <input type="text" id="lastName" name="lastName" required placeholder="Doe"
                  className="w-full px-3.5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm
                             bg-white dark:bg-navy-950 text-gray-800 dark:text-gray-200
                             focus:outline-none focus:ring-2 focus:ring-navy-500/30 focus:border-navy-500 transition" />
              </div>
            </div>

            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Email Address *
              </label>
              <input type="email" id="email" name="email" required placeholder="john@company.com"
                className="w-full px-3.5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm
                           bg-white dark:bg-navy-950 text-gray-800 dark:text-gray-200
                           focus:outline-none focus:ring-2 focus:ring-navy-500/30 focus:border-navy-500 transition" />
            </div>

            <div className="mb-5">
              <label htmlFor="company" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Company
              </label>
              <input type="text" id="company" name="company" placeholder="Your company name"
                className="w-full px-3.5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm
                           bg-white dark:bg-navy-950 text-gray-800 dark:text-gray-200
                           focus:outline-none focus:ring-2 focus:ring-navy-500/30 focus:border-navy-500 transition" />
            </div>

            <div className="mb-5">
              <label htmlFor="service" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Service of Interest
              </label>
              <select id="service" name="service"
                className="w-full px-3.5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm
                           bg-white dark:bg-navy-950 text-gray-800 dark:text-gray-200
                           focus:outline-none focus:ring-2 focus:ring-navy-500/30 focus:border-navy-500 transition">
                <option value="">Select a service...</option>
                <option value="strategy">IT Strategy &amp; Architecture</option>
                <option value="project">Project &amp; Change Management</option>
                <option value="development">Software Development</option>
                <option value="general">General Inquiry</option>
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Message *
              </label>
              <textarea id="message" name="message" required rows={5}
                placeholder="Tell us about your project or challenge..."
                className="w-full px-3.5 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-sm
                           bg-white dark:bg-navy-950 text-gray-800 dark:text-gray-200 resize-vertical
                           focus:outline-none focus:ring-2 focus:ring-navy-500/30 focus:border-navy-500 transition" />
            </div>

            {errorMsg && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={formState === 'sending'}
              className={`w-full py-3.5 rounded-lg font-semibold text-sm transition-all
                ${formState === 'sent'
                  ? 'bg-green-600 text-white'
                  : 'bg-navy-800 text-white hover:bg-navy-700 dark:bg-gold-400 dark:text-navy-950 dark:hover:bg-gold-300'}
                disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              {formState === 'sending' ? 'Sending...' : formState === 'sent' ? 'Message Sent!' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
