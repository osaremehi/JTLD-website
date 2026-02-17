import { Metadata } from "next";
import IndustryDetailPage from "@/components/templates/IndustryDetailPage";

export const metadata: Metadata = {
  title: "Government & Public Sector Solutions | JTLD Consulting",
  description:
    "Modernize government operations with expert consulting in digital services, citizen experience, procurement modernization, and secure data sharing.",
};

const helpItems = [
  {
    title: "Digital Government Services",
    description:
      "Transform citizen-facing services with modern web portals, mobile apps, and self-service platforms that make government more accessible, transparent, and responsive to community needs.",
  },
  {
    title: "Citizen Experience Enhancement",
    description:
      "Design and implement user-centric service delivery models that reduce wait times, simplify processes, and improve satisfaction across all touchpoints from permits to social services.",
  },
  {
    title: "Procurement & Contract Management",
    description:
      "Modernize procurement processes with e-procurement platforms, vendor management systems, and contract lifecycle management that ensure compliance, transparency, and value for taxpayers.",
  },
  {
    title: "Legacy System Modernization",
    description:
      "Migrate mission-critical systems from aging infrastructure to modern, secure platforms that reduce maintenance costs, improve performance, and enable innovation while maintaining operational continuity.",
  },
  {
    title: "Secure Data Sharing & Interoperability",
    description:
      "Enable seamless, secure data exchange between agencies and levels of government through API-first architectures, identity management, and compliance with privacy and security standards.",
  },
  {
    title: "Cybersecurity & Compliance",
    description:
      "Protect sensitive government data and infrastructure with comprehensive security frameworks, threat detection, incident response, and compliance with FedRAMP, NIST, and other standards.",
  },
];

const serviceLinks = [
  {
    href: "/services/business-consulting",
    title: "Business Consulting",
    description:
      "Strategic guidance for digital government transformation.",
  },
  {
    href: "/services/business-process",
    title: "Business Process Optimization",
    description:
      "Streamline government operations and service delivery.",
  },
  {
    href: "/services/managed-it",
    title: "Managed IT Services",
    description:
      "Reliable IT infrastructure for mission-critical government services.",
  },
  {
    href: "/services/ai",
    title: "AI & Machine Learning",
    description:
      "Intelligent automation for improved government efficiency.",
  },
  {
    href: "/services/data-analytics",
    title: "Data & Analytics",
    description:
      "Transform government data into actionable policy insights.",
  },
  {
    href: "/services/cloud-hybrid",
    title: "Cloud & Hybrid Infrastructure",
    description:
      "Secure, compliant cloud solutions for government agencies.",
  },
];

export default function GovernmentPage() {
  return (
    <IndustryDetailPage
      title="Government & Public Sector"
      description="Empowering federal, provincial, and municipal governments to deliver better services to citizens through digital transformation, legacy system modernization, and secure, efficient technology solutions."
      helpItems={helpItems}
      serviceLinks={serviceLinks}
      ctaHeading="Ready to Modernize Government Services?"
      ctaDescription="Let's discuss how JTLD Consulting can help you deliver better citizen experiences, modernize legacy systems, and build secure, efficient digital government."
    />
  );
}
