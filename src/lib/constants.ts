// src/lib/constants.ts

// Example constant - add actual constants as needed
export const SITE_NAME = "Side Hustle Bar";

export const LOCATIONS = [
    { id: 'pdx', name: 'Portland', mapQuery: 'Side Hustle Bar Portland OR' },
    { id: 'slm', name: 'Salem', mapQuery: 'Side Hustle Bar Salem OR' },
] as const; // Use "as const" for stricter typing if values are fixed

// Add other constants like API endpoints (if not in env), default values etc.