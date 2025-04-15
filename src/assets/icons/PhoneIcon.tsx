import * as React from 'react';
export default function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" {...props}>
      <rect width="32" height="32" rx="16" fill="white" stroke="black" strokeWidth="2"/>
      <path d="M20.5 21.5C19.1193 22.8807 16.8807 22.8807 15.5 21.5L10.5 16.5C9.11929 15.1193 9.11929 12.8807 10.5 11.5L12 10C13.3807 8.61929 15.6193 8.61929 17 10L22 15C23.3807 16.3807 23.3807 18.6193 22 20L20.5 21.5Z" stroke="black" strokeWidth="2"/>
    </svg>
  );
}
