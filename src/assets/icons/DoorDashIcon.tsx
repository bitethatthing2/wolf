import * as React from 'react';
export default function DoorDashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" {...props}>
      <rect width="32" height="32" rx="16" fill="white" stroke="black" strokeWidth="2"/>
      <path d="M10 17C10 15.8954 10.8954 15 12 15H22C23.1046 15 24 15.8954 24 17C24 18.1046 23.1046 19 22 19H14L12 21H22" stroke="black" strokeWidth="2" fill="none"/>
    </svg>
  );
}
