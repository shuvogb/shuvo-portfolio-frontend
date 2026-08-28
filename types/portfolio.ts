export interface Profile {
  _id: string;
  name: string;
  headline: string;
  summary: string;
  avatarUrl?: string;
  presentAddress?: string;
  permanentAddress?: string;
  phone?: string;
  email?: string;
  socialLinks?: {
    linkedin?: string;
    facebook?: string;
    orcid?: string;
    researchGate?: string;
    github?: string;
    twitter?: string;
  };
  references?: Array<{
    name: string;
    title: string;
    institution: string;
    isPublic: boolean;
    phone?: string;
    email?: string;
  }>;
}

export interface Skill {
  _id: string;
  category: 'technical' | 'professional';
  name: string;
  order: number;
}

export interface Experience {
  _id: string;
  title: string;
  organization: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  bullets: string[];
  order: number;
}

export interface Publication {
  _id: string;
  authors: string[];
  title: string;
  source: string;
  year: number;
  volume?: string;
  pages?: string;
  link?: string;
  status: 'published' | 'underReview' | 'researchAssistant';
  description?: string;
  order: number;
}

export interface Achievement {
  _id: string;
  description: string;
  order: number;
}

export interface Education {
  _id: string;
  degree: string;
  institution: string;
  result: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  order: number;
}

export interface Language {
  _id: string;
  name: string;
  proficiency: string;
  order: number;
}

export interface Workshop {
  _id: string;
  title: string;
  organizer: string;
  year: number;
  order: number;
}

export interface PortfolioData {
  profile: Profile;
  skills: Skill[];
  experience: Experience[];
  publications: Publication[];
  achievements: Achievement[];
  education: Education[];
  languages: Language[];
  workshops: Workshop[];
}
