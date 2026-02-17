import type { Metadata } from "next";
import ServiceDetailPage from "@/components/templates/ServiceDetailPage";

export const metadata: Metadata = {
  title: "Cloud & Hybrid IT",
  description: "Cloud strategy and hybrid infrastructure — migration, multi-cloud management, DevOps, and cost optimization.",
};

export default function CloudHybridPage() {
  return (
    <ServiceDetailPage
      tagline="Cloud Strategy & Hybrid Infrastructure"
      title="Cloud & Hybrid IT"
      description="Migrate, modernize, and optimize your infrastructure with a cloud strategy built for performance, security, and cost efficiency."
      whatWeDoIntro="Cloud isn't just infrastructure — it's a business decision. We help you choose the right model, migrate smoothly, and manage your environment to maximize value while minimizing risk and cost."
      capabilities={[
        { title: "Cloud Migration", description: "Plan and execute workload migration to AWS, Azure, or GCP with minimal disruption and a clear cost model." },
        { title: "Hybrid Architecture", description: "Design infrastructure that spans on-premises and cloud, giving you flexibility without sacrificing control or compliance." },
        { title: "Cost Optimization", description: "Audit your cloud spend, right-size resources, and implement FinOps practices that keep costs aligned with value." },
        { title: "DevOps & Automation", description: "Build CI/CD pipelines, infrastructure-as-code, and platform engineering practices that accelerate delivery." },
        { title: "Multi-Cloud Management", description: "Manage workloads across multiple cloud providers with unified governance, security, and visibility." },
        { title: "Cloud Security", description: "Implement cloud-native security controls, identity management, and compliance monitoring from day one." },
      ]}
      ctaHeading="Ready for the Cloud?"
      ctaDescription="Let's design a cloud strategy that fits your business — not the other way around."
    />
  );
}
