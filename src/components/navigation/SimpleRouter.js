// Simple client-side routing solution for Next.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * Simple Router Component
 * Handles client-side navigation without complex dependencies
 */
export function useSimpleNavigation() {
  const router = useRouter();
  
  // Function to handle navigation
  const navigateTo = (path, options = {}) => {
    // Check if we're on the client side
    if (typeof window === 'undefined') return;
    
    // Use Next.js router push with shallow routing for better performance
    router.push(path, undefined, { 
      shallow: options.shallow || false,
      scroll: options.scroll !== false 
    });
  };
  
  // Function to handle navigation with query params
  const navigateWithQuery = (path, query = {}) => {
    const queryString = new URLSearchParams(query).toString();
    const fullPath = queryString ? `${path}?${queryString}` : path;
    navigateTo(fullPath);
  };
  
  // Function to reload current page
  const reload = () => {
    if (typeof window !== 'undefined') {
      router.reload();
    }
  };
  
  // Function to go back
  const goBack = () => {
    if (typeof window !== 'undefined') {
      router.back();
    }
  };
  
  return {
    navigateTo,
    navigateWithQuery,
    reload,
    goBack,
    currentPath: router.pathname,
    query: router.query,
    isReady: router.isReady
  };
}

/**
 * Navigation Link Component
 * Simple wrapper for navigation links
 */
export function NavLink({ href, children, className = '', activeClassName = '', ...props }) {
  const router = useRouter();
  const isActive = router.pathname === href;
  
  const handleClick = (e) => {
    e.preventDefault();
    router.push(href);
  };
  
  return (
    <a
      href={href}
      onClick={handleClick}
      className={`${className} ${isActive ? activeClassName : ''}`}
      {...props}
    >
      {children}
    </a>
  );
}

/**
 * Route Guard Component
 * Protects routes and handles redirects
 */
export function RouteGuard({ children, redirectTo = '/', condition = true }) {
  const router = useRouter();
  
  useEffect(() => {
    if (!condition && router.isReady) {
      router.push(redirectTo);
    }
  }, [condition, redirectTo, router]);
  
  if (!condition) {
    return <div>Loading...</div>;
  }
  
  return children;
}

/**
 * Navigation Helper Functions
 */
export const navigationHelpers = {
  // Navigate to audit page with contract address
  goToAudit: (address, network = 'linea') => {
    if (typeof window !== 'undefined') {
      window.location.href = `/audit?address=${address}&network=${network}`;
    }
  },
  
  // Navigate to audit pro page with contract address
  goToAuditPro: (address, network = 'linea') => {
    if (typeof window !== 'undefined') {
      window.location.href = `/audit-pro?address=${address}&network=${network}`;
    }
  },
  
  // Navigate to report page
  goToReport: (reportId) => {
    if (typeof window !== 'undefined') {
      window.location.href = `/report?id=${reportId}`;
    }
  },
  
  // Navigate to home
  goHome: () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }
};
