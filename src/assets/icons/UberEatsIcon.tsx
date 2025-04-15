import * as React from 'react';
export default function UberEatsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" {...props}>
      <rect width="32" height="32" rx="16" fill="white" stroke="black" strokeWidth="2"/>
      <text x="16" y="21" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontSize="10" fill="black">UE</text>
    </svg>
  );
}
