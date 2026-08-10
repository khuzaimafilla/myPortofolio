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
  contact: {
    linkedin: string;
    instagram: string;
    email: string;
    whatsapp: string;
    github?: string;
  };
}

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
      title: "KRTrade — Trade Journal",
      subtitle: "Professional Trading Analytics Platform",
      description: "A high-performance trading journal application designed for traders to record, evaluate, and optimize their trades with interactive performance metrics.",
      image: "/images/project/krtrade.jpg",
      link: "https://github.com/khuzaimafilla",
      category: "Web App",
      tags: ["Astro", "React", "TypeScript", "Tailwind CSS"],
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
