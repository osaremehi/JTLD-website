import { Metadata } from "next";
import IndustryDetailPage from "@/components/templates/IndustryDetailPage";

export const metadata: Metadata = {
  title: "Energy & Utilities Solutions | JTLD Consulting",
  description:
    "Power the future with expert consulting in grid modernization, sustainability, asset management, and predictive maintenance for energy and utilities sectors.",
};

const helpItems = [
  {
    title: "Smart Grid Modernization",
    description:
      "Transform legacy grid infrastructure with IoT sensors, smart meters, and real-time monitoring systems that improve reliability, enable demand response, and integrate renewable energy sources seamlessly.",
  },
  {
    title: "Sustainability & ESG Initiatives",
    description:
      "Develop and implement comprehensive sustainability strategies, carbon tracking systems, and ESG reporting frameworks that meet regulatory requirements and stakeholder expectations.",
  },
  {
    title: "Enterprise Asset Management",
    description:
      "Optimize the lifecycle management of critical infrastructure assets including generation facilities, transmission lines, and distribution networks through integrated asset performance management systems.",
  },
  {
    title: "Predictive Maintenance & IoT",
    description:
      "Reduce downtime and maintenance costs with AI-powered predictive analytics that identify equipment failures before they occur, extending asset life and improving operational efficiency.",
  },
  {
    title: "Energy Trading & Market Operations",
    description:
      "Implement advanced trading platforms, forecasting models, and market analytics that optimize energy procurement, hedging strategies, and revenue management in dynamic energy markets.",
  },
  {
    title: "Customer Experience & Billing Modernization",
    description:
      "Enhance customer engagement with digital portals, mobile apps, and flexible billing systems that support time-of-use rates, distributed energy resources, and personalized energy management.",
  },
];

const serviceLinks = [
  {
    href: "/services/business-consulting",
    title: "Business Consulting",
    description:
      "Strategic guidance for energy transition and operational transformation.",
  },
  {
    href: "/services/business-process",
    title: "Business Process Optimization",
    description:
      "Streamline operations from generation to customer service.",
  },
  {
    href: "/services/managed-it",
    title: "Managed IT Services",
    description:
      "Reliable infrastructure for critical energy operations.",
  },
  {
    href: "/services/ai",
    title: "AI & Machine Learning",
    description:
      "Predictive maintenance and energy demand forecasting solutions.",
  },
  {
    href: "/services/data-analytics",
    title: "Data & Analytics",
    description:
      "Transform operational data into actionable energy insights.",
  },
  {
    href: "/services/cloud-hybrid",
    title: "Cloud & Hybrid Infrastructure",
    description:
      "Scalable cloud solutions for modern energy management.",
  },
];

export default function EnergyPage() {
  return (
    <IndustryDetailPage
      title="Energy & Utilities"
      description="Driving innovation in power generation, renewable energy, and utilities through intelligent grid solutions, sustainability initiatives, and advanced asset management that powers communities and businesses efficiently."
      helpItems={helpItems}
      serviceLinks={serviceLinks}
      ctaHeading="Ready to Power the Future of Energy?"
      ctaDescription="Let's discuss how JTLD Consulting can help you modernize grid infrastructure, embrace sustainability, and optimize energy operations."
    />
  );
}
