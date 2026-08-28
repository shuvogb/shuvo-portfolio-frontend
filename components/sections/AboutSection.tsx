'use client';

import { motion } from 'motion/react';
import { MapPin, Mail, Phone, ExternalLink, ShieldCheck } from 'lucide-react';
import type { Profile } from '@/types/portfolio';

interface AboutSectionProps {
  profile?: Profile;
  isLoading: boolean;
}

export function AboutSection({ profile, isLoading }: AboutSectionProps) {
  return (
    <section id="about" className="section section-alt" aria-label="About Shuvo Molla">
      <div className="container">
        
        <div className="section-header">
          <span className="section-eyebrow">Background</span>
          <h2 className="section-title">About Me</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* Profile Card */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: 'var(--radius)',
                  backgroundColor: 'var(--primary-subtle)',
                  border: '1px solid var(--primary-border)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1.35rem',
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  'SM'
                )}
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.15rem' }}>{profile?.name || 'Shuvo Molla'}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 500 }}>
                  Sociology & Social Work
                </p>
              </div>
            </div>

            {/* Direct Contact Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--foreground)', textDecoration: 'none' }}
                >
                  <Mail size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  <span className="mono">{profile.email}</span>
                </a>
              )}
              {profile?.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--foreground)', textDecoration: 'none' }}
                >
                  <Phone size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  <span className="mono">{profile.phone}</span>
                </a>
              )}
              {profile?.presentAddress && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
                  <MapPin size={15} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                  <span>{profile.presentAddress}</span>
                </div>
              )}
            </div>

            {/* Social / Academic Links */}
            {(profile?.socialLinks?.linkedin || profile?.socialLinks?.researchGate || profile?.socialLinks?.orcid) && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                {profile.socialLinks.linkedin && (
                  <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="badge badge-primary">
                    LinkedIn <ExternalLink size={11} />
                  </a>
                )}
                {profile.socialLinks.researchGate && (
                  <a href={profile.socialLinks.researchGate} target="_blank" rel="noopener noreferrer" className="badge">
                    ResearchGate <ExternalLink size={11} />
                  </a>
                )}
                {profile.socialLinks.orcid && (
                  <a href={profile.socialLinks.orcid} target="_blank" rel="noopener noreferrer" className="badge">
                    ORCID <ExternalLink size={11} />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Bio & References Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Summary</h3>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: 'var(--muted-foreground)' }}>
                {profile?.summary}
              </p>
            </div>

            {/* References Card */}
            {profile?.references && profile.references.length > 0 && (
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem' }}>Academic References</h3>
                  <span className="badge" style={{ fontSize: '0.7rem' }}>
                    <ShieldCheck size={12} style={{ color: 'var(--primary)' }} /> Verified
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {profile.references.map((ref, idx) => (
                    <div key={idx} style={{ paddingLeft: '0.75rem', borderLeft: '2px solid var(--primary)' }}>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--foreground)' }}>{ref.name}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>{ref.title}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 500 }}>{ref.institution}</p>
                      {!ref.isPublic && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.2rem' }}>
                          Contact information available upon request
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
