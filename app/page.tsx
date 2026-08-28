'use client';

import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { ResearchSection } from '@/components/sections/ResearchSection';
import { AchievementsSection } from '@/components/sections/AchievementsSection';
import { EducationSection } from '@/components/sections/EducationSection';
import { WorkshopsSection } from '@/components/sections/WorkshopsSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { FooterSection } from '@/components/sections/FooterSection';
import { AnalyticsTracker } from '@/components/AnalyticsTracker';
import { usePortfolio } from '@/hooks/usePortfolio';

export default function HomePage() {
  const { data, isLoading, error } = usePortfolio();

  return (
    <>
      <AnalyticsTracker />
      <Navbar />
      <main id="main-content">
        <HeroSection profile={data?.profile} isLoading={isLoading} />
        <AboutSection profile={data?.profile} isLoading={isLoading} />
        <SkillsSection skills={data?.skills} profile={data?.profile} isLoading={isLoading} />
        <ExperienceSection experience={data?.experience} profile={data?.profile} isLoading={isLoading} />
        <ResearchSection publications={data?.publications} profile={data?.profile} isLoading={isLoading} />
        <AchievementsSection achievements={data?.achievements} profile={data?.profile} isLoading={isLoading} />
        <EducationSection education={data?.education} profile={data?.profile} isLoading={isLoading} />
        <WorkshopsSection workshops={data?.workshops} profile={data?.profile} isLoading={isLoading} />
        <ContactSection profile={data?.profile} isLoading={isLoading} />
      </main>
      <FooterSection profile={data?.profile} />
    </>
  );
}
