import { Metadata } from "next";
import IndustryDetailPage from "@/components/templates/IndustryDetailPage";

export const metadata: Metadata = {
  title: "Telecommunications Solutions | JTLD Consulting",
  description:
    "Transform telecom operations with expert consulting in 5G deployment, network optimization, customer retention, and billing modernization.",
};

const helpItems = [
  {
    title: "5G Network Deployment & Optimization",
    description:
      "Plan and deploy next-generation 5G networks with optimized coverage, capacity planning, spectrum management, and network slicing strategies that enable new services and revenue opportunities.",
  },
  {
    title: "Network Performance & Optimization",
    description:
      "Maximize network performance with real-time monitoring, automated optimization, and predictive analytics that improve quality of service, reduce congestion, and enhance user experiences.",
  },
  {
    title: "Customer Experience & Retention",
    description:
      "Reduce churn and increase customer satisfaction with AI-powered analytics that identify at-risk subscribers, personalize offers, and enable proactive service management and support.",
  },
  {
    title: "Billing & Revenue Management Modernization",
    description:
      "Transform billing operations with cloud-based BSS/OSS systems, real-time charging, flexible pricing models, and automated revenue assurance that support complex service offerings.",
  },
  {
    title: "OSS/BSS Transformation",
    description:
      "Modernize operational and business support systems with cloud-native platforms, microservices architectures, and API integration that enable agility and faster time-to-market for new services.",
  },
  {
    title: "IoT & Enterprise Solutions",
    description:
      "Develop new revenue streams with IoT connectivity platforms, M2M solutions, and enterprise services that leverage network assets for smart cities, connected vehicles, and industrial applications.",
  },
];

const serviceLinks = [
  {
    href: "/services/business-consulting",
    title: "Business Consulting",
    description:
      "Strategic guidance for telecom transformation and growth.",
  },
  {
    href: "/services/business-process",
    title: "Business Process Optimization",
    description:
      "Streamline operations from network planning to customer care.",
  },
  {
    href: "/services/managed-it",
    title: "Managed IT Services",
    description:
      "Reliable infrastructure for carrier-grade operations.",
  },
  {
    href: "/services/ai",
    title: "AI & Machine Learning",
    description:
      "Network optimization and customer analytics powered by AI.",
  },
  {
    href: "/services/data-analytics",
    title: "Data & Analytics",
    description:
      "Transform network and customer data into telecom insights.",
  },
  {
    href: "/services/cloud-hybrid",
    title: "Cloud & Hybrid Infrastructure",
    description:
      "Cloud-native solutions for modern telecom services.",
  },
];

export default function TelecomPage() {
  return (
    <IndustryDetailPage
      title="Telecommunications"
      description="Connecting the future with innovative solutions for carriers, ISPs, and communication service providers through next-generation network technologies, intelligent operations, and enhanced customer experiences."
      helpItems={helpItems}
      serviceLinks={serviceLinks}
      ctaHeading="Ready to Connect the Future of Telecommunications?"
      ctaDescription="Let's discuss how JTLD Consulting can help you deploy 5G, optimize network performance, and deliver exceptional customer experiences."
    />
  );
}
