'use client';

import { useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import api from '@/lib/api';

const SECTION_IDS = [
  'hero', 'about', 'skills', 'experience', 'research',
  'achievements', 'education', 'workshops', 'contact',
];

function getOrCreateAnonSessionId(): string {
  if (typeof window === 'undefined') return '';
  const key = 'sm_anon_session';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = uuidv4();
    sessionStorage.setItem(key, id);
  }
  return id;
}

export function AnalyticsTracker() {
  const tracked = useRef<Set<string>>(new Set());
  const pageTracked = useRef(false);

  useEffect(() => {
    if (pageTracked.current) return;
    pageTracked.current = true;

    const anonSessionId = getOrCreateAnonSessionId();

    // Track page view
    api.post('/analytics/track', {
      path: window.location.pathname,
      referrer: document.referrer,
      anonSessionId,
    }).catch(() => {/* silently fail */});

    // Track section views with IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !tracked.current.has(entry.target.id)) {
            tracked.current.add(entry.target.id);
            api.post('/analytics/track', {
              path: window.location.pathname,
              section: entry.target.id,
              anonSessionId,
            }).catch(() => {});
          }
        });
      },
      { threshold: 0.3 }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
