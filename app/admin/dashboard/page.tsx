'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { Users, Eye, MessageSquare, TrendingUp, ExternalLink, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

interface OverviewData {
  totalVisitors: number;
  totalPageViews: number;
  totalContacts: number;
  mostViewedSection: string | null;
}

function StatCard({ value, label, icon: Icon }: { value: number | string; label: string; icon: React.ElementType }) {
  return (
    <div className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
      <div style={{
        width: '40px', height: '40px',
        borderRadius: 'var(--radius)',
        backgroundColor: 'var(--primary-subtle)',
        color: 'var(--primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={18} />
      </div>
      <div>
        <p style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--foreground)', lineHeight: 1, letterSpacing: '-0.02em' }}>
          {value}
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginTop: '0.35rem' }}>
          {label}
        </p>
      </div>
    </div>
  );
}

const QUICK_LINKS = [
  { href: '/admin/profile', label: 'Edit Profile Information' },
  { href: '/admin/skills', label: 'Manage Skills' },
  { href: '/admin/experience', label: 'Update Work Experience' },
  { href: '/admin/publications', label: 'Manage Publications' },
  { href: '/admin/messages', label: 'View Inquiries & Messages' },
  { href: '/admin/analytics', label: 'Visitor Analytics & Dwell Time' },
];

export default function AdminDashboard() {
  const { data, isLoading } = useQuery<OverviewData>({
    queryKey: ['analytics-overview'],
    queryFn: async () => {
      const res = await api.get('/admin/analytics/overview');
      return res.data.data;
    },
  });

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
          Dashboard
        </h1>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>
          Overview of your portfolio activity and content management.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard
          value={isLoading ? '—' : (data?.totalVisitors ?? 0)}
          label="Total Unique Visitors"
          icon={Users}
        />
        <StatCard
          value={isLoading ? '—' : (data?.totalPageViews ?? 0)}
          label="Total Page Views"
          icon={Eye}
        />
        <StatCard
          value={isLoading ? '—' : (data?.totalContacts ?? 0)}
          label="Contact Messages"
          icon={MessageSquare}
        />
        <StatCard
          value={isLoading ? '—' : (data?.mostViewedSection ? data.mostViewedSection.charAt(0).toUpperCase() + data.mostViewedSection.slice(1) : 'N/A')}
          label="Top Viewed Section"
          icon={TrendingUp}
        />
      </div>

      {/* Links and Public Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        <div className="card">
          <h2 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
            Quick Actions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {QUICK_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.6rem 0.75rem',
                  borderRadius: 'var(--radius)',
                  textDecoration: 'none',
                  color: 'var(--foreground)',
                  fontSize: '0.85rem',
                  backgroundColor: 'var(--muted)',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <span>{label}</span>
                <ArrowRight size={14} style={{ color: 'var(--muted-foreground)' }} />
              </Link>
            ))}
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '2rem', gap: '1rem' }}>
          <div style={{
            width: '48px', height: '48px',
            borderRadius: 'var(--radius)',
            backgroundColor: 'var(--primary-subtle)',
            color: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ExternalLink size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>
              Public Portfolio
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', marginBottom: '1.25rem' }}>
              Preview the live website as seen by visitors
            </p>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Open Website <ExternalLink size={14} />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
