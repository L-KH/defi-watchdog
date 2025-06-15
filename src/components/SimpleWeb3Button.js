// SimpleWeb3Button is deprecated - replaced by UnifiedWeb3Button
// This component is kept for backward compatibility only

import UnifiedWeb3Button from './UnifiedWeb3Button';

export default function SimpleWeb3Button() {
  // Just use the new unified component with minimal styling
  return <UnifiedWeb3Button showBalance={false} showChain={false} variant="minimal" />;
}