import { Metadata } from "next";
import IndustryDetailPage from "@/components/templates/IndustryDetailPage";

export const metadata: Metadata = {
  title: "Financial Services & FinTech Solutions | JTLD Consulting",
  description:
    "Transform your financial services operations with expert consulting in regulatory compliance, digital banking, fraud detection, and legacy system modernization.",
};

const helpItems = [
  {
    title: "Regulatory Compliance & Risk Management",
    description:
      "Navigate complex regulatory requirements with confidence. We help implement compliance frameworks, automate reporting, and build risk management systems that meet SOX, Basel III, GDPR, and other critical standards.",
  },
  {
    title: "Digital Banking Transformation",
    description:
      "Modernize your banking platforms with mobile-first solutions, open banking APIs, and seamless omnichannel experiences that meet evolving customer expectations in the digital age.",
  },
  {
    title: "Fraud Detection & Prevention",
    description:
      "Leverage AI and machine learning to detect fraudulent transactions in real-time, reduce false positives, and protect your customers while maintaining frictionless experiences.",
  },
  {
    title: "Legacy System Modernization",
    description:
      "Migrate from outdated mainframe systems to modern, scalable cloud architectures without disrupting critical operations. Our phased approach minimizes risk while maximizing ROI.",
  },
  {
    title: "Data Analytics & Business Intelligence",
    description:
      "Unlock the value of your financial data with advanced analytics, predictive modeling, and real-time dashboards that drive better decision-making and competitive advantage.",
  },
  {
    title: "FinTech Innovation & Integration",
    description:
      "Stay competitive with emerging technologies including blockchain, cryptocurrency platforms, robo-advisors, and embedded finance solutions that create new revenue streams.",
  },
];

const serviceLinks = [
  {
    href: "/services/business-consulting",
    title: "Business Consulting",
    description:
      "Strategic guidance for digital transformation and operational excellence.",
  },
  {
    href: "/services/business-process",
    title: "Business Process Optimization",
    description:
      "Streamline operations and improve efficiency across your organization.",
  },
  {
    href: "/services/managed-it",
    title: "Managed IT Services",
    description:
      "Comprehensive IT management and support for financial institutions.",
  },
  {
    href: "/services/ai",
    title: "AI & Machine Learning",
    description:
      "Deploy intelligent systems for fraud detection and predictive analytics.",
  },
  {
    href: "/services/data-analytics",
    title: "Data & Analytics",
    description:
      "Transform financial data into actionable business insights.",
  },
  {
    href: "/services/cloud-hybrid",
    title: "Cloud & Hybrid Infrastructure",
    description:
      "Secure, compliant cloud solutions for modern financial services.",
  },
];

export default function FinancialServicesPage() {
  return (
    <IndustryDetailPage
      title="Financial Services & FinTech"
      description="Empowering banks, insurance companies, and capital markets firms with cutting-edge technology solutions and strategic consulting to navigate regulatory complexity, accelerate digital transformation, and deliver exceptional customer experiences."
      helpItems={helpItems}
      serviceLinks={serviceLinks}
      ctaHeading="Ready to Transform Your Financial Services Operations?"
      ctaDescription="Let's discuss how JTLD Consulting can help you navigate regulatory challenges, modernize legacy systems, and deliver innovative financial solutions."
    />
  );
}
