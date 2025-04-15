import * as React from 'react';
export default function EmailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" {...props}>
      <rect width="32" height="32" rx="16" fill="white" stroke="black" strokeWidth="2"/>
      <path d="M8 12V20C8 21.1046 8.89543 22 10 22H22C23.1046 22 24 21.1046 24 20V12C24 10.8954 23.1046 10 22 10H10C8.89543 10 8 10.8954 8 12Z" stroke="black" strokeWidth="2"/>
      <path d="M8 12L16 18L24 12" stroke="black" strokeWidth="2"/>
    </svg>
  );
}
