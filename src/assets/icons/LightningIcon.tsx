import * as React from 'react';
export default function LightningIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" {...props}>
      <rect width="32" height="32" rx="16" fill="white" stroke="black" strokeWidth="2"/>
      <path d="M18 4L10 18H16L14 28L22 14H16L18 4Z" stroke="black" strokeWidth="2" fill="none"/>
    </svg>
  );
}
