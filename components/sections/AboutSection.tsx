'use client';

import { MapPin, Mail, Phone, ShieldCheck, User, Compass, BarChart3, Globe, CheckCircle2 } from 'lucide-react';
import { FiLinkedin, FiFacebook } from 'react-icons/fi';
import { SectionBadge } from '@/components/ui/SectionBadge';
import type { Profile } from '@/types/portfolio';
import { toast } from 'sonner';

interface AboutSectionProps {
  profile?: Profile;
  isLoading: boolean;
}

export function AboutSection({ profile, isLoading }: AboutSectionProps) {
  const avatarSrc = profile?.avatarUrl || '/images/shuvo.png';

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <section id="about" className="section bg-grid-pattern" aria-label="About Shuvo Molla">
      <div className="container">
        
        {/* Section Header */}
        <div className="section-header">
          <SectionBadge icon={<User size={13} />}>
            Academic Bio & Background
          </SectionBadge>
          <h2 className="section-title">Background & Scholarship</h2>
          <p className="section-description">
            Sociology and Social Work researcher with deep focus on empirical methodologies, statistical modeling with SPSS, and grassroots community initiatives.
          </p>
        </div>

        {/* Responsive Section Layout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Top Row: Identity Card (Left) & Research Philosophy (Right) */}
          <div className="about-top-grid">
            
            {/* Identity & Direct Contact Card */}
            <div className="bezel-card about-identity-card">
              <div className="bezel-core" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.5rem', height: '100%' }}>
                <div>
                  {/* Avatar & Title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <div
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        border: '1px solid var(--border)',
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

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--fg)', marginBottom: '0.15rem' }}>
                        {profile?.name || 'Shuvo Molla'}
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600 }}>
                        Sociology & Social Work
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--fg-muted)' }}>
                        Gono Bishwabidyalay · Savar
                      </p>
                    </div>
                  </div>

                  {/* Direct Contact Options with Icons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {profile?.email && (
                      <button
                        onClick={() => copyToClipboard(profile.email!, 'Email')}
                        title="Click to copy email address"
                        className="btn btn-secondary"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '12px',
                          fontSize: '0.825rem',
                          gap: '0.5rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0, overflow: 'hidden' }}>
                          <Mail size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{profile.email}</span>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--fg-muted)', flexShrink: 0 }}>Copy</span>
                      </button>
                    )}

                    {profile?.phone && (
                      <button
                        onClick={() => copyToClipboard(profile.phone!, 'Phone number')}
                        title="Click to copy phone number"
                        className="btn btn-secondary"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '12px',
                          fontSize: '0.825rem',
                          gap: '0.5rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                          <Phone size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                          <span style={{ fontSize: '0.8rem' }}>{profile.phone}</span>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--fg-muted)', flexShrink: 0 }}>Copy</span>
                      </button>
                    )}

                    {profile?.presentAddress && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.65rem 0.85rem',
                          borderRadius: '12px',
                          backgroundColor: 'var(--bg-elevated)',
                          border: '1px solid var(--border)',
                          fontSize: '0.825rem',
                          color: 'var(--fg-muted)',
                        }}
                      >
                        <MapPin size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.8rem' }}>{profile.presentAddress}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Social Channels Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
                  {profile?.socialLinks?.linkedin && (
                    <a
                      href={profile.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', padding: '0.45rem 0.85rem', flex: 1, justifyContent: 'center' }}
                    >
                      <FiLinkedin size={14} />
                      <span>LinkedIn</span>
                    </a>
                  )}

                  {profile?.socialLinks?.facebook && (
                    <a
                      href={profile.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', padding: '0.45rem 0.85rem', flex: 1, justifyContent: 'center' }}
                    >
                      <FiFacebook size={14} />
                      <span>Facebook</span>
                    </a>
                  )}
                </div>

              </div>
            </div>

            {/* Research Philosophy Card */}
            <div className="bezel-card about-philosophy-card">
              <div className="bezel-core" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.5rem', height: '100%' }}>
                
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                      <Compass size={18} style={{ color: 'var(--accent)' }} />
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--fg)' }}>
                        Research Philosophy & Focus
                      </h3>
                    </div>

                    <span className="badge badge-primary" style={{ fontSize: '0.725rem' }}>
                      <CheckCircle2 size={11} /> Empirical Inquiry
                    </span>
                  </div>

                  <p style={{ fontSize: '0.925rem', lineHeight: 1.7, color: 'var(--fg-muted)', marginBottom: '1.5rem' }}>
                    Sociology and Social Work undergraduate with hands-on experience in social research, data collection, and community development. Skilled in quantitative research methods and SPSS, with a demonstrated ability to coordinate events and engage in social advocacy.
                  </p>
                </div>

                {/* 3 Standalone Feature Cards */}
                <div className="about-features-grid">
                  <div
                    style={{
                      padding: '0.85rem',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem', color: 'var(--accent)' }}>
                      <BarChart3 size={15} strokeWidth={1.8} />
                      <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--fg)' }}>Quantitative</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', lineHeight: 1.45, margin: 0 }}>
                      Cross-sectional surveys, SPSS statistical analysis, and demographic modeling.
                    </p>
                  </div>

                  <div
                    style={{
                      padding: '0.85rem',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem', color: 'var(--accent)' }}>
                      <Globe size={15} strokeWidth={1.8} />
                      <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--fg)' }}>Char Studies</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', lineHeight: 1.45, margin: 0 }}>
                      Multidimensional deprivation, climate resilience, and riverine char communities.
                    </p>
                  </div>

                  <div
                    style={{
                      padding: '0.85rem',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem', color: 'var(--accent)' }}>
                      <User size={15} strokeWidth={1.8} />
                      <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--fg)' }}>Advocacy</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--fg-muted)', lineHeight: 1.45, margin: 0 }}>
                      Youth mobilization, climate justice with YouthNet, and career mentorship.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Bottom Standalone Card: Verified Mentors & Institutional Referees */}
          <div className="bezel-card">
            <div className="bezel-core" style={{ padding: '1.5rem' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <ShieldCheck size={18} style={{ color: 'var(--accent)' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--fg)' }}>
                    Academic Mentors & Institutional Referees
                  </h3>
                </div>
                <span className="badge" style={{ fontSize: '0.725rem' }}>
                  <CheckCircle2 size={11} style={{ color: 'var(--accent)' }} /> Verified Faculty
                </span>
              </div>

              <div className="about-mentors-grid">
                {[
                  {
                    name: 'Dr. Md. Tariqul Islam',
                    role: 'Director, Center for Multidisciplinary Research',
                    institution: 'Gono Bishwabidyalay · Savar, Dhaka',
                  },
                  {
                    name: 'Dr. Subrina Rahman',
                    role: 'Senior Lecturer, Dept. of Sociology & Social Work',
                    institution: 'Gono Bishwabidyalay · Savar, Dhaka',
                  },
                ].map((mentor) => (
                  <div
                    key={mentor.name}
                    style={{
                      padding: '1.1rem 1.25rem',
                      borderRadius: '14px',
                      backgroundColor: 'var(--bg-elevated)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem',
                    }}
                  >
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--accent-subtle)',
                        border: '1px solid var(--accent-border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent)',
                        flexShrink: 0,
                      }}
                    >
                      <User size={20} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--fg)', marginBottom: '0.2rem' }}>
                        {mentor.name}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600, marginBottom: '0.15rem' }}>
                        {mentor.role}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--fg-muted)' }}>
                        {mentor.institution}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        .about-top-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          align-items: stretch;
        }

        .about-features-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }

        .about-mentors-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }

        @media (min-width: 640px) {
          .about-features-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .about-mentors-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .about-top-grid {
            grid-template-columns: 5fr 7fr;
          }
        }
      `}</style>
    </section>
  );
}
