import React from 'react';

interface SectionBadgeProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function SectionBadge({ icon, children, className = '', style }: SectionBadgeProps) {
  return (
    <div
      className={`section-badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        padding: '0.35rem 0.9rem',
        borderRadius: 'var(--radius-pill)',
        backgroundColor: 'var(--accent-subtle)',
        border: '1px solid var(--accent-border)',
        fontSize: '0.785rem',
        fontWeight: 600,
        color: 'var(--accent)',
        lineHeight: 1.2,
        marginBottom: '0.85rem',
        ...style,
      }}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</span>}
      <span>{children}</span>
    </div>
  );
}
