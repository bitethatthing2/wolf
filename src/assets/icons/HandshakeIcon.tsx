import * as React from 'react';
export default function HandshakeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" {...props}>
      <rect width="32" height="32" rx="16" fill="white" stroke="black" strokeWidth="2"/>
      <path d="M10 18L16 22L22 18M12 16L16 18L20 16M12 16L10 14M20 16L22 14" stroke="black" strokeWidth="2" fill="none"/>
    </svg>
  );
}
