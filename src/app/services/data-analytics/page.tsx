import type { Metadata } from "next";
import ServiceDetailPage from "@/components/templates/ServiceDetailPage";

export const metadata: Metadata = {
  title: "Data Analytics",
  description: "Data insights and analytics services — BI, data engineering, predictive analytics, and data governance.",
};

export default function DataAnalyticsPage() {
  return (
    <ServiceDetailPage
      tagline="Data Insights & Analytics"
      title="Data Analytics"
      description="Turn raw data into actionable intelligence. We build the platforms, pipelines, and models that give your organization a data-driven edge."
      whatWeDoIntro="Most organizations collect more data than they use. We close the gap — from building reliable data infrastructure to delivering the insights and predictions that drive better decisions."
      capabilities={[
        { title: "Data Strategy", description: "Define your data vision, architecture, and governance model to turn data into a strategic asset." },
        { title: "BI & Visualization", description: "Build interactive dashboards and reporting solutions with Power BI, Tableau, and Looker that leaders actually use." },
        { title: "Data Engineering", description: "Design and implement modern data pipelines, warehouses, and lakes that are reliable, scalable, and cost-efficient." },
        { title: "Predictive Analytics", description: "Apply statistical modeling and machine learning to forecast demand, churn, risk, and other critical business outcomes." },
        { title: "Data Governance", description: "Establish data quality, lineage, cataloging, and access controls to ensure trust and compliance across the organization." },
        { title: "Self-Service Analytics", description: "Empower business users with governed self-service tools and training so insights aren't bottlenecked by IT." },
      ]}
      ctaHeading="Ready to Unlock Your Data?"
      ctaDescription="Let's assess your data maturity and build a roadmap to analytics that actually moves the needle."
    />
  );
}
