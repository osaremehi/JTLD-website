import type { Metadata } from "next";
import ServiceDetailPage from "@/components/templates/ServiceDetailPage";

export const metadata: Metadata = {
  title: "Managed IT Services",
  description: "End-to-end IT outsourcing — 24/7 monitoring, infrastructure management, cybersecurity, and IT service desk.",
};

export default function ManagedITPage() {
  return (
    <ServiceDetailPage
      tagline="End-to-End IT Outsourcing"
      title="Managed IT Services"
      description="Reliable, secure, and cost-effective IT operations — managed by experts so your team can focus on what matters most."
      whatWeDoIntro="IT complexity grows every year — but your IT budget doesn't have to. We take full ownership of your technology operations, delivering enterprise-grade service at a predictable cost."
      capabilities={[
        { title: "24/7 Monitoring & Support", description: "Round-the-clock infrastructure monitoring with proactive alerting and rapid incident response." },
        { title: "Infrastructure Management", description: "Full lifecycle management of servers, networks, storage, and endpoints — on-premises or in the cloud." },
        { title: "Cybersecurity Operations", description: "Security monitoring, vulnerability management, threat detection, and incident response to protect your business." },
        { title: "IT Service Desk", description: "Tiered helpdesk support (L1/L2/L3) with SLA-backed response times and a seamless user experience." },
        { title: "Compliance & Governance", description: "Ensure your IT environment meets regulatory requirements — SOC 2, HIPAA, PCI-DSS, and industry-specific standards." },
        { title: "Vendor Management", description: "Manage relationships with technology vendors, negotiate contracts, and consolidate your IT supplier landscape." },
      ]}
      ctaHeading="Ready to Simplify Your IT?"
      ctaDescription="Let's talk about how managed services can reduce your IT burden and improve reliability."
    />
  );
}
