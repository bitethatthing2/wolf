import * as React from 'react';
export default function LocationIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" {...props}>
      <rect width="32" height="32" rx="16" fill="white" stroke="black" strokeWidth="2"/>
      <path d="M16 22C18.2091 22 20 20.2091 20 18C20 15.7909 18.2091 14 16 14C13.7909 14 12 15.7909 12 18C12 20.2091 13.7909 22 16 22Z" stroke="black" strokeWidth="2"/>
      <path d="M16 10V14" stroke="black" strokeWidth="2"/>
    </svg>
  );
}
