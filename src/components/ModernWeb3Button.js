// ModernWeb3Button is deprecated - replaced by UnifiedWeb3Button
// This component is kept for backward compatibility only

import { useEffect, useState } from 'react';
import UnifiedWeb3Button from './UnifiedWeb3Button';

export default function ModernWeb3Button() {
  const [isMounted, setIsMounted] = useState(false);
  
  // Handle SSR hydration properly
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Return nothing during SSR to avoid hydration mismatch
  if (!isMounted) {
    return null;
  }
  
  // Just use the new unified component
  return <UnifiedWeb3Button showBalance={false} showChain={true} size="default" />;
}