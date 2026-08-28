'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { Compass, Smartphone, Globe } from 'lucide-react';
import api from '@/lib/api';

interface AnalyticsSectionsData {
  sections: Array<{ _id: string; views: number }>;
  traffic: Array<{ _id: string; count: number }>;
  devices: Array<{ _id: string; count: number }>;
  referrers: Array<{ _id: string; count: number }>;
}

export default function AdminAnalyticsPage() {
  const { data, isLoading } = useQuery<AnalyticsSectionsData>({
    queryKey: ['admin-analytics-sections'],
    queryFn: async () => {
      const res = await api.get('/admin/analytics/sections');
      return res.data.data;
    },
  });

  const maxSectionViews = Math.max(...(data?.sections.map((s) => s.views) || [1]));

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
          Visitor Analytics
        </h1>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>
          Section dwell time, viewer engagement, and traffic telemetry.
        </p>
      </div>

      {isLoading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: '220px' }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          {/* Section Dwell & Views */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Compass size={18} style={{ color: 'var(--primary)' }} />
              <h2 style={{ fontSize: '1.1rem' }}>
                Section Engagement
              </h2>
            </div>

            {data?.sections.length === 0 ? (
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.85rem' }}>No section data recorded yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {data?.sections.map((sec) => {
                  const pct = Math.round((sec.views / maxSectionViews) * 100);
                  return (
                    <div key={sec._id}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{sec._id}</span>
                        <span className="mono" style={{ color: 'var(--muted-foreground)' }}>{sec.views} views</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--muted)', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${pct}%`,
                            height: '100%',
                            backgroundColor: 'var(--primary)',
                            borderRadius: '9999px',
                            transition: 'width 0.4s ease',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Device Telemetry */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Smartphone size={18} style={{ color: 'var(--primary)' }} />
              <h2 style={{ fontSize: '1.1rem' }}>
                Device Breakdown
              </h2>
            </div>

            {data?.devices.length === 0 ? (
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.85rem' }}>No device records yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {data?.devices.map((dev) => (
                  <div
                    key={dev._id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.6rem 0.75rem',
                      backgroundColor: 'var(--muted)',
                      borderRadius: 'var(--radius)',
                    }}
                  >
                    <span style={{ textTransform: 'capitalize', fontSize: '0.85rem', fontWeight: 600 }}>
                      {dev._id || 'Desktop'}
                    </span>
                    <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700 }}>
                      {dev.count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Referrers */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Globe size={18} style={{ color: 'var(--primary)' }} />
              <h2 style={{ fontSize: '1.1rem' }}>
                Traffic Sources
              </h2>
            </div>

            {data?.referrers.length === 0 ? (
              <p style={{ color: 'var(--muted-foreground)', fontSize: '0.85rem' }}>Direct traffic / No external referrers yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {data?.referrers.map((ref) => (
                  <div
                    key={ref._id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.6rem 0.75rem',
                      backgroundColor: 'var(--muted)',
                      borderRadius: 'var(--radius)',
                    }}
                  >
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                      {ref._id || 'Direct Visit'}
                    </span>
                    <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 700 }}>
                      {ref.count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
