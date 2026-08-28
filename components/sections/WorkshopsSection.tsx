'use client';

import { BookCheck } from 'lucide-react';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { AnimatedTestimonials, type Testimonial } from '@/components/ui/animated-testimonials';
import type { Workshop } from '@/types/portfolio';

interface WorkshopsSectionProps {
  workshops?: Workshop[];
  isLoading: boolean;
}

const WORKSHOP_IMAGES: Record<string, string> = {
  climate: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop',
  marketing: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
  pollution: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1200&auto=format&fit=crop',
  photo: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop',
  theatre: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1200&auto=format&fit=crop',
};

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=1200&auto=format&fit=crop',
];

export function WorkshopsSection({ workshops = [], isLoading }: WorkshopsSectionProps) {
  // Format workshops into testimonials format with 3D stack cards
  const formattedWorkshops: Testimonial[] = workshops.map((ws, idx) => {
    let img = DEFAULT_IMAGES[idx % DEFAULT_IMAGES.length];
    const lowerTitle = (ws.title || '').toLowerCase();
    
    if (lowerTitle.includes('climate') || lowerTitle.includes('ndc') || lowerTitle.includes('net zero')) {
      img = WORKSHOP_IMAGES.climate;
    } else if (lowerTitle.includes('marketing') || lowerTitle.includes('digital')) {
      img = WORKSHOP_IMAGES.marketing;
    } else if (lowerTitle.includes('pollution') || lowerTitle.includes('lead') || lowerTitle.includes('youth leaders')) {
      img = WORKSHOP_IMAGES.pollution;
    } else if (lowerTitle.includes('photo') || lowerTitle.includes('capture')) {
      img = WORKSHOP_IMAGES.photo;
    } else if (lowerTitle.includes('theatre') || lowerTitle.includes('acting') || lowerTitle.includes('drama')) {
      img = WORKSHOP_IMAGES.theatre;
    }

    return {
      name: ws.title,
      designation: `Organized by ${ws.organizer}`,
      quote: ws.description || `Specialized institutional training program with ${ws.organizer} focusing on hands-on practical methodology, capacity development, and impactful field execution.`,
      src: img,
      year: ws.year,
    };
  });

  return (
    <section id="workshops" className="section" aria-label="Workshops and Professional Training">
      <div className="container">
        
        {/* Header */}
        <div className="section-header">
          <SectionBadge icon={<BookCheck size={13} strokeWidth={1.75} />}>
            Professional Development
          </SectionBadge>
          <h2 className="section-title">Workshops & Certifications</h2>
          <p className="section-description">
            Specialized training programs in quantitative social methodology, field research ethics, climate negotiations, and leadership.
          </p>
        </div>

        {/* 3D Animated Showcase */}
        {isLoading ? (
          <div className="bezel-card">
            <div className="bezel-core" style={{ padding: '3rem' }}>
              <div className="skeleton" style={{ height: '340px', borderRadius: 'var(--radius-inner)' }} />
            </div>
          </div>
        ) : (
          <div className="bezel-card">
            <div className="bezel-core" style={{ padding: '2rem 1.5rem' }}>
              <AnimatedTestimonials testimonials={formattedWorkshops} autoplay={false} />
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
