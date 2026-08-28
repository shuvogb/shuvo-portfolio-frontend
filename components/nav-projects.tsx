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
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Quick Access</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => {
          const isActive = pathname === item.url;
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={isActive} tooltip={item.name}>
                <Link
                  href={item.url}
                  target={item.target}
                  rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <item.icon className="size-4 shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </div>
                  {item.target === '_blank' && (
                    <ExternalLink className="size-3 text-[var(--fg-muted)] shrink-0 ml-auto" />
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
