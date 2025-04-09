import type { MenuIcon, MenuIconType } from '@/types';

// Helper function to create menu icons
export function createMenuIcon(
  name: string,
  type: MenuIconType,
): MenuIcon {
  return {
    name,
    type,
    path: name.toLowerCase().replace(/\s+/g, '-'),
  };
}

// Category Icons
export const categoryIcons = {
  smallBites: createMenuIcon('smallbites', 'category'),
  main: createMenuIcon('main', 'category'),
  birria: createMenuIcon('birria', 'category'),
  seafood: createMenuIcon('seafood', 'category'),
  wings: createMenuIcon('wings', 'category'),
  breakfast: createMenuIcon('breakfast', 'category'),
  sauces: createMenuIcon('sauces', 'category'),
  drinks: createMenuIcon('drinks', 'category'),
  martinis: createMenuIcon('martinis', 'category'),
  boards: createMenuIcon('boards', 'category'),
  flights: createMenuIcon('flights', 'category'),
  towers: createMenuIcon('towers', 'category'),
  meat: createMenuIcon('meat', 'category'),
};

// Food Icons
export const foodIcons = {
  chipsGuac: createMenuIcon('chips-guac', 'food'),
  fries: createMenuIcon('fries', 'food'),
  loadedFries: createMenuIcon('loaded-fries', 'food'),
  tots: createMenuIcon('tots', 'food'),
  flautas: createMenuIcon('flautas', 'food'),
  tacos: createMenuIcon('tacos', 'food'),
  burrito: createMenuIcon('burrito', 'food'),
  mulitas: createMenuIcon('mulitas', 'food'),
  torta: createMenuIcon('torta', 'food'),
  bowl: createMenuIcon('bowl', 'food'),
  quesadilla: createMenuIcon('quesadilla', 'food'),
  vampiros: createMenuIcon('vampiros', 'food'),
  empanadas: createMenuIcon('empanadas', 'food'),
  salad: createMenuIcon('salad', 'food'),
  pizza: createMenuIcon('pizza', 'food'),
  ramen: createMenuIcon('ramen', 'food'),
  fish: createMenuIcon('fish', 'food'),
  shrimp: createMenuIcon('shrimp', 'food'),
};

// Meat Icons
export const meatIcons = {
  asada: createMenuIcon('asada', 'food'),
  birriaMeat: createMenuIcon('birria-meat', 'food'),
  alPastor: createMenuIcon('al-pastor', 'food'),
  carnitas: createMenuIcon('carnitas', 'food'),
  chorizo: createMenuIcon('chorizo', 'food'),
  pollo: createMenuIcon('pollo', 'food'),
  veggies: createMenuIcon('veggies', 'food'),
  lengua: createMenuIcon('lengua', 'food'),
};

// Sauce Icons
export const sauceIcons = {
  guac: createMenuIcon('guac', 'food'),
  tomatillo: createMenuIcon('tomatillo', 'food'),
  ranchera: createMenuIcon('ranchera', 'food'),
  chileDeArbol: createMenuIcon('chile-de-arbol', 'food'),
  habanero: createMenuIcon('habanero', 'food'),
};

// Drink Icons
export const drinkIcons = {
  margarita: createMenuIcon('margarita', 'drink'),
  cocktail: createMenuIcon('cocktail', 'drink'),
  beer: createMenuIcon('beer', 'drink'),
  coffee: createMenuIcon('coffee', 'drink'),
  mimosa: createMenuIcon('mimosa', 'drink'),
  wine: createMenuIcon('wine', 'drink'),
  martini: createMenuIcon('martini', 'drink'),
};
