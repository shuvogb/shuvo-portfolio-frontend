import { 
  Trophy, 
  Users, 
  HeartHandshake, 
  FileText, 
  Sparkles, 
  Sun, 
  Award, 
  Building, 
  Calendar,
  type LucideIcon
} from 'lucide-react';

export interface AchievementDetails {
  category: string;
  highlight: string;
  title: string;
  images: string[];
  location: string;
  organization: string;
  scope: string;
  fullStory: string;
  keyTakeaways: string[];
  icon: LucideIcon;
}

export function getAchievementDetails(text: string, index: number): AchievementDetails {
  const lower = (text || '').toLowerCase();

  if (lower.includes('rasulpur') || lower.includes('livestock') || lower.includes('poultry') || lower.includes('survey')) {
    return {
      category: 'Community Development',
      highlight: '20 Families Supported',
      title: 'Land Survey & Livestock Distribution in Rasulpur Char',
      images: [
        'https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=1200&auto=format&fit=crop'
      ],
      location: 'Rasulpur Char, Gaibandha District',
      organization: 'Community Field Initiative',
      scope: 'Field Survey & Economic Aid',
      fullStory: 'Conducted comprehensive household baseline surveys across isolated riverine char islands in Gaibandha. Coordinated the direct procurement and distribution of livestock and poultry assets to 20 vulnerable rural families, establishing sustainable household income generation and dietary security.',
      keyTakeaways: [
        'Conducted door-to-door demographic and asset-mapping survey across remote char settlements',
        'Procured and distributed livestock directly to 20 vulnerable households',
        'Formulated post-distribution monitoring protocol with village community leaders'
      ],
      icon: Users,
    };
  }

  if (lower.includes('livelihood')) {
    return {
      category: 'Livelihood Initiatives',
      highlight: 'Char Economic Resilience',
      title: 'Community Livelihood Enhancement Program',
      images: [
        'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1200&auto=format&fit=crop'
      ],
      location: 'Gaibandha District, Bangladesh',
      organization: 'Rural Development Network',
      scope: 'Community Capacity Building',
      fullStory: 'Partnered with local char residents to identify seasonal economic bottlenecks and co-design community-driven livelihood interventions. Facilitated grassroots consultations on flood-resilient agriculture and self-help group formation.',
      keyTakeaways: [
        'Conducted participatory rural appraisal (PRA) workshops with local residents',
        'Engaged community stakeholders in flood-resilient livelihood design',
        'Documented local indigenous coping strategies for seasonal river erosion'
      ],
      icon: HeartHandshake,
    };
  }

  if (lower.includes('quantitative') || lower.includes('demo report')) {
    return {
      category: 'Academic Research',
      highlight: 'Quantitative Methodology',
      title: 'Quantitative Social Research Methodology Report',
      images: [
        'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200&auto=format&fit=crop'
      ],
      location: 'Department of Sociology and Social Work',
      organization: 'Gono Bishwabidyalay',
      scope: 'Statistical Data Analysis',
      fullStory: 'Prepared an exhaustive demonstration report on quantitative social research methods under departmental faculty supervision. Formulated structured survey questionnaires, performed statistical cleaning in SPSS/Excel, and synthesized cross-sectional empirical findings into peer-reviewed research format.',
      keyTakeaways: [
        'Formulated validated Likert-scale questionnaires for social variables',
        'Executed univariate and bivariate statistical analysis using SPSS and Excel',
        'Drafted standardized academic methodology sections and data visualizations'
      ],
      icon: FileText,
    };
  }

  if (lower.includes('gbcdc') || lower.includes('career development')) {
    return {
      category: 'Career Leadership',
      highlight: '20+ Student Programs',
      title: '20+ University-Wide Career Development Programs',
      images: [
        'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200&auto=format&fit=crop'
      ],
      location: 'Gono Bishwabidyalay Campus',
      organization: 'GBCDC (Career Development Club)',
      scope: 'Youth Professional Readiness',
      fullStory: 'Led the conceptualization, logistics, guest speaker coordination, and on-ground execution of over 20 professional career development sessions with GBCDC. Reached hundreds of undergraduate students with workshops on resume crafting, corporate networking, and leadership readiness.',
      keyTakeaways: [
        'Organized 20+ skill sessions spanning corporate and academic career tracks',
        'Coordinated keynote industry experts and corporate trainers',
        'Managed student engagement, registration pipelines, and venue operations'
      ],
      icon: Sparkles,
    };
  }

  if (lower.includes('climate') || lower.includes('youthnet')) {
    return {
      category: 'Climate Justice',
      highlight: 'YouthNet Global Advocacy',
      title: 'Youth Climate Advocacy & Mobilization Campaigns',
      images: [
        'https://images.unsplash.com/photo-1618042164219-62c820f10723?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1200&auto=format&fit=crop'
      ],
      location: 'Dhaka & Regional Centers',
      organization: 'YouthNet Global',
      scope: 'National Climate Policy Advocacy',
      fullStory: 'Actively participated in national and regional climate justice campaigns, human chains, and youth policy dialogues with YouthNet Global. Advocated for ambitious NDC implementation, youth-inclusive climate finance, and loss & damage accountability.',
      keyTakeaways: [
        'Mobilized grassroots youth in nationwide climate action demonstrations',
        'Participated in pre-COP national negotiation roundtables',
        'Promoted community awareness on climate adaptation in vulnerable river deltas'
      ],
      icon: Sun,
    };
  }

  if (lower.includes('excellence bangladesh')) {
    return {
      category: 'Youth Empowerment',
      highlight: 'Excellence Bangladesh',
      title: 'Student Leadership & Professional Events Portfolio',
      images: [
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop'
      ],
      location: 'Dhaka (Online & In-Person)',
      organization: 'Excellence Bangladesh',
      scope: 'Youth Skill Accelerator',
      fullStory: 'Contributed to planning and executing high-impact student workshops and virtual masterclasses with Excellence Bangladesh. Bridged university students with corporate leaders and motivational thinkers.',
      keyTakeaways: [
        'Managed event workflows for multi-tier hybrid student conferences',
        'Facilitated participant networking channels and feedback loops',
        'Enhanced youth awareness in digital literacy and employability skills'
      ],
      icon: Award,
    };
  }

  if (lower.includes('table and tales') || lower.includes('hospitality') || lower.includes('guests')) {
    return {
      category: 'Operations & Management',
      highlight: '100+ Daily Guests',
      title: 'Commercial Operations & Customer Experience Stewardship',
      images: [
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1200&auto=format&fit=crop'
      ],
      location: 'Savar, Dhaka',
      organization: 'Table and Tales',
      scope: 'Hospitality Management',
      fullStory: 'Oversaw daily operational floor management, VIP customer relations, and billing reconciliation for 100+ dining guests daily over a 2-month intensive contract. Maintained high customer satisfaction and efficient inventory turnaround.',
      keyTakeaways: [
        'Streamlined daily point-of-sale audits and cash reconciliations',
        'Supervised frontline service staff and table turnaround times',
        'Resolved guest inquiries with high professionalism and service quality'
      ],
      icon: Building,
    };
  }

  if (lower.includes('department') || lower.includes('sociology')) {
    return {
      category: 'Institutional Leadership',
      highlight: '10+ Academic Seminars',
      title: 'Sociology & Social Work Departmental Academic Events',
      images: [
        'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop'
      ],
      location: 'Gono Bishwabidyalay',
      organization: 'Dept. of Sociology & Social Work',
      scope: 'Academic Symposium Operations',
      fullStory: 'Organized and coordinated approximately 10 major departmental seminars, symposia, and academic workshops. Managed faculty communications, guest speaker protocol, auditorium staging, and publication materials.',
      keyTakeaways: [
        'Managed end-to-end conference logistics for 10+ departmental gatherings',
        'Facilitated student presentation panels and research showcases',
        'Drafted event documentation, administrative records, and press releases'
      ],
      icon: Calendar,
    };
  }

  // Fallback
  return {
    category: 'Field Milestone',
    highlight: 'Key Achievement',
    title: text || 'Field Milestone',
    images: [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop'
    ],
    location: 'Bangladesh',
    organization: 'Professional Endeavors',
    scope: 'Institutional Leadership',
    fullStory: text || 'Specialized field achievement and milestone.',
    keyTakeaways: [
      'Successfully executed key program milestones',
      'Collaborated with diverse team members and institutional stakeholders'
    ],
    icon: Trophy,
  };
}
