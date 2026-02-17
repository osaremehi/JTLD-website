import type { Metadata } from "next";
import ServiceDetailPage from "@/components/templates/ServiceDetailPage";

export const metadata: Metadata = {
  title: "Business Process Services",
  description: "Process optimization and outsourcing — workflow automation, Lean/Six Sigma, and continuous improvement services.",
};

export default function BusinessProcessPage() {
  return (
    <ServiceDetailPage
      tagline="Process Optimization & Outsourcing"
      title="Business Process Services"
      description="Streamline operations, reduce costs, and improve quality through systematic process redesign and managed outsourcing."
      whatWeDoIntro="Inefficient processes drain resources and slow growth. We map your operations, identify high-impact improvement areas, and deliver automation and redesign that produces measurable ROI."
      capabilities={[
        { title: "Process Mapping & Analysis", description: "Visualize end-to-end workflows, identify bottlenecks, and quantify waste to build a clear optimization roadmap." },
        { title: "Workflow Automation", description: "Automate repetitive, manual tasks with RPA and intelligent automation to free up capacity and reduce errors." },
        { title: "Outsourcing Strategy", description: "Determine which functions to outsource, select the right partners, and manage transitions seamlessly." },
        { title: "Lean / Six Sigma", description: "Apply proven methodologies to eliminate waste, reduce variation, and deliver consistent, high-quality outcomes." },
        { title: "Shared Services Design", description: "Consolidate back-office functions into shared services centers that scale efficiently across business units." },
        { title: "Continuous Improvement", description: "Embed a culture of ongoing optimization with KPI frameworks, feedback loops, and governance structures." },
      ]}
      ctaHeading="Ready to Optimize Your Operations?"
      ctaDescription="Let's identify the processes holding your business back and build a plan to fix them."
    />
  );
}
