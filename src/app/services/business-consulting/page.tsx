import type { Metadata } from "next";
import ServiceDetailPage from "@/components/templates/ServiceDetailPage";

export const metadata: Metadata = {
  title: "Business Consulting",
  description: "Strategic business consulting services — corporate strategy, growth advisory, change management, and organizational design.",
};

export default function BusinessConsultingPage() {
  return (
    <ServiceDetailPage
      tagline="Strategic Guidance & Consulting"
      title="Business Consulting"
      description="We partner with leadership teams to define strategy, drive transformation, and deliver measurable business outcomes — from boardroom to execution."
      whatWeDoIntro="Business environments are more complex than ever. We help organizations cut through ambiguity, align around priorities, and move with confidence — whether you're scaling, restructuring, or entering new markets."
      capabilities={[
        { title: "Corporate Strategy", description: "Define your competitive positioning, market focus, and long-term growth plan with data-backed strategy development." },
        { title: "Growth Advisory", description: "Identify and capture new revenue streams, markets, and customer segments with structured growth frameworks." },
        { title: "M&A Due Diligence", description: "Pre-and post-acquisition analysis covering financials, operations, technology, and integration planning." },
        { title: "Organizational Design", description: "Align structure, roles, and governance to your strategy — so the right people make the right decisions." },
        { title: "Change Management", description: "Plan and execute transformation programs that bring your people along, from executive sponsorship to frontline adoption." },
        { title: "Performance Improvement", description: "Diagnose margin erosion, cost overruns, and productivity gaps, then implement targeted operational fixes." },
      ]}
      ctaHeading="Ready to Sharpen Your Strategy?"
      ctaDescription="Let's discuss how our consulting team can help you navigate your biggest challenges."
    />
  );
}
