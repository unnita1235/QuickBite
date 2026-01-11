'use client';

import { useEffect } from 'react';

export function EnvValidator() {
  useEffect(() => {
    if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_API_URL) {
      console.warn('NEXT_PUBLIC_API_URL is not set. API calls will fail.');
    }
  }, []);

  return null;
}
