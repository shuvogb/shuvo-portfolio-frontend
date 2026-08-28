'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard, User, Layers, Briefcase, BookOpen,
  Star, GraduationCap, Award, MessageSquare, BarChart3,
  Shield, Settings, LogOut, Menu, X, ChevronRight, Laptop, Moon, Sun,
} from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';

const NAV_ITEMS = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/profile', icon: User, label: 'Profile' },
  { href: '/admin/skills', icon: Layers, label: 'Skills' },
  { href: '/admin/experience', icon: Briefcase, label: 'Experience' },
  { href: '/admin/publications', icon: BookOpen, label: 'Publications' },
  { href: '/admin/achievements', icon: Star, label: 'Achievements' },
  { href: '/admin/education', icon: GraduationCap, label: 'Education' },
  { href: '/admin/workshops', icon: Award, label: 'Workshops' },
  { href: '/admin/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/admin/security', icon: Shield, label: 'Security' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/me')
      .then((res) => {
        setUser(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        router.replace('/admin/login');
      });
  }, [router, setUser]);

  const handleLogout = async () => {
    await api.post('/auth/logout').catch(() => {});
    logout();
    router.replace('/admin/login');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--background)' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--border)', borderTopColor: 'var(--primary)', animation: 'spin 0.6s linear infinite' }} role="status" aria-label="Loading" />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const SIDEBAR_WIDTH = '240px';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--muted)' }}>
      
      {/* Desktop Sidebar */}
      <aside
        aria-label="Admin navigation"
        style={{
          width: SIDEBAR_WIDTH,
          minHeight: '100vh',
          backgroundColor: 'var(--card)',
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          overflowY: 'auto',
        }}
        className="admin-sidebar"
      >
        {/* Header */}
        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid var(--border)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
            <div style={{
              width: '32px', height: '32px',
              borderRadius: 'var(--radius)',
              backgroundColor: 'var(--primary)',
              color: 'var(--primary-foreground)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.85rem',
              flexShrink: 0,
            }}>
              SM
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--foreground)', lineHeight: 1.2 }}>
                {user?.name?.split(' ')[0] || 'Admin'}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>Portfolio CMS</p>
            </div>
          </Link>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '0.75rem 0.5rem' }}>
          <ul role="list" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
              const isActive = pathname === href || (pathname.startsWith(href) && href !== '/admin/dashboard');
              return (
                <li key={href}>
                  <Link
                    href={href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.55rem 0.75rem',
                      borderRadius: 'var(--radius)',
                      textDecoration: 'none',
                      fontSize: '0.85rem',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--primary)' : 'var(--muted-foreground)',
                      backgroundColor: isActive ? 'var(--primary-subtle)' : 'transparent',
                      transition: 'all 0.15s',
                    }}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={16} />
                    {label}
                    {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer actions */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={toggleTheme}
              title={`Switch theme (current: ${theme})`}
              aria-label="Toggle theme mode"
              className="btn btn-secondary"
              style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem' }}
            >
              {theme === 'system' ? <Laptop size={14} /> : theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
              <span style={{ textTransform: 'capitalize' }}>{theme}</span>
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ flex: 1, padding: '0.5rem', fontSize: '0.75rem' }}
              aria-label="Log out"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div style={{ flex: 1, marginLeft: SIDEBAR_WIDTH, minHeight: '100vh' }} className="admin-main">
        {/* Mobile Header */}
        <header
          style={{
            padding: '0.875rem 1.25rem',
            backgroundColor: 'var(--card)',
            borderBottom: '1px solid var(--border)',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
          className="admin-mobile-header"
        >
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={sidebarOpen}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground)' }}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>SM Admin</span>
          <div style={{ width: '20px' }} />
        </header>

        <main style={{ padding: '2rem' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .admin-sidebar { display: none !important; }
          .admin-main { margin-left: 0 !important; }
          .admin-mobile-header { display: flex !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
