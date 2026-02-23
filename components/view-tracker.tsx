'use client';

import { useEffect, useRef } from 'react';

export default function ViewTracker() {
  const tracked = useRef(false);

  useEffect(() => {
    // Only track once per page load/mount
    if (!tracked.current) {
      tracked.current = true;
      fetch('/api/track-view', { method: 'POST' }).catch((err) => {
        console.error('Failed to log page view:', err);
      });
    }
  }, []);

  return null;
}
