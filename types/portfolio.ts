export interface Profile {
  _id: string;
  name: string;
  headline: string;
  summary: string;
  statusBadge?: string;
  avatarUrl?: string;
  heroStats?: {
    events?: { value: string; label: string; sublabel: string };
    papers?: { value: string; label: string; sublabel: string };
    reach?: { value: string; label: string; sublabel: string };
  };
  primaryCta?: { label: string; link: string };
  secondaryCta?: { label: string; link: string };
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
  privateInfo?: {
    fathersName?: string;
    mothersName?: string;
    dateOfBirth?: string;
    religion?: string;
    maritalStatus?: string;
    nationality?: string;
    gender?: string;
    bloodGroup?: string;
    isPublic: boolean;
  };
  aboutSection?: {
    badge?: string;
    title?: string;
    description?: string;
    department?: string;
    university?: string;
    philosophyBadge?: string;
    philosophyTitle?: string;
    philosophyDescription?: string;
    pillars?: Array<{
      title: string;
      description: string;
      icon?: string;
    }>;
    refereesBadge?: string;
    refereesTitle?: string;
  };
  skillsSection?: {
    badge?: string;
    title?: string;
    description?: string;
  };
  experienceSection?: {
    badge?: string;
    title?: string;
    description?: string;
  };
  educationSection?: {
    badge?: string;
    title?: string;
    description?: string;
  };
  publicationsSection?: {
    badge?: string;
    title?: string;
    description?: string;
  };
  achievementsSection?: {
    badge?: string;
    title?: string;
    description?: string;
  };
  workshopsSection?: {
    badge?: string;
    title?: string;
    description?: string;
    certificateHeight?: number;
    certificateFit?: string;
  };
  contactSection?: {
    badge?: string;
    title?: string;
    description?: string;
    collabTitle?: string;
    collabDescription?: string;
  };
  footerSection?: {
    roleBadge?: string;
    tagline?: string;
    location?: string;
    navTitle?: string;
    channelsTitle?: string;
    copyrightText?: string;
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
  icon?: string;
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
  title?: string;
  category?: string;
  highlight?: string;
  imageUrl?: string;
  images?: string[];
  description: string;
  location?: string;
  organization?: string;
  scope?: string;
  fullStory?: string;
  keyTakeaways?: string[];
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
  description?: string;
  imageUrl?: string;
  imageHeight?: number;
  imageFit?: string;
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
