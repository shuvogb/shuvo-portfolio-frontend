'use client';

import type { Profile } from '@/types/portfolio';

interface FooterSectionProps {
  profile?: Profile;
}

export function FooterSection({ profile }: FooterSectionProps) {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      style={{
        padding: '2.5rem 0',
        borderTop: '1px solid var(--border)',
        backgroundColor: 'var(--background)',
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
          © {year} {profile?.name || 'Shuvo Molla'}. All rights reserved.
        </p>
        <p className="mono" style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
          Sociology & Social Work Portfolio
        </p>
      </div>
    </footer>
  );
}
