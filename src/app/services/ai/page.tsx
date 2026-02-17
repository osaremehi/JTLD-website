import type { Metadata } from "next";
import ServiceDetailPage from "@/components/templates/ServiceDetailPage";

export const metadata: Metadata = {
  title: "Artificial Intelligence",
  description: "AI solutions and implementation — strategy, machine learning, NLP, computer vision, and responsible AI governance.",
};

export default function AIPage() {
  return (
    <ServiceDetailPage
      tagline="AI Solutions & Implementation"
      title="Artificial Intelligence"
      description="From strategy to production-ready systems, we help organizations harness AI to automate, predict, and innovate — responsibly and at scale."
      whatWeDoIntro="AI is transforming every industry — but only for organizations that implement it thoughtfully. We bridge the gap between AI ambition and real-world production, ensuring every model delivers business value."
      capabilities={[
        { title: "AI Strategy & Roadmap", description: "Assess AI readiness, identify high-value use cases, and build a prioritized implementation plan aligned to business goals." },
        { title: "Machine Learning Models", description: "Design, train, and deploy custom ML models for prediction, classification, recommendation, and optimization." },
        { title: "Natural Language Processing", description: "Extract insights from text at scale — document processing, sentiment analysis, chatbots, and knowledge mining." },
        { title: "Computer Vision", description: "Automate visual inspection, object detection, and image classification for manufacturing, retail, and healthcare." },
        { title: "Intelligent Automation", description: "Combine AI with RPA to automate complex, judgment-based workflows that traditional automation can't handle." },
        { title: "AI Governance & Ethics", description: "Establish responsible AI frameworks covering bias detection, explainability, privacy, and regulatory compliance." },
      ]}
      ctaHeading="Ready to Put AI to Work?"
      ctaDescription="Let's explore how AI can create value for your organization — starting with a focused assessment."
    />
  );
}
