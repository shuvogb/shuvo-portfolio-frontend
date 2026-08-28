'use client';

import { ArrowUp } from 'lucide-react';
import type { Profile } from '@/types/portfolio';

interface FooterSectionProps {
  profile?: Profile;
}

export function FooterSection({ profile }: FooterSectionProps) {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      role="contentinfo"
      className="grid-background"
      style={{
        padding: '3.5rem 0',
        borderTop: '1px solid var(--border)',
        backgroundColor: 'var(--background)',
        position: 'relative',
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.35rem' }}>
            <span>{profile?.name || 'Shuvo Molla'}</span>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
            Sociology & Social Work Portfolio · © {year} All rights reserved.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={scrollToTop}
            className="btn btn-secondary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
            aria-label="Scroll back to top of page"
          >
            Back to Top <ArrowUp size={14} />
          </button>
        </div>

      </div>
    </footer>
  );
}
