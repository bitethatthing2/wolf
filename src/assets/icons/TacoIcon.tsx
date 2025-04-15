import * as React from 'react';
export default function TacoIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" {...props}>
      <rect width="32" height="32" rx="16" fill="white" stroke="black" strokeWidth="2"/>
      <ellipse cx="16" cy="20" rx="8" ry="4" stroke="black" strokeWidth="2" fill="none"/>
      <path d="M8 20C8 14 24 14 24 20" stroke="black" strokeWidth="2" fill="none"/>
    </svg>
  );
}
