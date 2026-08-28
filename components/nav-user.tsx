'use client';

import { useRouter } from 'next/navigation';
import {
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
  Moon,
  Shield,
  Sun,
  User,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import api from '@/lib/api';

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const handleLogout = async () => {
    await api.post('/auth/logout').catch(() => {});
    logout();
    router.replace('/admin/login');
  };

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-[var(--bg-elevated)] data-[state=open]:text-[var(--fg)] hover:bg-[var(--bg-elevated)]"
            >
              <Avatar className="h-8 w-8 rounded-lg overflow-hidden border border-[var(--border)]">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-[var(--accent-subtle)] text-[var(--accent)] font-bold">
                  {initials || 'SM'}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                <span className="truncate font-semibold text-[var(--fg)] text-xs">{user.name}</span>
                <span className="truncate text-[0.7rem] text-[var(--fg-muted)]">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-[var(--fg-muted)] shrink-0" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent
            className="w-72 rounded-2xl p-2.5 shadow-2xl"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={8}
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              zIndex: 99999,
            }}
          >
            {/* Header User Identity Card with Generous Padding */}
            <div className="flex items-center gap-3 p-3 bg-[var(--bg-elevated)] rounded-xl mb-1.5 border border-[var(--border)]">
              <Avatar className="h-10 w-10 rounded-xl overflow-hidden border border-[var(--border)] shrink-0">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-xl bg-[var(--accent)] text-white font-bold text-xs">
                  {initials || 'SM'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="truncate font-bold text-[var(--fg)] text-sm leading-tight mb-0.5">
                  {user.name}
                </span>
                <span className="truncate text-xs text-[var(--fg-muted)] leading-tight">
                  {user.email}
                </span>
              </div>
            </div>

            <DropdownMenuSeparator className="my-1 bg-[var(--border)]" />

            {/* Menu Actions */}
            <DropdownMenuGroup className="flex flex-col gap-0.5">
              <DropdownMenuItem onClick={toggleTheme} className="gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[var(--bg-elevated)] text-sm">
                {theme === 'dark' ? <Sun className="size-4 text-[var(--accent)]" /> : <Moon className="size-4 text-[var(--accent)]" />}
                <span>Theme: {theme === 'dark' ? 'Dark' : 'Light'} Mode</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/admin/security')} className="gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[var(--bg-elevated)] text-sm">
                <Shield className="size-4 text-[var(--fg-muted)]" />
                <span>Security & Audit Logs</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/admin/settings')} className="gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-[var(--bg-elevated)] text-sm">
                <BadgeCheck className="size-4 text-[var(--fg-muted)]" />
                <span>Account Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="my-1 bg-[var(--border)]" />

            {/* Logout Action */}
            <DropdownMenuItem
              onClick={handleLogout}
              className="gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-500/10 focus:text-red-600 focus:bg-red-500/10 text-sm"
            >
              <LogOut className="size-4" />
              <span className="font-semibold">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
