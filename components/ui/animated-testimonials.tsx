"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
  year?: number | string;
  imageHeight?: number;
  imageFit?: string;
};

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
  cardHeight = 340,
  imageFit = 'cover',
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
  cardHeight?: number;
  imageFit?: string;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 19) - 9;
  };

  if (!testimonials || testimonials.length === 0) return null;

  const currentItem = testimonials[active];
  const activeFit = currentItem?.imageFit || imageFit || 'contain';

  return (
    <div className="w-full px-2 py-3 font-sans antialiased md:px-4">
      <div className="relative grid grid-cols-1 gap-8 md:grid-cols-[1.25fr_1fr] lg:gap-12 items-center">
        
        {/* 3D Rotating Stack on Left with Proportional Certificate Frame */}
        <div className="w-full flex items-center justify-center">
          <div
            className="certificate-stage-wrapper relative w-full"
            style={{
              aspectRatio: '1.38 / 1',
              maxHeight: '390px',
              minHeight: '210px',
            }}
          >
            <AnimatePresence mode="popLayout">
              {testimonials.map((testimonial, index) => {
                const itemFit = testimonial.imageFit || activeFit;
                const offset = (index - active + testimonials.length) % testimonials.length;
                const isCurrent = offset === 0;
                const isNext = offset === 1;
                const isSecondNext = offset === 2;

                // Subtle, agency-grade stacked rotation physics
                let rotate = 0;
                let scale = 0.9;
                let opacity = 0;
                let zIndex = 10;
                let yOffset = 0;

                if (isCurrent) {
                  rotate = 0;
                  scale = 1;
                  opacity = 1;
                  zIndex = 40;
                  yOffset = 0;
                } else if (isNext) {
                  rotate = 2.5;
                  scale = 0.96;
                  opacity = 0.75;
                  zIndex = 30;
                  yOffset = 4;
                } else if (isSecondNext) {
                  rotate = -2;
                  scale = 0.92;
                  opacity = 0.45;
                  zIndex = 20;
                  yOffset = 8;
                }

                return (
                  <motion.div
                    key={testimonial.src + index}
                    initial={{
                      opacity: 0,
                      scale: 0.92,
                      rotate: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity,
                      scale,
                      rotate,
                      zIndex,
                      y: isCurrent ? [0, -18, 0] : yOffset,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.92,
                      rotate: -4,
                      transition: { duration: 0.25 },
                    }}
                    transition={{
                      duration: 0.38,
                      ease: [0.32, 0.72, 0, 1],
                    }}
                    className="absolute inset-0 origin-center"
                    style={{ pointerEvents: isCurrent ? 'auto' : 'none' }}
                  >
                    <div className="h-full w-full rounded-2xl overflow-hidden border border-[var(--border)] shadow-xl bg-[var(--bg-elevated)] p-2 sm:p-2.5 relative flex items-center justify-center">
                      <div className="w-full h-full rounded-xl overflow-hidden relative border border-[var(--border)] bg-[var(--bg-surface)] flex items-center justify-center p-1 sm:p-1.5">
                        {itemFit === 'contain' && (
                          <img
                            src={testimonial.src}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-15 scale-110 pointer-events-none"
                          />
                        )}
                        <img
                          src={testimonial.src}
                          alt={testimonial.name}
                          width={900}
                          height={650}
                          draggable={false}
                          className={`h-full w-full relative z-10 transition-all duration-300 rounded-[8px] ${
                            itemFit === 'cover'
                              ? 'object-cover object-center'
                              : 'object-contain object-center'
                          }`}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Text Details with Controlled Header Hierarchy on Right */}
        <div className="flex flex-col justify-between py-2">
          <motion.div
            key={active}
            initial={{
              y: 16,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -16,
              opacity: 0,
            }}
            transition={{
              duration: 0.22,
              ease: "easeInOut",
            }}
          >
            {testimonials[active].year && (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  padding: '0.2rem 0.65rem',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--accent-subtle)',
                  border: '1px solid var(--accent-border)',
                  marginBottom: '0.75rem',
                }}
              >
                {testimonials[active].year}
              </span>
            )}

            {/* Smaller, refined header font */}
            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: 700,
                color: 'var(--fg)',
                letterSpacing: '-0.015em',
                lineHeight: 1.4,
                marginBottom: '0.4rem',
              }}
            >
              {testimonials[active].name}
            </h3>

            <p
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--accent)',
                marginBottom: '1rem',
              }}
            >
              {testimonials[active].designation}
            </p>

            <motion.p
              style={{
                fontSize: '0.925rem',
                color: 'var(--fg-muted)',
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {testimonials[active].quote.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{
                    filter: "blur(8px)",
                    opacity: 0,
                    y: 4,
                  }}
                  animate={{
                    filter: "blur(0px)",
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.015 * index,
                  }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>

          <div className="flex gap-3 pt-8">
            <button
              onClick={handlePrev}
              aria-label="Previous Item"
              className="group/button flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--fg)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-300 shadow-sm"
            >
              <ArrowLeft className="h-4.5 w-4.5 transition-transform duration-300 group-hover/button:-translate-x-0.5" strokeWidth={2} />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next Item"
              className="group/button flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--fg)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-300 shadow-sm"
            >
              <ArrowRight className="h-4.5 w-4.5 transition-transform duration-300 group-hover/button:translate-x-0.5" strokeWidth={2} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
