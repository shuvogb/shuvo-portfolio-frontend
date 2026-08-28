'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Building, 
  Layers, 
  CheckCircle2, 
  Share2, 
  Check, 
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { SectionBadge } from '@/components/ui/SectionBadge';
import { getAchievementDetails, type AchievementDetails } from '@/lib/achievementsData';
import type { Achievement } from '@/types/portfolio';
import api from '@/lib/api';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AchievementDetailPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get('/portfolio');
        const list: Achievement[] = res.data?.data?.achievements || [];
        setAchievements(list);

        const foundIndex = list.findIndex((a) => a._id === resolvedParams.id);
        if (foundIndex !== -1) {
          setCurrentIndex(foundIndex);
        } else {
          // If id is a numeric index fallback
          const numIdx = parseInt(resolvedParams.id, 10);
          if (!isNaN(numIdx) && numIdx >= 0 && numIdx < list.length) {
            setCurrentIndex(numIdx);
          }
        }
      } catch (err) {
        console.error('Failed to load achievement details:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [resolvedParams.id]);

  const currentAch = achievements[currentIndex];
  const details: AchievementDetails = currentAch 
    ? getAchievementDetails(currentAch.description, currentIndex)
    : getAchievementDetails('', 0);

  const IconComponent = details.icon;

  const handleNext = () => {
    if (achievements.length === 0) return;
    const nextIdx = (currentIndex + 1) % achievements.length;
    router.push(`/achievements/${achievements[nextIdx]._id}`);
  };

  const handlePrev = () => {
    if (achievements.length === 0) return;
    const prevIdx = (currentIndex - 1 + achievements.length) % achievements.length;
    router.push(`/achievements/${achievements[prevIdx]._id}`);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)]">
      
      {/* Top Breadcrumbs & Action Bar */}
      <header className="border-b border-[var(--border)] bg-[var(--bg-card)]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="container" style={{ padding: '0.65rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap', gap: '0.5rem' }}>
          
          {/* Left Navigation & Counter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: 0 }}>
            <Link
              href="/#achievements"
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.8rem',
                padding: '0.35rem 0.65rem',
                height: '34px',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              <ChevronLeft size={15} strokeWidth={2} />
              <span>Back<span className="hidden sm:inline"> to Portfolio</span></span>
            </Link>

            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--fg-muted)',
                padding: '0.25rem 0.6rem',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                display: 'inline-flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              <span className="hidden md:inline">Milestone </span>
              <span>{currentIndex + 1} of {achievements.length || 1}</span>
            </span>
          </div>

          {/* Right Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexShrink: 0 }}>
            <button
              onClick={handleShare}
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.785rem',
                padding: '0.35rem 0.6rem',
                height: '34px',
              }}
              title="Copy share link"
            >
              {copied ? <Check size={13} className="text-emerald-500" /> : <Share2 size={13} />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
            </button>

            <button
              onClick={handlePrev}
              disabled={achievements.length <= 1}
              aria-label="Previous Milestone"
              className="btn btn-secondary"
              style={{ padding: '0.35rem', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ChevronLeft size={15} strokeWidth={2} />
            </button>

            <button
              onClick={handleNext}
              disabled={achievements.length <= 1}
              aria-label="Next Milestone"
              className="btn btn-secondary"
              style={{ padding: '0.35rem', width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ChevronRight size={15} strokeWidth={2} />
            </button>
          </div>

        </div>
      </header>

      {/* Main Content */}
      <main className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
        
        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="skeleton" style={{ height: '380px', borderRadius: 'var(--radius-outer)' }} />
            <div className="skeleton" style={{ height: '40px', width: '60%' }} />
            <div className="skeleton" style={{ height: '120px' }} />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* Header Title Section */}
            <div>
              <div style={{ marginBottom: '0.85rem' }}>
                <SectionBadge icon={<IconComponent size={13} strokeWidth={1.75} />}>
                  {details.category}
                </SectionBadge>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                  fontWeight: 800,
                  color: 'var(--fg)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.25,
                  marginBottom: '0.75rem',
                }}
              >
                {details.title}
              </h1>

              <p style={{ fontSize: '1.1rem', color: 'var(--accent)', fontWeight: 600 }}>
                {details.highlight}
              </p>
            </div>

            {/* Photo Carousel Showcase */}
            <div className="bezel-card">
              <div className="bezel-core" style={{ padding: '0.85rem' }}>
                
                <div
                  style={{
                    position: 'relative',
                    height: 'clamp(320px, 50vw, 480px)',
                    width: '100%',
                    borderRadius: 'var(--radius-inner)',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-elevated)',
                  }}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={photoIndex}
                      src={details.images[photoIndex]}
                      alt={details.title}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </AnimatePresence>

                  {/* Gradient Overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%)',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Photo Index Badge */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '16px',
                      left: '16px',
                      padding: '0.35rem 0.75rem',
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: 'rgba(15, 23, 42, 0.75)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#fff',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                    }}
                  >
                    Photo {photoIndex + 1} of {details.images.length}
                  </div>

                  {/* Carousel Controls */}
                  {details.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setPhotoIndex((prev) => (prev - 1 + details.images.length) % details.images.length)}
                        aria-label="Previous photo"
                        style={{
                          position: 'absolute',
                          left: '16px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(15, 23, 42, 0.75)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <ChevronLeft size={20} />
                      </button>

                      <button
                        onClick={() => setPhotoIndex((prev) => (prev + 1) % details.images.length)}
                        aria-label="Next photo"
                        style={{
                          position: 'absolute',
                          right: '16px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(15, 23, 42, 0.75)',
                          backdropFilter: 'blur(8px)',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <ChevronRight size={20} />
                      </button>

                      {/* Dots */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '16px',
                          right: '16px',
                          display: 'flex',
                          gap: '6px',
                        }}
                      >
                        {details.images.map((_, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => setPhotoIndex(pIdx)}
                            style={{
                              width: photoIndex === pIdx ? '24px' : '8px',
                              height: '8px',
                              borderRadius: '4px',
                              backgroundColor: photoIndex === pIdx ? 'var(--accent)' : 'rgba(255, 255, 255, 0.5)',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.25s ease',
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )}

                </div>

              </div>
            </div>

            {/* Metadata Badges Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  padding: '1.15rem',
                  borderRadius: 'var(--radius-inner)',
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--accent-subtle)',
                    color: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <MapPin size={18} strokeWidth={1.8} />
                </div>
                <div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Location</div>
                  <div style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--fg)' }}>{details.location}</div>
                </div>
              </div>

              <div
                style={{
                  padding: '1.15rem',
                  borderRadius: 'var(--radius-inner)',
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--accent-subtle)',
                    color: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Building size={18} strokeWidth={1.8} />
                </div>
                <div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Organization / Partner</div>
                  <div style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--fg)' }}>{details.organization}</div>
                </div>
              </div>

              <div
                style={{
                  padding: '1.15rem',
                  borderRadius: 'var(--radius-inner)',
                  backgroundColor: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--accent-subtle)',
                    color: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Layers size={18} strokeWidth={1.8} />
                </div>
                <div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--fg-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>Scope & Execution</div>
                  <div style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--fg)' }}>{details.scope}</div>
                </div>
              </div>
            </div>

            {/* Narrative & Impact Breakdown */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '2rem',
              }}
            >
              {/* Field Narrative */}
              <div className="bezel-card">
                <div className="bezel-core" style={{ padding: '1.75rem' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--fg)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Compass size={16} className="text-[var(--accent)]" />
                    <span>Field Overview & Context</span>
                  </h2>
                  <p style={{ fontSize: '0.95rem', lineHeight: 1.75, color: 'var(--fg-muted)', margin: 0 }}>
                    {details.fullStory}
                  </p>
                </div>
              </div>

              {/* Key Outcomes Checklist */}
              <div className="bezel-card">
                <div className="bezel-core" style={{ padding: '1.75rem' }}>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--fg)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle2 size={16} className="text-[var(--accent)]" />
                    <span>Key Measurable Outcomes</span>
                  </h2>

                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {details.keyTakeaways.map((takeaway, tIdx) => (
                      <li
                        key={tIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          fontSize: '0.9rem',
                          color: 'var(--fg-muted)',
                          lineHeight: 1.6,
                        }}
                      >
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '20px',
                            height: '20px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--accent-subtle)',
                            color: 'var(--accent)',
                            marginTop: '2px',
                            flexShrink: 0,
                          }}
                        >
                          <Check size={12} strokeWidth={2.5} />
                        </span>
                        <span style={{ flex: 1 }}>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Bottom Milestone Navigation Bar */}
            <div
              style={{
                paddingTop: '2rem',
                borderTop: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                gap: '1rem',
              }}
            >
              <button
                onClick={handlePrev}
                className="btn btn-secondary"
                aria-label="Previous Milestone"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
              >
                <ChevronLeft size={16} strokeWidth={2} />
                <span>Previous</span>
              </button>

              <button
                onClick={handleNext}
                className="btn btn-secondary"
                aria-label="Next Milestone"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
              >
                <span>Next</span>
                <ChevronRight size={16} strokeWidth={2} />
              </button>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
