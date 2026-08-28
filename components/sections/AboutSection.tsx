'use client';

import { MapPin, Mail, Phone, ExternalLink, ShieldCheck, User, FlaskConical, Users, Award, BookOpen, Compass, BarChart3, Globe, FileText, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { FaLinkedinIn, FaFacebookF } from 'react-icons/fa6';
import { SiResearchgate, SiOrcid } from 'react-icons/si';
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

        {/* Uncombined Clean Section Blocks */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Top Row: Identity Card (Left) & Research Philosophy (Right) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem', alignItems: 'stretch' }}>
            
            {/* Identity & Direct Contact Card */}
            <div className="bezel-card" style={{ gridColumn: 'span 5' }}>
              <div className="bezel-core" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.5rem' }}>
                <div>
                  {/* Avatar & Title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
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

                    <div>
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
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <Mail size={14} style={{ color: 'var(--accent)' }} />
                          <span className="mono">{profile.email}</span>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--fg-muted)' }}>Copy</span>
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
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <Phone size={14} style={{ color: 'var(--accent)' }} />
                          <span className="mono">{profile.phone}</span>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: 'var(--fg-muted)' }}>Copy</span>
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
                        <MapPin size={14} style={{ color: 'var(--accent)' }} />
                        <span>{profile.presentAddress}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Social Network Links with React Icons */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                  <a
                    href={profile?.socialLinks?.linkedin || 'https://linkedin.com/in/shuvomolla'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ flex: 1, minWidth: '110px', padding: '0.5rem 0.75rem', fontSize: '0.8rem', gap: '0.45rem', justifyContent: 'center' }}
                  >
                    <FaLinkedinIn size={14} style={{ color: '#0a66c2' }} />
                    <span>LinkedIn</span>
                    <ArrowUpRight size={11} style={{ color: 'var(--fg-muted)' }} />
                  </a>

                  <a
                    href={profile?.socialLinks?.facebook || 'https://facebook.com/shuvomolla'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ flex: 1, minWidth: '110px', padding: '0.5rem 0.75rem', fontSize: '0.8rem', gap: '0.45rem', justifyContent: 'center' }}
                  >
                    <FaFacebookF size={13} style={{ color: '#1877f2' }} />
                    <span>Facebook</span>
                    <ArrowUpRight size={11} style={{ color: 'var(--fg-muted)' }} />
                  </a>
                </div>
              </div>
            </div>

            {/* Research Philosophy Card */}
            <div className="bezel-card" style={{ gridColumn: 'span 7' }}>
              <div className="bezel-core" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FlaskConical size={16} style={{ color: 'var(--accent)' }} />
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--fg)' }}>
                        Research Philosophy & Focus
                      </h3>
                    </div>
                    <span className="badge badge-primary" style={{ fontSize: '0.725rem' }}>
                      <CheckCircle2 size={11} /> Empirical Inquiry
                    </span>
                  </div>

                  <p style={{ fontSize: '0.975rem', lineHeight: 1.85, color: 'var(--fg-muted)', marginBottom: '1.5rem' }}>
                    {profile?.summary ||
                      'Sociology and Social Work undergraduate with hands-on experience in empirical social research, data collection, and community development. Skilled in quantitative research methods and SPSS analysis, with a track record of co-authoring published research and leading youth organizations.'}
                  </p>

                  {/* 3 Dedicated Feature Pills with Icons */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                    {[
                      { icon: <BarChart3 size={15} style={{ color: 'var(--accent)' }} />, title: 'Quantitative SPSS', subtitle: 'Statistical Analysis' },
                      { icon: <Compass size={15} style={{ color: 'var(--accent)' }} />, title: 'Char Communities', subtitle: 'Vulnerability Studies' },
                      { icon: <Users size={15} style={{ color: 'var(--accent)' }} />, title: 'Youth Advocacy', subtitle: 'Climate Action' },
                    ].map(({ icon, title, subtitle }) => (
                      <div
                        key={title}
                        style={{
                          padding: '0.85rem 1rem',
                          borderRadius: '14px',
                          backgroundColor: 'var(--bg-elevated)',
                          border: '1px solid var(--border)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.35rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          {icon}
                          <span style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--fg)' }}>{title}</span>
                        </div>
                        <span style={{ fontSize: '0.725rem', color: 'var(--fg-muted)' }}>{subtitle}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Institutional Tag */}
                <div
                  style={{
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.825rem',
                    color: 'var(--fg-muted)',
                  }}
                >
                  <span>Faculty of Social Sciences</span>
                  <span className="mono" style={{ color: 'var(--accent)', fontWeight: 600 }}>Gono Bishwabidyalay, Savar</span>
                </div>
              </div>
            </div>

          </div>

          {/* Standalone Distinct Section: Academic Mentors & References */}
          <div className="bezel-card">
            <div className="bezel-core">
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
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

                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--fg)', marginBottom: '0.2rem' }}>
                        {mentor.name}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600, marginBottom: '0.15rem' }}>
                        {mentor.role}
                      </p>
                      <p className="mono" style={{ fontSize: '0.725rem', color: 'var(--fg-muted)' }}>
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
        @media (max-width: 960px) {
          .section > .container div[style*="grid-template-columns: repeat(12"] > .bezel-card {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </section>
  );
}
