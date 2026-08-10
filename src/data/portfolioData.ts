export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link?: string;
  category: 'Web App' | 'UI/UX' | 'Static Web';
  tags: string[];
  featured?: boolean;
  bentoSpan: string; // e.g. "col-span-1 md:col-span-2 row-span-2"
  accentColor?: string;
}

export interface Skill {
  name: string;
  category: 'Frontend' | 'Design' | 'Multimedia' | 'Tech';
  icon: string; // Lucide icon name or fontawesome equivalent
  level: number; // percentage
  description?: string;
}

export interface EducationItem {
  institution: string;
  major: string;
  period: string;
  logo: string; // e.g., "/images/logos/polinema.png"
}

export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  logo: string; // e.g., "/images/logos/indolakto.png"
}

export interface OrganizationItem {
  organization: string;
  role: string;
  period: string;
  logo: string; // e.g., "/images/logos/bem.png"
}

export interface PortfolioData {
  name: string;
  title: string;
  roles: string[];
  bio: string;
  aboutDetailed: string;
  cvUrl: string;
  stats: { label: string; value: string }[];
  skills: Skill[];
  projects: Project[];
  education: EducationItem[];
  experience: ExperienceItem[];
  organization: OrganizationItem[];
  contact: {
    linkedin: string;
    instagram: string;
    email: string;
    whatsapp: string;
    github?: string;
  };
}

export const educationList: EducationItem[] = [
  {
    institution: "Telkom Vocational High School Malang",
    major: "Software Engineering",
    period: "2020 - 2023",
    logo: "/images/logos/smk-telkom.png"
  },
  {
    institution: "State Polytechnic of Malang (POLINEMA)",
    major: "B.A.S. (D4) in Business Information Systems",
    period: "2023 - Present",
    logo: "/images/logos/Logo-Polinema.png"
  }
];

export const industryExperienceList: ExperienceItem[] = [
  {
    company: "PDAM Delta Tirta Sidoarjo Regency",
    role: "Frontend Web Developer",
    period: "Jun 2022 - Aug 2022",
    logo: "/images/logos/pdam.png"
  },
  {
    company: "PT Telkom Akses Malang",
    role: "Office Helpdesk Assistant",
    period: "Sep 2022 - Nov 2022",
    logo: "/images/logos/telkom-akses.png"
  },
  {
    company: "PT Indolakto Purwosari",
    role: "Frontend Web Developer",
    period: "Jul 2026 - Present",
    logo: "/images/logos/indolakto.png"
  }
];

export const organizationList: OrganizationItem[] = [
  {
    organization: "Student Executive Board (BEM) POLINEMA",
    role: "Staff of Ministry of Communication and Information",
    period: "May 2024 - Dec 2024",
    logo: "/images/logos/bem-polinema.png"
  }
];

export const portfolioData: PortfolioData = {
  name: "Khuzaima Filla Januartha",
  title: "Frontend Web Developer & UI/UX Designer",
  roles: ["Frontend Engineer", "UI/UX Designer", "Creative Coder", "Information Systems Specialist"],
  bio: "Passionate about building high-performance web applications, refined UI/UX design systems, and digital innovation. Turning complex ideas into elegant, user-centric software.",
  aboutDetailed: "I am an Information Systems Business student with a deep focus on Information Technology, Frontend Development, and UI/UX Design. Experienced in building responsive web interfaces, crafting interactive application prototypes in Figma, and engineering digital solutions. My experience at PT Telkom Akses has strengthened my technical problem-solving, system maintenance, and cross-functional team collaboration skills.",
  cvUrl: "/files/CV_Khuzaima_Filla_Januartha.pdf",
  stats: [
    { label: "Projects Built", value: "10+" },
    { label: "UI/UX Prototypes", value: "15+" },
    { label: "Client Satisfaction", value: "100%" },
    { label: "Experience", value: "2+ Years" },
  ],
  education: educationList,
  experience: industryExperienceList,
  organization: organizationList,
  skills: [
    { name: "Frontend Engineering", category: "Frontend", icon: "Code2", level: 88, description: "React, Next.js, Astro, TypeScript, Tailwind CSS" },
    { name: "UI/UX Design", category: "Design", icon: "Figma", level: 90, description: "Figma, Wireframing, Design Systems, Prototyping" },
    { name: "SME Web Solutions", category: "Tech", icon: "Store", level: 75, description: "Full-stack static & dynamic web platforms for business" },
    { name: "Cinematography", category: "Multimedia", icon: "Camera", level: 80, description: "Visual storytelling, shot composition, color grading" },
    { name: "Video Editing", category: "Multimedia", icon: "Film", level: 82, description: "Premiere Pro, DaVinci Resolve, Motion Graphics" },
    { name: "AI Engineering & Prompting", category: "Tech", icon: "Bot", level: 78, description: "LLM integration, AI-driven workflow optimization" },
  ],
  projects: [
    {
      id: "krtrade",
      title: "KRTrade — Kronik & Rewards",
      subtitle: "Trading Analytics & Community Platform",
      description: "A high-performance trading analytics and community platform designed for traders to evaluate performance, track percentage-based equity growth, and build disciplined trading habits with real-time community leaderboards.",
      image: "/images/project/krtrade.png",
      link: "https://krtrade.vercel.app/",
      category: "Web App",
      tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Prisma", "Neon Postgres"],
      featured: true,
      bentoSpan: "col-span-1 md:col-span-2 row-span-2",
      accentColor: "#EDBB00"
    },
    {
      id: "heavenly",
      title: "heavenly.fd — SMEs Platform",
      subtitle: "E-Commerce & Brand Showcase",
      description: "A fast, beautifully styled static e-commerce & showcase web application built for local SMEs with modern fluid layouts.",
      image: "/images/project/heavenly.png",
      link: "https://hvnly.vercel.app/",
      category: "Static Web",
      tags: ["HTML5", "CSS3", "JavaScript", "Vercel"],
      featured: true,
      bentoSpan: "col-span-1 md:col-span-1 row-span-1",
      accentColor: "#A50044"
    },
    {
      id: "app-mobile-clone",
      title: "Mobile Shopping App Prototype",
      subtitle: "E-Commerce UI/UX Study",
      description: "Interactive mobile shopping app prototype focusing on micro-interactions, seamless checkout user flows, and modern visual hierarchy.",
      image: "/images/project/mobile-app.png",
      link: "",
      category: "UI/UX",
      tags: ["Figma", "User Research", "Prototyping", "Design System"],
      featured: false,
      bentoSpan: "col-span-1 md:col-span-1 row-span-1",
      accentColor: "#0f172a"
    }
  ],
  contact: {
    linkedin: "https://linkedin.com/in/khuzaima-filla-b1b49a25a",
    instagram: "https://instagram.com/khuzaimafilla",
    email: "mailto:khuzaimafilla@gmail.com",
    whatsapp: "https://wa.me/6282132517964",
    github: "https://github.com/khuzaimafilla"
  }
};
