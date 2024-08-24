'use client'

import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';

export function PerformanceMonitor() {
  useReportWebVitals(metric => {
    console.log(metric);
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      window.addEventListener('load', () => {
        const paint = performance.getEntriesByType('paint');
        const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
        if (fcp) {
          console.log(`First Contentful Paint: ${fcp.startTime}`);
        }
      });
    }
  }, []);

  return null;
}