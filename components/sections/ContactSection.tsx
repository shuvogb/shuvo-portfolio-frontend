'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, CheckCircle2, Loader2 } from 'lucide-react';
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

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await api.post('/contact', data);
      setSubmitted(true);
      reset();
      toast.success("Message sent! I'll get back to you soon.");
    } catch {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <section id="contact" className="section" aria-label="Contact">
      <div className="container">
        
        <div className="section-header">
          <span className="section-eyebrow">Connect</span>
          <h2 className="section-title">Get in Touch</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
          
          {/* Left Text & Impact Numbers */}
          <div>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--foreground)', marginBottom: '1rem', fontWeight: 500 }}>
              Interested in collaborating on social research, community development, or climate initiatives?
            </p>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: 'var(--muted-foreground)', marginBottom: '2.5rem' }}>
              Feel free to send a message. I am actively open to research partnerships, project coordination, and academic opportunities.
            </p>

            {/* Impact stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              {[
                { value: '20+', label: 'Events Organized' },
                { value: '2', label: 'Publications' },
                { value: '100+', label: 'Daily Guests' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <p style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1, letterSpacing: '-0.03em' }}>
                    {value}
                  </p>
                  <p className="mono" style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginTop: '0.35rem' }}>
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Form */}
          <div>
            {submitted ? (
              <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                <CheckCircle2 size={40} style={{ color: 'var(--primary)', margin: '0 auto 1rem' }} />
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>
                  Message Received
                </h3>
                <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Thank you for reaching out. I'll get back to you shortly.
                </p>
                <button onClick={() => setSubmitted(false)} className="btn btn-secondary">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="card" noValidate aria-label="Contact form">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label htmlFor="contact-name" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      autoComplete="name"
                      {...register('name')}
                      className="input"
                      placeholder="Your name"
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <p role="alert" style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-email" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Email *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      {...register('email')}
                      className="input"
                      placeholder="your.email@example.com"
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                      <p role="alert" style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-message" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      {...register('message')}
                      className="input"
                      placeholder="Describe your inquiry, project, or collaboration..."
                      style={{ resize: 'vertical', minHeight: '110px' }}
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
                    className="btn btn-primary"
                    style={{ width: '100%', opacity: isSubmitting ? 0.75 : 1 }}
                    aria-label={isSubmitting ? 'Sending message...' : 'Send message'}
                  >
                    {isSubmitting ? (
                      <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Sending...</>
                    ) : (
                      <><Send size={15} /> Send Message</>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  );
}
