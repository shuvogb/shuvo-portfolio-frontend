'use client';

import { BookCheck } from 'lucide-react';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { AnimatedTestimonials, type Testimonial } from '@/components/ui/animated-testimonials';
import type { Workshop, Profile } from '@/types/portfolio';

interface WorkshopsSectionProps {
  workshops?: Workshop[];
  profile?: Profile;
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

export function WorkshopsSection({ workshops = [], profile, isLoading }: WorkshopsSectionProps) {
  const wsConfig = profile?.workshopsSection;
  const sectionBadge = wsConfig?.badge || 'Professional Development';
  const sectionTitle = wsConfig?.title || 'Workshops & Certifications';
  const sectionDesc =
    wsConfig?.description ||
    'Specialized training programs in quantitative social methodology, field research ethics, climate negotiations, and leadership.';

  // Format workshops into testimonials format with 3D stack cards
  const formattedWorkshops: Testimonial[] = workshops.map((ws, idx) => {
    let img = ws.imageUrl || DEFAULT_IMAGES[idx % DEFAULT_IMAGES.length];
    const lowerTitle = (ws.title || '').toLowerCase();

    if (!ws.imageUrl) {
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
    }

    return {
      name: ws.title,
      designation: `Organized by ${ws.organizer}`,
      quote: ws.description || `Specialized institutional training program with ${ws.organizer} focusing on hands-on practical methodology, capacity development, and impactful field execution.`,
      src: img,
      year: ws.year,
      imageHeight: ws.imageHeight || wsConfig?.certificateHeight || 380,
      imageFit: ws.imageFit || wsConfig?.certificateFit || 'contain',
    };
  });

  return (
    <section id="workshops" className="section" aria-label="Workshops and Professional Training">
      <div className="container">

        {/* Header */}
        <div className="section-header">
          <SectionBadge icon={<BookCheck size={13} strokeWidth={1.75} />}>
            {sectionBadge}
          </SectionBadge>
          <h2 className="section-title">{sectionTitle}</h2>
          <p className="section-description">
            {sectionDesc}
          </p>
        </div>

        {/* 3D Animated Showcase with Detailed Showcase Skeleton */}
        {isLoading ? (
          <div className="bezel-card">
            <div className="bezel-core" style={{ padding: '2rem 1.5rem' }}>
              <div className="relative grid grid-cols-1 gap-8 md:grid-cols-[1.25fr_1fr] lg:gap-12 items-center">

                {/* Left Framed Certificate Skeleton */}
                <div className="skeleton" style={{ width: '100%', aspectRatio: '1.38 / 1', borderRadius: '16px', padding: '0.85rem' }}>
                  <div className="skeleton" style={{ width: '100%', height: '100%', borderRadius: '12px' }} />
                </div>

                {/* Right Text Details Skeleton */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', padding: '0.5rem 0' }}>
                  <div className="skeleton-pill" style={{ height: '24px', width: '65px' }} />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <div className="skeleton" style={{ height: '22px', width: '90%', borderRadius: '6px' }} />
                    <div className="skeleton" style={{ height: '22px', width: '65%', borderRadius: '6px' }} />
                  </div>

                  <div className="skeleton" style={{ height: '16px', width: '220px', borderRadius: '4px' }} />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.5rem' }}>
                    <div className="skeleton" style={{ height: '14px', width: '98%', borderRadius: '4px' }} />
                    <div className="skeleton" style={{ height: '14px', width: '90%', borderRadius: '4px' }} />
                    <div className="skeleton" style={{ height: '14px', width: '65%', borderRadius: '4px' }} />
                  </div>

                  {/* Navigation Arrows Skeleton */}
                  <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '1.25rem' }}>
                    <div className="skeleton-circle" style={{ width: '40px', height: '40px' }} />
                    <div className="skeleton-circle" style={{ width: '40px', height: '40px' }} />
                  </div>
                </div>

              </div>
            </div>
          </div>
        ) : (
          <div className="bezel-card">
            <div className="bezel-core" style={{ padding: '2rem 1.5rem' }}>
              <AnimatedTestimonials
                testimonials={formattedWorkshops}
                autoplay={false}
                cardHeight={wsConfig?.certificateHeight || 380}
                imageFit={wsConfig?.certificateFit || 'contain'}
              />
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
