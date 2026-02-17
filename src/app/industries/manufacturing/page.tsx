import { Metadata } from "next";
import IndustryDetailPage from "@/components/templates/IndustryDetailPage";

export const metadata: Metadata = {
  title: "Manufacturing Solutions | JTLD Consulting",
  description:
    "Modernize manufacturing operations with expert consulting in smart factories, IoT, supply chain optimization, quality control, and predictive maintenance.",
};

const helpItems = [
  {
    title: "Smart Factory & Industry 4.0",
    description:
      "Transform traditional manufacturing into connected smart factories with integrated MES, ERP systems, digital twins, and real-time production monitoring that optimize throughput and quality.",
  },
  {
    title: "Industrial IoT & Automation",
    description:
      "Deploy sensor networks, edge computing, and automated systems that capture machine data, enable remote monitoring, and drive process improvements across the production floor.",
  },
  {
    title: "Supply Chain & Logistics Optimization",
    description:
      "Optimize end-to-end supply chains with demand-driven planning, supplier collaboration platforms, and logistics management that reduce lead times and improve material availability.",
  },
  {
    title: "Quality Management & Compliance",
    description:
      "Implement comprehensive quality management systems with statistical process control, automated inspection, and traceability that ensure compliance with ISO, FDA, and industry standards.",
  },
  {
    title: "Predictive Maintenance & Asset Performance",
    description:
      "Maximize equipment uptime with AI-powered predictive maintenance, condition monitoring, and asset performance management that prevent unplanned downtime and extend asset life.",
  },
  {
    title: "Production Planning & Scheduling",
    description:
      "Optimize production schedules with advanced planning systems, capacity optimization, and finite scheduling that balance customer demands with resource constraints and delivery commitments.",
  },
];

const serviceLinks = [
  {
    href: "/services/business-consulting",
    title: "Business Consulting",
    description:
      "Strategic guidance for manufacturing transformation and operational excellence.",
  },
  {
    href: "/services/business-process",
    title: "Business Process Optimization",
    description:
      "Streamline production processes and lean manufacturing initiatives.",
  },
  {
    href: "/services/managed-it",
    title: "Managed IT Services",
    description:
      "Reliable infrastructure for manufacturing operations and OT/IT convergence.",
  },
  {
    href: "/services/ai",
    title: "AI & Machine Learning",
    description:
      "Predictive maintenance and quality control powered by AI.",
  },
  {
    href: "/services/data-analytics",
    title: "Data & Analytics",
    description:
      "Transform manufacturing data into operational insights.",
  },
  {
    href: "/services/cloud-hybrid",
    title: "Cloud & Hybrid Infrastructure",
    description:
      "Secure cloud solutions for modern manufacturing systems.",
  },
];

export default function ManufacturingPage() {
  return (
    <IndustryDetailPage
      title="Manufacturing"
      description="Advancing manufacturing excellence through Industry 4.0 technologies, intelligent automation, and data-driven operations that drive quality, efficiency, and innovation across discrete and process manufacturing."
      helpItems={helpItems}
      serviceLinks={serviceLinks}
      ctaHeading="Ready to Build the Smart Factory of Tomorrow?"
      ctaDescription="Let's discuss how JTLD Consulting can help you leverage Industry 4.0 technologies, optimize operations, and drive manufacturing excellence."
    />
  );
}
