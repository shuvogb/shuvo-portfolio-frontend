'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle2, Loader2, Mail, Phone, MapPin, Copy, Check, MessageSquare, ArrowUpRight, Calendar, FileText, Users } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

import type { Profile } from '@/types/portfolio';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactSectionProps {
  profile?: Profile;
  isLoading?: boolean;
}

export function ContactSection({ profile, isLoading }: ContactSectionProps) {
  const [submitted, setSubmitted] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const contactConfig = profile?.contactSection;
  const sectionBadge = contactConfig?.badge || 'Direct Connection';
  const sectionTitle = contactConfig?.title || 'Get in Touch';
  const sectionDesc =
    contactConfig?.description ||
    'Open to academic research collaborations, fieldwork consultations, and community initiatives. Send a note below.';
  const collabTitle = contactConfig?.collabTitle || "Let's Discuss Collaborations & Research";
  const collabDesc =
    contactConfig?.collabDescription ||
    'Feel free to reach out directly via email, phone, or by submitting this message form. I typically respond within 24–48 hours.';

  const contactEmail = profile?.email || 'shuvomolla7374@gmail.com';
  const contactPhone = profile?.phone || '+880 1607-065888';
  const contactLocation = profile?.presentAddress || 'Ashulia, Savar, Dhaka, Bangladesh';

  const heroStats = profile?.heroStats;
  const eventsStat = heroStats?.events || { value: '20+', label: 'Events Organized', sublabel: 'Youth & Academic' };
  const papersStat = heroStats?.papers || { value: '2', label: 'Academic Papers', sublabel: 'Published / Review' };
  const reachStat = heroStats?.reach || { value: '100+', label: 'Fieldwork Reach', sublabel: 'Char Communities' };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2500);
  };

  const onSubmit = async (data: ContactFormData) => {
    try {
      await api.post('/contact', data);
      setSubmitted(true);
      reset();
      toast.success("Thank you! Your message has been sent successfully.");
    } catch {
      toast.error('Failed to send message. Please try again or email directly.');
    }
  };

  return (
    <section id="contact" className="section bg-grid-pattern" aria-label="Contact and Inquiries">
      <div className="container">
        
        {/* Header */}
        <div className="section-header">
          <span className="section-eyebrow">
            <MessageSquare size={12} /> {sectionBadge}
          </span>
          <h2 className="section-title">{sectionTitle}</h2>
          <p className="section-description">
            {sectionDesc}
          </p>
        </div>        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'start' }}>
          
          {/* Left Column: Direct Communication Channels */}
          <div>
            {isLoading ? (
              <div>
                <div className="skeleton" style={{ height: '24px', width: '280px', borderRadius: '6px', marginBottom: '0.75rem' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '2rem' }}>
                  <div className="skeleton" style={{ height: '14px', width: '96%', borderRadius: '4px' }} />
                  <div className="skeleton" style={{ height: '14px', width: '80%', borderRadius: '4px' }} />
                </div>

                {/* Direct Cards Skeleton */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bezel-card">
                      <div className="bezel-core" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div className="skeleton" style={{ width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0 }} />
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            <div className="skeleton" style={{ height: '10px', width: '90px', borderRadius: '3px' }} />
                            <div className="skeleton" style={{ height: '15px', width: `${140 + (i % 2) * 40}px`, borderRadius: '4px' }} />
                          </div>
                        </div>
                        <div className="skeleton" style={{ width: '32px', height: '28px', borderRadius: '8px' }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Impact Metric Strip Skeleton */}
                <div className="contact-stats-grid">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="bezel-card" style={{ borderRadius: '16px' }}>
                      <div className="bezel-core" style={{ padding: '0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div className="skeleton" style={{ height: '26px', width: '50px', borderRadius: '6px' }} />
                          <div className="skeleton" style={{ width: '26px', height: '26px', borderRadius: '8px' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          <div className="skeleton" style={{ height: '12px', width: '85px', borderRadius: '4px' }} />
                          <div className="skeleton" style={{ height: '10px', width: '65px', borderRadius: '3px' }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                  {collabTitle}
                </h3>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.85, color: 'var(--fg-muted)', marginBottom: '2rem' }}>
                  {collabDesc}
                </p>

                {/* Direct Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
                  
                  {/* Email Card */}
                  <div
                    className="bezel-card bezel-card-interactive"
                    onClick={() => copyToClipboard(contactEmail, 'Email')}
                  >
                    <div
                      className="bezel-core"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            backgroundColor: 'var(--accent-subtle)',
                            color: 'var(--accent)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Mail size={16} />
                        </div>
                        <div>
                          <p style={{ fontSize: '0.725rem', color: 'var(--fg-muted)', fontWeight: 600 }}>EMAIL ADDRESS</p>
                          <p className="mono" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--fg)' }}>
                            {contactEmail}
                          </p>
                        </div>
                      </div>
                      <span className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                        {copiedField === 'Email' ? <Check size={13} style={{ color: 'var(--accent)' }} /> : <Copy size={13} />}
                      </span>
                    </div>
                  </div>

                  {/* Phone Card */}
                  <div
                    className="bezel-card bezel-card-interactive"
                    onClick={() => copyToClipboard(contactPhone, 'Phone')}
                  >
                    <div
                      className="bezel-core"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.25rem' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            backgroundColor: 'var(--bg-elevated)',
                            color: 'var(--fg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Phone size={16} />
                        </div>
                        <div>
                          <p style={{ fontSize: '0.725rem', color: 'var(--fg-muted)', fontWeight: 600 }}>PHONE / WHATSAPP</p>
                          <p className="mono" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--fg)' }}>
                            {contactPhone}
                          </p>
                        </div>
                      </div>
                      <span className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                        {copiedField === 'Phone' ? <Check size={13} style={{ color: 'var(--accent)' }} /> : <Copy size={13} />}
                      </span>
                    </div>
                  </div>

                  {/* Location Card */}
                  <div className="bezel-card">
                    <div
                      className="bezel-core"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem' }}
                    >
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          backgroundColor: 'var(--bg-elevated)',
                          color: 'var(--fg)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <MapPin size={16} />
                      </div>
                      <div>
                        <p style={{ fontSize: '0.725rem', color: 'var(--fg-muted)', fontWeight: 600 }}>PRIMARY LOCATION</p>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--fg)' }}>
                          {contactLocation}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Impact Metric Strip */}
                <div className="contact-stats-grid">
                  {[
                    { value: eventsStat.value, label: eventsStat.label, icon: Calendar, sublabel: eventsStat.sublabel },
                    { value: papersStat.value, label: papersStat.label, icon: FileText, sublabel: papersStat.sublabel },
                    { value: reachStat.value, label: reachStat.label, icon: Users, sublabel: reachStat.sublabel },
                  ].map(({ value, label, icon: Icon, sublabel }) => (
                    <div
                      key={label}
                      className="bezel-card"
                      style={{
                        borderRadius: '16px',
                      }}
                    >
                      <div
                        className="bezel-core"
                        style={{
                          padding: '0.85rem 1rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.3rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                          <p
                            style={{
                              fontSize: '1.65rem',
                              fontWeight: 800,
                              color: 'var(--fg)',
                              lineHeight: 1,
                              letterSpacing: '-0.035em',
                              margin: 0,
                            }}
                          >
                            {value}
                          </p>
                          <div
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '8px',
                              backgroundColor: 'var(--accent-subtle)',
                              color: 'var(--accent)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Icon size={13} strokeWidth={1.8} />
                          </div>
                        </div>

                        <div>
                          <p
                            style={{
                              fontSize: '0.825rem',
                              fontWeight: 700,
                              color: 'var(--fg)',
                              letterSpacing: '-0.01em',
                              margin: 0,
                              lineHeight: 1.3,
                            }}
                          >
                            {label}
                          </p>

                          <p
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 500,
                              color: 'var(--fg-muted)',
                              marginTop: '0.15rem',
                              marginBottom: 0,
                            }}
                          >
                            {sublabel}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}
          </div>

          {/* Right Column: Contact Form in Double-Bezel */}
          <div className="bezel-card">
            <div className="bezel-core">
              {isLoading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '0.5rem 0' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div className="skeleton" style={{ height: '14px', width: '120px', borderRadius: '4px' }} />
                    <div className="skeleton" style={{ height: '42px', width: '100%', borderRadius: '10px' }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div className="skeleton" style={{ height: '14px', width: '110px', borderRadius: '4px' }} />
                    <div className="skeleton" style={{ height: '42px', width: '100%', borderRadius: '10px' }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div className="skeleton" style={{ height: '14px', width: '140px', borderRadius: '4px' }} />
                    <div className="skeleton" style={{ height: '120px', width: '100%', borderRadius: '10px' }} />
                  </div>

                  <div className="skeleton-pill" style={{ height: '44px', width: '100%', marginTop: '0.5rem' }} />
                </div>
              ) : submitted ? (
                <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                  <CheckCircle2 size={44} style={{ color: 'var(--accent)', margin: '0 auto 1rem' }} />
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>
                    Message Successfully Sent
                  </h3>
                  <p style={{ color: 'var(--fg-muted)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
                    Thank you for reaching out. I'll get back to you shortly.
                  </p>
                  <button onClick={() => setSubmitted(false)} className="btn btn-secondary">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate aria-label="Send a direct message">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    
                    <div>
                      <label htmlFor="contact-name" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                        Your Full Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        autoComplete="name"
                        {...register('name')}
                        className="input"
                        placeholder="e.g. Dr. Alex Mercer / Research Partner"
                        aria-invalid={!!errors.name}
                      />
                      {errors.name && (
                        <p role="alert" style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="contact-email" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        autoComplete="email"
                        {...register('email')}
                        className="input"
                        placeholder="your.email@institution.edu"
                        aria-invalid={!!errors.email}
                      />
                      {errors.email && (
                        <p role="alert" style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="contact-message" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                        Message Content *
                      </label>
                      <textarea
                        id="contact-message"
                        rows={5}
                        {...register('message')}
                        className="input"
                        placeholder="Describe your research proposition, event invitation, or collaboration..."
                        style={{ resize: 'vertical', minHeight: '120px' }}
                        aria-invalid={!!errors.message}
                      />
                      {errors.message && (
                        <p role="alert" style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-island btn-island-primary"
                      style={{ width: '100%', padding: '0.65rem 0.65rem 0.65rem 1.5rem', opacity: isSubmitting ? 0.75 : 1, marginTop: '0.5rem' }}
                    >
                      <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
                      <span className="btn-island-icon">
                        {isSubmitting ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <ArrowUpRight size={14} />}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .contact-stats-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
          padding-top: 1.75rem;
          border-top: 1px solid var(--border);
        }

        @media (min-width: 540px) {
          .contact-stats-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 0.85rem;
          }
        }
      `}</style>
    </section>
  );
}
