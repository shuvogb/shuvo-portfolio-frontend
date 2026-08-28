'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle2, Loader2, Mail, Phone, MapPin, Copy, Check, MessageSquare, ArrowUpRight } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

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
            <MessageSquare size={12} /> Direct Connection
          </span>
          <h2 className="section-title">Get in Touch</h2>
          <p className="section-description">
            Open to academic research collaborations, fieldwork consultations, and community initiatives. Send a note below.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'start' }}>
          
          {/* Left Column: Direct Communication Channels */}
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
              Let's Discuss Collaborations & Research
            </h3>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.85, color: 'var(--fg-muted)', marginBottom: '2rem' }}>
              Feel free to reach out directly via email, phone, or by submitting this message form. I typically respond within 24–48 hours.
            </p>

            {/* Direct Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.5rem' }}>
              
              {/* Email Card */}
              <div
                className="bezel-card bezel-card-interactive"
                onClick={() => copyToClipboard('shuvomolla7374@gmail.com', 'Email')}
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
                        shuvomolla7374@gmail.com
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
                onClick={() => copyToClipboard('+880 1607-065888', 'Phone')}
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
                        +880 1607-065888
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
                      Ashulia, Savar, Dhaka, Bangladesh
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Impact Metric Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', paddingTop: '1.75rem', borderTop: '1px solid var(--border)' }}>
              {[
                { value: '20+', label: 'Events Organized' },
                { value: '2', label: 'Academic Papers' },
                { value: '100+', label: 'Fieldwork Reach' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--fg)', lineHeight: 1, letterSpacing: '-0.03em' }}>
                    {value}
                  </p>
                  <p className="mono" style={{ fontSize: '0.725rem', color: 'var(--fg-muted)', marginTop: '0.35rem' }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Contact Form in Double-Bezel */}
          <div className="bezel-card">
            <div className="bezel-core">
              {submitted ? (
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
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
