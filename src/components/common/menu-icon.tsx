import { cn } from '@/lib/utils';
import type { MenuIcon as MenuIconType } from '@/types';
import {
  Utensils,
  Coffee,
  Beer,
  Wine,
  Pizza,
  Sandwich,
  Fish,
  ChefHat,
  Flame,
  Soup,
  Shell,
  Martini,
  GlassWater,
  Plane,
  Building2,
  Grid2x2,
  Beef,
  Drumstick,
  Salad,
  Apple,
  Carrot,
  Leaf,
  LucideIcon,
} from 'lucide-react';

// Map of icon names to Lucide components
const iconMap: Record<string, LucideIcon> = {
  // Categories
  smallbites: Utensils,
  main: ChefHat,
  birria: Flame,
  seafood: Fish,
  wings: Drumstick,
  breakfast: Coffee,
  sauces: GlassWater,
  drinks: Wine,
  martinis: Martini,
  boards: Grid2x2,
  flights: Plane,
  towers: Building2,

  // Food items
  'chips-guac': Utensils,
  fries: Utensils,
  'loaded-fries': Utensils,
  tots: Utensils,
  flautas: Utensils,
  tacos: Sandwich,
  burrito: Sandwich,
  mulitas: Sandwich,
  torta: Sandwich,
  bowl: Soup,
  quesadilla: Pizza,
  vampiros: Sandwich,
  empanadas: Utensils,
  salad: Salad,
  pizza: Pizza,
  ramen: Soup,
  fish: Fish,
  shrimp: Shell,

  // Meat types
  'asada': Beef,
  'birria-meat': Beef,
  'al-pastor': Beef,
  'carnitas': Beef,
  'chorizo': Beef,
  'pollo': Drumstick,
  'veggies': Carrot,
  'lengua': Beef,

  // Sauces
  'guac': Leaf,
  'tomatillo': Apple,
  'ranchera': Flame,
  'chile-de-arbol': Flame,
  'habanero': Flame,

  // Drinks
  margarita: Wine,
  cocktail: Martini,
  beer: Beer,
  coffee: Coffee,
  mimosa: Wine,
  wine: Wine,
  martini: Martini,
};

interface MenuIconProps {
  icon: MenuIconType;
  className?: string;
  size?: number;
}

export function MenuIcon({ icon, className, size = 24 }: MenuIconProps) {
  const IconComponent = iconMap[icon.name.toLowerCase()] || Utensils;
  
  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <IconComponent size={size} className="stroke-current" />
    </div>
  );
}
