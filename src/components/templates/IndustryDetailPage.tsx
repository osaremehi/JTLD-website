import Link from "next/link";

interface HelpItem {
  title: string;
  description: string;
}

interface ServiceLink {
  href: string;
  title: string;
  description: string;
}

interface IndustryDetailProps {
  title: string;
  description: string;
  helpItems: HelpItem[];
  serviceLinks: ServiceLink[];
  ctaHeading: string;
  ctaDescription: string;
}

export default function IndustryDetailPage({
  title,
  description,
  helpItems,
  serviceLinks,
  ctaHeading,
  ctaDescription,
}: IndustryDetailProps) {
  const leftItems = helpItems.slice(0, Math.ceil(helpItems.length / 2));
  const rightItems = helpItems.slice(Math.ceil(helpItems.length / 2));

  return (
    <div className="min-h-screen">
      <section className="bg-primary-900 text-white py-20">
        <div className="container mx-auto px-6">
          <Link href="/industries" className="text-accent-400 hover:text-accent-300 mb-4 inline-block">
            &larr; Back to Industries
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{title}</h1>
          <p className="text-xl text-gray-300 max-w-3xl">{description}</p>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-900 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-primary-900 dark:text-white mb-8">How We Help</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {leftItems.map((item) => (
                <div key={item.title}>
                  <h3 className="text-xl font-semibold text-primary-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-gray-700 dark:text-gray-200">{item.description}</p>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {rightItems.map((item) => (
                <div key={item.title}>
                  <h3 className="text-xl font-semibold text-primary-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-gray-700 dark:text-gray-200">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-primary-900 dark:text-white mb-8">Relevant Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceLinks.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="block p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-primary-900 dark:text-white mb-2">{service.title}</h3>
                <p className="text-gray-700 dark:text-gray-200">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">{ctaHeading}</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">{ctaDescription}</p>
          <Link
            href="/contact"
            className="inline-block bg-accent-400 text-primary-900 px-8 py-3 rounded-lg font-semibold hover:bg-accent-300 transition-colors"
          >
            Contact Us Today
          </Link>
        </div>
      </section>
    </div>
  );
}
