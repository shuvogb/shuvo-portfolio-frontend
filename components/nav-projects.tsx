'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ExternalLink, type LucideIcon } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
    target?: string;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Quick Access</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => {
          const isActive = pathname === item.url;
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={isActive} tooltip={item.name} className="w-full">
                <Link
                  href={item.url}
                  target={item.target}
                  rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                  className="flex items-center w-full"
                >
                  <item.icon className="size-4 shrink-0" />
                  <span className="flex-1 text-left truncate">{item.name}</span>
                  {item.target === '_blank' && (
                    <ExternalLink
                      className="size-3.5 text-[var(--fg-muted)] shrink-0 external-link-icon"
                      style={{ marginLeft: 'auto' }}
                    />
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
