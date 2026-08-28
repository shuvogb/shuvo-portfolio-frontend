'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import {
  Users,
  Eye,
  MessageSquare,
  TrendingUp,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Layers,
  BookOpen,
  Briefcase,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';

interface OverviewData {
  totalVisitors: number;
  totalPageViews: number;
  totalContacts: number;
  mostViewedSection: string | null;
}

function StatCard({
  value,
  label,
  icon: Icon,
  subtitle,
}: {
  value: number | string;
  label: string;
  icon: React.ElementType;
  subtitle?: string;
}) {
  return (
    <div className="card" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--fg-muted)' }}>
          {label}
        </span>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: 'var(--accent-subtle)',
            color: 'var(--accent)',
            border: '1px solid var(--accent-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon size={16} strokeWidth={2} />
        </div>
      </div>

      <div>
        <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--fg)', lineHeight: 1.1, letterSpacing: '-0.03em', margin: 0 }}>
          {value}
        </p>
        {subtitle && (
          <p style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', margin: 0, marginTop: '0.35rem' }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

const QUICK_ACTIONS = [
  { href: '/admin/profile', label: 'Edit Profile & Bio', icon: Users, desc: 'Update contact info, headline, and private data' },
  { href: '/admin/skills', label: 'Manage Skills Matrix', icon: Layers, desc: 'Reorder, add, or edit technical competencies' },
  { href: '/admin/publications', label: 'Research Papers', icon: BookOpen, desc: 'Manage citations, abstracts, and DOI links' },
  { href: '/admin/experience', label: 'Work Experience', icon: Briefcase, desc: 'Update organizational leadership roles' },
  { href: '/admin/messages', label: 'Inquiries & Messages', icon: MessageSquare, desc: 'Read and manage incoming portfolio messages' },
  { href: '/admin/analytics', label: 'Visitor Analytics', icon: BarChart3, desc: 'Analyze visitor dwell time and section views' },
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Welcome Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--fg)', letterSpacing: '-0.03em', marginBottom: '0.35rem' }}>
            Executive Dashboard
          </h1>
          <p style={{ color: 'var(--fg-muted)', fontSize: '0.9rem', margin: 0 }}>
            Real-time portfolio metrics, content management modules, and inquiry tracking.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            fontSize: '0.825rem',
            padding: '0.45rem 1rem',
            borderRadius: 'var(--radius-pill)',
            height: '38px',
          }}
        >
          <span>Preview Live Site</span>
          <ExternalLink size={13} strokeWidth={2} />
        </Link>
      </div>

      {/* Stats KPI Block Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <StatCard
          value={isLoading ? '—' : (data?.totalVisitors ?? 0)}
          label="Unique Visitors"
          icon={Users}
          subtitle="All-time tracked visitor sessions"
        />
        <StatCard
          value={isLoading ? '—' : (data?.totalPageViews ?? 0)}
          label="Total Impressions"
          icon={Eye}
          subtitle="Portfolio interactions and loads"
        />
        <StatCard
          value={isLoading ? '—' : (data?.totalContacts ?? 0)}
          label="Inquiry Submissions"
          icon={MessageSquare}
          subtitle="Contact form messages received"
        />
        <StatCard
          value={isLoading ? '—' : (data?.mostViewedSection ? data.mostViewedSection.charAt(0).toUpperCase() + data.mostViewedSection.slice(1) : 'Hero')}
          label="Most Engaged Section"
          icon={TrendingUp}
          subtitle="Highest visitor dwell duration"
        />
      </div>

      {/* Quick Actions & Navigation Grid */}
      <div className="card" style={{ padding: 0 }}>
        <div className="card-header" style={{ padding: '1.5rem 1.75rem 1rem' }}>
          <h2 className="card-title" style={{ fontSize: '1.1rem' }}>
            Content Management Blocks
          </h2>
          <p className="card-description">
            Quickly jump to key sections of your portfolio to manage data and media
          </p>
        </div>

        <div style={{ padding: '1.5rem 1.75rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {QUICK_ACTIONS.map(({ href, label, icon: Icon, desc }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.85rem',
                padding: '1rem 1.15rem',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}
              className="hover:border-[var(--accent)] hover:shadow-sm"
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--accent)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon size={16} strokeWidth={1.8} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: '0.875rem', fontWeight: 650, color: 'var(--fg)', margin: 0 }}>
                    {label}
                  </p>
                  <ArrowRight size={13} style={{ color: 'var(--fg-muted)' }} />
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', margin: '0.25rem 0 0 0', lineHeight: 1.35 }}>
                  {desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
