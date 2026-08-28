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
};

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = false,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
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

  return (
    <div className="w-full px-2 py-4 font-sans antialiased md:px-6">
      <div className="relative grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.3fr] lg:gap-14 items-center">
        
        {/* 3D Rotating Stack on Left */}
        <div>
          <div className="relative h-72 sm:h-80 md:h-92 w-full">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src + index}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY(),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index)
                      ? 40
                      : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -60, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: randomRotateY(),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  <div className="h-full w-full rounded-2xl overflow-hidden border border-[var(--border)] shadow-xl bg-[var(--bg-elevated)]">
                    <img
                      src={testimonial.src}
                      alt={testimonial.name}
                      width={600}
                      height={600}
                      draggable={false}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                </motion.div>
              ))}
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
