// src/pages/audit.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AuditRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    const { address, network } = router.query;
    const query = {};
    
    if (address) query.address = address;
    if (network) query.network = network;
    
    router.replace({
      pathname: '/audit-new',
      query
    });
  }, [router]);
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <h2>Redirecting to improved audit tool...</h2>
      <p>Please wait while we redirect you to our enhanced contract audit tool.</p>
      <div style={{ 
        marginTop: '20px', 
        width: '50px', 
        height: '50px', 
        border: '5px solid #f3f3f3',
        borderTop: '5px solid #3498db',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
    </div>
  );
}
