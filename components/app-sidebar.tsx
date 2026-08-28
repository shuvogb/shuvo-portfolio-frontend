'use client';

import * as React from 'react';
import {
  LayoutDashboard,
  User,
  Layers,
  Briefcase,
  BookOpen,
  Star,
  GraduationCap,
  Award,
  MessageSquare,
  BarChart3,
  Shield,
  Settings2,
  Globe,
  Sparkles,
  Command,
  Flame,
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavProjects } from '@/components/nav-projects';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useAuthStore } from '@/stores/authStore';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();

  const data = React.useMemo(() => {
    return {
      user: {
        name: user?.name || 'Shuvo Molla',
        email: user?.email || 'shuvomolla7374@gmail.com',
        avatar: user?.avatarUrl || '/images/shuvo.png',
      },
      teams: [
        {
          name: 'Shuvo Portfolio',
          logo: Command,
          plan: 'Production CMS',
        },
        {
          name: 'Academic Research',
          logo: Flame,
          plan: 'Sociology Lab',
        },
      ],
      navMain: [
        {
          title: 'Overview',
          url: '/admin/dashboard',
          icon: LayoutDashboard,
          isActive: true,
          items: [
            {
              title: 'Dashboard KPI',
              url: '/admin/dashboard',
            },
            {
              title: 'Visitor Analytics',
              url: '/admin/analytics',
            },
            {
              title: 'Inquiry Inbox',
              url: '/admin/messages',
            },
          ],
        },
        {
          title: 'Portfolio Content',
          url: '/admin/profile',
          icon: User,
          items: [
            {
              title: 'Hero & Identity',
              url: '/admin/profile',
            },
            {
              title: 'Background & Scholarship',
              url: '/admin/about',
            },
            {
              title: 'Skills Matrix',
              url: '/admin/skills',
            },
            {
              title: 'Experience History',
              url: '/admin/experience',
            },
            {
              title: 'Research Publications',
              url: '/admin/publications',
            },
            {
              title: 'Key Achievements',
              url: '/admin/achievements',
            },
            {
              title: 'Education Records',
              url: '/admin/education',
            },
            {
              title: 'Workshops & Training',
              url: '/admin/workshops',
            },
          ],
        },
        {
          title: 'System & Security',
          url: '/admin/settings',
          icon: Settings2,
          items: [
            {
              title: 'Security & Audit Logs',
              url: '/admin/security',
            },
            {
              title: 'Password & Preferences',
              url: '/admin/settings',
            },
          ],
        },
      ],
      projects: [
        {
          name: 'Public Portfolio',
          url: '/',
          icon: Globe,
          target: '_blank',
        },
        {
          name: 'Research Papers',
          url: '/#research',
          icon: BookOpen,
          target: '_blank',
        },
      ],
    };
  }, [user]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
