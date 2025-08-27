
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function UtilityCalculatorsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/utility-calculators/age-calculator');
  }, [router]);

  return null;
}
