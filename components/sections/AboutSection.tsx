'use client';

import { motion } from 'motion/react';
import { MapPin, Mail, Phone, ExternalLink, ShieldCheck, User } from 'lucide-react';
import type { Profile } from '@/types/portfolio';

interface AboutSectionProps {
  profile?: Profile;
  isLoading: boolean;
}

export function AboutSection({ profile, isLoading }: AboutSectionProps) {
  const avatarSrc = profile?.avatarUrl || '/images/shuvo.png';

  return (
    <section id="about" className="section bg-grid-pattern" aria-label="About Shuvo Molla">
      <div className="container">
        
        {/* Header */}
        <div className="section-header">
          <span className="section-eyebrow">
            <User size={13} /> Academic Bio & Profile
          </span>
          <h2 className="section-title">Background & Narrative</h2>
          <p className="section-description">
            Sociology and social work researcher specializing in quantitative analysis, community-driven interventions, and academic scholarship.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* Identity & Direct Details Bento Card */}
          <div className="bezel-card">
            <div className="bezel-core">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.75rem' }}>
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '16px',
                    border: '1px solid var(--border-strong)',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={avatarSrc}
                    alt={profile?.name || 'Shuvo Molla'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                <div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.15rem' }}>
                    {profile?.name || 'Shuvo Molla'}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>
                    Sociology & Social Work
                  </p>
                  <p style={{ fontSize: '0.775rem', color: 'var(--fg-muted)' }}>
                    Gono Bishwabidyalay
                  </p>
                </div>
              </div>

              {/* Direct Information Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {profile?.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-elevated)',
                      fontSize: '0.85rem',
                      color: 'var(--fg)',
                      textDecoration: 'none',
                    }}
                  >
                    <Mail size={15} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    <span className="mono">{profile.email}</span>
                  </a>
                )}

                {profile?.phone && (
                  <a
                    href={`tel:${profile.phone}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-elevated)',
                      fontSize: '0.85rem',
                      color: 'var(--fg)',
                      textDecoration: 'none',
                    }}
                  >
                    <Phone size={15} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    <span className="mono">{profile.phone}</span>
                  </a>
                )}

                {profile?.presentAddress && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-elevated)',
                      fontSize: '0.85rem',
                      color: 'var(--fg-muted)',
                    }}
                  >
                    <MapPin size={15} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    <span>{profile.presentAddress}</span>
                  </div>
                )}
              </div>

              {/* Academic Profile Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border)' }}>
                {profile?.socialLinks?.linkedin && (
                  <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="badge badge-primary">
                    LinkedIn <ExternalLink size={11} />
                  </a>
                )}
                {profile?.socialLinks?.researchGate && (
                  <a href={profile.socialLinks.researchGate} target="_blank" rel="noopener noreferrer" className="badge">
                    ResearchGate <ExternalLink size={11} />
                  </a>
                )}
                {profile?.socialLinks?.orcid && (
                  <a href={profile.socialLinks.orcid} target="_blank" rel="noopener noreferrer" className="badge">
                    ORCID <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Bio Narrative & References Bento */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Bio Narrative Card */}
            <div className="bezel-card">
              <div className="bezel-core">
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.85rem' }}>
                  Research Philosophy & Focus
                </h3>
                <p style={{ fontSize: '0.975rem', lineHeight: 1.85, color: 'var(--fg-muted)' }}>
                  {profile?.summary}
                </p>
              </div>
            </div>

            {/* Academic References Card */}
            {profile?.references && profile.references.length > 0 && (
              <div className="bezel-card">
                <div className="bezel-core">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.15rem' }}>Academic Mentors & References</h3>
                    <span className="badge badge-primary" style={{ fontSize: '0.725rem' }}>
                      <ShieldCheck size={12} /> Verified
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {profile.references.map((ref, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '0.85rem 1rem',
                          borderRadius: '12px',
                          backgroundColor: 'var(--bg-elevated)',
                          borderLeft: '3px solid var(--accent)',
                        }}
                      >
                        <p style={{ fontWeight: 700, fontSize: '0.925rem', color: 'var(--fg)', marginBottom: '0.15rem' }}>
                          {ref.name}
                        </p>
                        <p style={{ fontSize: '0.825rem', color: 'var(--accent)', fontWeight: 600 }}>
                          {ref.title}
                        </p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--fg-muted)' }}>
                          {ref.institution}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
