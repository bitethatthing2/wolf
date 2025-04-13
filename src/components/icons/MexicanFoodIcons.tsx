import React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

export const MexicanFoodIcons = {
  taco: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 17c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2H3v2z" />
      <path d="M19 10c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v1c0 1.1.9 2 2 2h14z" />
      <path d="M3 10v5h18v-5" />
      <path d="M7 7c0-1.7 1.3-3 3-3h4c1.7 0 3 1.3 3 3" />
      <path d="M7 15c.3-1.1 1.5-2 3-2s2.7.9 3 2" />
      <path d="M14 15c.3-1.1 1.5-2 3-2" />
      <path d="M10 15c-.3-1.1-1.5-2-3-2" />
    </svg>
  ),
  burrito: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M18 12c0-5.5-2.7-10-6-10S6 6.5 6 12s2.7 10 6 10 6-4.5 6-10z" />
      <path d="M18 12H6" />
      <path d="M12 2v20" />
      <path d="M15 5c-.5 1-1.5 2-3 2s-2.5-1-3-2" />
      <path d="M15 19c-.5-1-1.5-2-3-2s-2.5 1-3 2" />
      <path d="M9 9c.5.5 1.5 1 3 1s2.5-.5 3-1" />
      <path d="M9 15c.5-.5 1.5-1 3-1s2.5.5 3 1" />
    </svg>
  ),
  sauce: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 6h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" />
      <path d="M14 6c0-1.1-.9-2-2-2s-2 .9-2 2" />
      <path d="M12 12v4" />
      <path d="M8 12v4" />
      <path d="M16 12v4" />
      <path d="M3 10h18" />
    </svg>
  ),
  drink: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M8 3h8l3 6-7 12-7-12 3-6z" />
      <path d="M4.5 9h15" />
      <path d="M16 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
      <path d="M6 7L4 3" />
      <path d="M18 7l2-2" />
      <path d="M12 9v7" />
    </svg>
  ),
  meat: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14.5 5.5c0-3.6-2.9-3.5-2.9-3.5-2.7 0-3.1 1.5-3.1 1.5-3.9 0-4.5 4-4.5 4C2.5 7.5 2 9 2 11s1.5 3 3 3c0 1.5 1.5 2 1.5 2 2 1 3.5 0 3.5 0 2.3 0 4.5-3 4.5-3 2.1-1.5 2.5-3 2.5-3 2-1 3-2.5 3-4.5s-2.5-3-2.5-3c-1.5 0-3 2.5-3 2.5z" />
      <path d="M5 7.5c1-1 2-1 2-1" />
      <path d="M9 5.5c1-1 2.5-1.5 2.5-1.5" />
      <path d="M8.5 11.5c2 0 3.5-1.5 3.5-1.5" />
      <path d="M14 7c1-1 2-1 2-1" />
    </svg>
  ),
  wings: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 5c1-1 2-1 3-1 3 0 4 2 4 3 0 1.5-1 2.5-2 3-1.5.5-3 0-3 0" />
      <path d="M12 8c1-1 2-1 3-1 3 0 4 2 4 3 0 1.5-1 2.5-2 3-1.5.5-3 0-3 0" />
      <path d="M9 11c1-1 2-1 3-1 3 0 4 2 4 3 0 1.5-1 2.5-2 3-1.5.5-3 0-3 0" />
      <path d="M6 14c1-1 2-1 3-1 3 0 4 2 4 3 0 1.5-1 2.5-2 3-1.5.5-3 0-3 0" />
      <path d="M12 20c-1.5.5-3 0-3 0-1.5-.5-2-1.5-2-3 0-.5 0-1 .5-1.5" />
      <path d="M3 17c1-1 2-1 3-1" />
    </svg>
  ),
  starters: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M19 9H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2z" />
      <path d="M12 9v6" />
      <path d="M8 9v6" />
      <path d="M16 9v6" />
      <path d="M5 6c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v3H5V6z" />
      <path d="M5 15v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3H5z" />
    </svg>
  ),
  dessert: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2a7 7 0 0 0-7 7c0 2 1 3 2 4l1.5 2 1 3.5.5 1.5h4l.5-1.5 1-3.5 1.5-2c1-1 2-2 2-4a7 7 0 0 0-7-7z" />
      <path d="M7 9a5 5 0 0 1 5-5" />
      <path d="M15 9a3 3 0 0 0-3-3" />
      <path d="M10 13v-2.5" />
      <path d="M12 13v-1.5" />
      <path d="M14 13v-2.5" />
      <path d="M5 22h14" />
      <path d="M5 22v-2c0-1.5 1-2 2-2h10c1 0 2 .5 2 2v2" />
    </svg>
  ),
  margarita: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M7 3h10l2 4-6 14-6-14 2-4z" />
      <path d="M5 7h14" />
      <path d="M6 5.5c0-1 .8-2 2-2" />
      <path d="M18 5.5c0-1-.8-2-2-2" />
      <path d="M14.5 11a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z" />
      <path d="M9.5 10c.5 0 1-1 1-2" />
      <path d="M8.5 9.5c-1 .3-1.5 0-1.5-.5" />
    </svg>
  ),
  beer: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M17 6.5V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6.5" />
      <path d="M19 4.5l-2 2v1h2a2 2 0 1 0 0-4H7a2 2 0 1 0 0 4h2v-1l-2-2" />
      <path d="M6 9.5h10" />
      <path d="M7 12.5h8" />
      <path d="M8 15.5h6" />
    </svg>
  ),
};

export default MexicanFoodIcons; 