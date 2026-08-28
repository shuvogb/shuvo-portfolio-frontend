'use client';

import * as React from 'react';
import { ChevronsUpDown, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
}) {
  const { isMobile } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);

  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-[var(--bg-elevated)] data-[state=open]:text-[var(--fg)] hover:bg-[var(--bg-elevated)]"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-[var(--accent)] text-white font-bold shadow-sm">
                <activeTeam.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                <span className="truncate font-semibold text-[var(--fg)] text-xs">{activeTeam.name}</span>
                <span className="truncate text-[0.7rem] text-[var(--fg-muted)]">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-[var(--fg-muted)] shrink-0" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent
            className="w-68 rounded-xl p-2 shadow-2xl"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={8}
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              zIndex: 99999,
            }}
          >
            <DropdownMenuLabel className="text-[0.675rem] font-bold text-[var(--fg-muted)] uppercase tracking-wider px-2.5 py-1">
              Workspaces
            </DropdownMenuLabel>
            
            <div className="flex flex-col gap-1 my-1">
              {teams.map((team, index) => (
                <DropdownMenuItem
                  key={team.name}
                  onClick={() => setActiveTeam(team)}
                  className="gap-3 p-2 rounded-lg cursor-pointer hover:bg-[var(--bg-elevated)]"
                >
                  <div className="flex size-7 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg-elevated)] shrink-0">
                    <team.logo className="size-3.5 text-[var(--accent)]" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-semibold text-xs text-[var(--fg)] truncate">{team.name}</span>
                    <span className="text-[0.675rem] text-[var(--fg-muted)] truncate">{team.plan}</span>
                  </div>
                  <DropdownMenuShortcut className="text-xs font-mono ml-auto pl-2 text-[var(--fg-muted)]">
                    ⌘{index + 1}
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
            </div>

            <DropdownMenuSeparator className="my-1 bg-[var(--border)]" />
            
            <DropdownMenuItem className="gap-2.5 p-2 rounded-lg cursor-pointer text-[var(--fg-muted)] hover:text-[var(--fg)] hover:bg-[var(--bg-elevated)]">
              <div className="flex size-7 items-center justify-center rounded-md border border-dashed border-[var(--border)] bg-transparent shrink-0">
                <Plus className="size-3.5" />
              </div>
              <span className="font-medium text-xs">Add Workspace</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
