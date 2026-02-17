import { Metadata } from "next";
import IndustryDetailPage from "@/components/templates/IndustryDetailPage";

export const metadata: Metadata = {
  title: "Healthcare & Life Sciences Solutions | JTLD Consulting",
  description:
    "Advance healthcare delivery with expert consulting in patient data management, HIPAA compliance, clinical analytics, telehealth, and EHR optimization.",
};

const helpItems = [
  {
    title: "Patient Data Management & Security",
    description:
      "Implement secure, integrated patient data platforms that enable seamless information sharing across care teams while maintaining the highest standards of data privacy and security.",
  },
  {
    title: "HIPAA Compliance & Regulatory Support",
    description:
      "Ensure full compliance with HIPAA, HITECH, and other healthcare regulations through comprehensive audits, risk assessments, and implementation of best-practice security frameworks.",
  },
  {
    title: "Clinical Analytics & Population Health",
    description:
      "Leverage advanced analytics to improve patient outcomes, identify at-risk populations, optimize treatment protocols, and drive evidence-based clinical decision-making.",
  },
  {
    title: "Telehealth & Remote Care Solutions",
    description:
      "Deploy scalable telehealth platforms that expand access to care, improve patient engagement, and enable remote monitoring for chronic disease management and virtual consultations.",
  },
  {
    title: "EHR Optimization & Interoperability",
    description:
      "Maximize the value of your electronic health record investments through workflow optimization, system integration, and implementation of FHIR standards for seamless data exchange.",
  },
  {
    title: "Life Sciences R&D & Clinical Trials",
    description:
      "Accelerate drug discovery and clinical trial processes with AI-powered analytics, digital trial platforms, and data management solutions that improve efficiency and regulatory compliance.",
  },
];

const serviceLinks = [
  {
    href: "/services/business-consulting",
    title: "Business Consulting",
    description:
      "Strategic guidance for healthcare transformation and value-based care.",
  },
  {
    href: "/services/business-process",
    title: "Business Process Optimization",
    description:
      "Streamline clinical workflows and administrative operations.",
  },
  {
    href: "/services/managed-it",
    title: "Managed IT Services",
    description:
      "Reliable IT infrastructure for healthcare delivery organizations.",
  },
  {
    href: "/services/ai",
    title: "AI & Machine Learning",
    description:
      "Intelligent solutions for diagnostics, drug discovery, and clinical insights.",
  },
  {
    href: "/services/data-analytics",
    title: "Data & Analytics",
    description:
      "Transform healthcare data into actionable clinical and operational insights.",
  },
  {
    href: "/services/cloud-hybrid",
    title: "Cloud & Hybrid Infrastructure",
    description:
      "HIPAA-compliant cloud solutions for modern healthcare delivery.",
  },
];

export default function HealthcarePage() {
  return (
    <IndustryDetailPage
      title="Healthcare & Life Sciences"
      description="Transforming patient care and operational excellence for hospitals, pharmaceutical companies, and biotech firms through innovative technology solutions, data-driven insights, and regulatory compliance expertise."
      helpItems={helpItems}
      serviceLinks={serviceLinks}
      ctaHeading="Ready to Transform Healthcare Delivery?"
      ctaDescription="Let's discuss how JTLD Consulting can help you improve patient outcomes, ensure regulatory compliance, and leverage technology for better healthcare."
    />
  );
}
