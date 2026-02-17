import { Metadata } from "next";
import IndustryDetailPage from "@/components/templates/IndustryDetailPage";

export const metadata: Metadata = {
  title: "Education Solutions | JTLD Consulting",
  description:
    "Transform educational institutions with expert consulting in digital learning, student analytics, enrollment management, and institutional efficiency.",
};

const helpItems = [
  {
    title: "Digital Learning & LMS Modernization",
    description:
      "Transform educational delivery with modern learning management systems, virtual classrooms, and blended learning environments that support diverse learning modalities and improve student engagement.",
  },
  {
    title: "Student Analytics & Success Platforms",
    description:
      "Leverage predictive analytics to identify at-risk students, personalize interventions, track progress, and improve retention and graduation rates through data-driven insights.",
  },
  {
    title: "Enrollment Management & CRM",
    description:
      "Optimize student recruitment and enrollment with integrated CRM systems, marketing automation, and application management platforms that streamline the student journey from inquiry to enrollment.",
  },
  {
    title: "Institutional Efficiency & ERP",
    description:
      "Modernize administrative operations with integrated ERP systems that streamline finance, HR, student information, and campus operations while reducing costs and improving service delivery.",
  },
  {
    title: "EdTech Platform Development",
    description:
      "Build scalable EdTech solutions including adaptive learning platforms, assessment tools, and educational apps that deliver personalized learning experiences and measurable outcomes.",
  },
  {
    title: "Campus IT Infrastructure & Security",
    description:
      "Deploy secure, high-performance campus networks, cloud infrastructure, and cybersecurity solutions that support digital learning, research computing, and protect sensitive student data.",
  },
];

const serviceLinks = [
  {
    href: "/services/business-consulting",
    title: "Business Consulting",
    description:
      "Strategic guidance for educational transformation and innovation.",
  },
  {
    href: "/services/business-process",
    title: "Business Process Optimization",
    description:
      "Streamline academic and administrative operations.",
  },
  {
    href: "/services/managed-it",
    title: "Managed IT Services",
    description:
      "Reliable campus IT infrastructure and support services.",
  },
  {
    href: "/services/ai",
    title: "AI & Machine Learning",
    description:
      "Personalized learning and student success analytics powered by AI.",
  },
  {
    href: "/services/data-analytics",
    title: "Data & Analytics",
    description:
      "Transform educational data into actionable insights for student success.",
  },
  {
    href: "/services/cloud-hybrid",
    title: "Cloud & Hybrid Infrastructure",
    description:
      "Scalable cloud solutions for modern educational institutions.",
  },
];

export default function EducationPage() {
  return (
    <IndustryDetailPage
      title="Education"
      description="Empowering universities, colleges, and EdTech companies to deliver exceptional learning experiences through digital transformation, data-driven insights, and innovative technology solutions that enhance student success and institutional effectiveness."
      helpItems={helpItems}
      serviceLinks={serviceLinks}
      ctaHeading="Ready to Transform Education for the Digital Age?"
      ctaDescription="Let's discuss how JTLD Consulting can help you enhance learning experiences, improve student outcomes, and drive institutional excellence."
    />
  );
}
