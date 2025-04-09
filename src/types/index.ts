// src/types/index.ts

// Define reusable TypeScript types and interfaces here.

export type MenuIconCategory = 
  | 'smallbites' 
  | 'main' 
  | 'birria' 
  | 'seafood' 
  | 'wings' 
  | 'breakfast' 
  | 'sauces'
  | 'drinks'
  | 'martinis'
  | 'boards'
  | 'flights'
  | 'towers';

export type MenuIconType = 'category' | 'food' | 'drink';

export interface MenuIcon {
  name: string;
  type: MenuIconType;
  path: string;
}

export interface MenuItem {
  name: string;
  description?: string;
  price?: string;
  options?: string[];
  note?: string;
  image?: string;
  icon?: MenuIcon;
  popular?: boolean;
  spicy?: boolean;
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
}

export interface MenuSubSection {
  name?: string; // Optional subsection name like "Traditional or Boneless"
  items: MenuItem[];
  pricing?: string; // e.g., "4 FOR $8 OR 8 FOR $15"
  options?: string[]; // Add options for things like beer choices
  icon?: MenuIcon;
}

export interface MenuSection {
  title: string;
  items?: MenuItem[];
  subSections?: MenuSubSection[];
  notes?: string[]; // e.g., list of meat options or sauces
  icon?: MenuIcon;
}

export interface FullMenu {
  drinks: MenuSection[];
  food: MenuSection[];
}

// Example: Type for an Event (adjust based on your actual data)
export interface SiteEvent {
    id: string | number;
    title: string;
    date: string; // Or Date object
    description: string;
    imageUrl?: string;
    slug?: string; // For routing if needed
}

// Example: Type for a Blog Post
export interface BlogPost {
    id: string | number;
    title: string;
    content: string;
    date: string; // Or Date object
    author: string;
    imageUrl?: string;
    slug?: string;
}

// Add other shared types as your application grows.