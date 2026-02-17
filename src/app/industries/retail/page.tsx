import { Metadata } from "next";
import IndustryDetailPage from "@/components/templates/IndustryDetailPage";

export const metadata: Metadata = {
  title: "Retail & E-Commerce Solutions | JTLD Consulting",
  description:
    "Transform retail operations with expert consulting in omnichannel commerce, supply chain optimization, customer analytics, and personalization.",
};

const helpItems = [
  {
    title: "Omnichannel Commerce Excellence",
    description:
      "Create seamless shopping experiences across web, mobile, and physical stores with unified commerce platforms that enable buy online pickup in-store, endless aisle, and consistent customer experiences everywhere.",
  },
  {
    title: "Supply Chain Optimization",
    description:
      "Transform supply chain operations with real-time visibility, demand forecasting, and intelligent inventory management that reduce stockouts, minimize waste, and improve fulfillment speed.",
  },
  {
    title: "Customer Analytics & Insights",
    description:
      "Unlock deep customer understanding through advanced analytics, behavioral tracking, and predictive modeling that inform merchandising, marketing, and strategic decisions.",
  },
  {
    title: "Personalization & Customer Engagement",
    description:
      "Deliver tailored experiences with AI-powered recommendation engines, dynamic pricing, personalized marketing, and loyalty programs that increase conversion rates and customer lifetime value.",
  },
  {
    title: "Inventory & Demand Planning",
    description:
      "Optimize inventory across channels with machine learning forecasting, automated replenishment, and allocation strategies that balance availability with working capital efficiency.",
  },
  {
    title: "Store Operations & POS Modernization",
    description:
      "Modernize in-store operations with cloud-based POS systems, mobile checkout, clienteling tools, and store analytics that empower associates and enhance the physical retail experience.",
  },
];

const serviceLinks = [
  {
    href: "/services/business-consulting",
    title: "Business Consulting",
    description:
      "Strategic guidance for retail transformation and growth.",
  },
  {
    href: "/services/business-process",
    title: "Business Process Optimization",
    description:
      "Streamline operations from procurement to fulfillment.",
  },
  {
    href: "/services/managed-it",
    title: "Managed IT Services",
    description:
      "Reliable infrastructure for 24/7 retail operations.",
  },
  {
    href: "/services/ai",
    title: "AI & Machine Learning",
    description:
      "Personalization and demand forecasting powered by AI.",
  },
  {
    href: "/services/data-analytics",
    title: "Data & Analytics",
    description:
      "Transform customer and operational data into retail insights.",
  },
  {
    href: "/services/cloud-hybrid",
    title: "Cloud & Hybrid Infrastructure",
    description:
      "Scalable cloud solutions for modern retail commerce.",
  },
];

export default function RetailPage() {
  return (
    <IndustryDetailPage
      title="Retail & E-Commerce"
      description="Revolutionizing retail experiences through seamless omnichannel strategies, intelligent supply chain management, and personalized customer engagement that drives growth and loyalty in competitive markets."
      helpItems={helpItems}
      serviceLinks={serviceLinks}
      ctaHeading="Ready to Transform Your Retail Experience?"
      ctaDescription="Let's discuss how JTLD Consulting can help you create seamless omnichannel experiences, optimize your supply chain, and drive customer loyalty."
    />
  );
}
