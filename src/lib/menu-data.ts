import type { FullMenu } from '@/types';
import { categoryIcons, foodIcons, drinkIcons, meatIcons, sauceIcons } from '@/lib/menu-icons';
import { Utensils, Coffee, Pizza, Cake, Beef, Wine, Sandwich, IceCream } from "lucide-react";
import { MenuItem, MenuSection } from "@/components/features/restaurant-menu";
import React from "react";

export const menuData: FullMenu = {
  drinks: [
    {
      title: 'HAPPY HOUR',
      icon: categoryIcons.drinks,
      items: [
        {
          name: 'ALL APPETIZERS',
          price: '$3 OFF',
          description: 'Get $3 off all appetizers during Happy Hour (4 PM - 7 PM M-F)',
          icon: foodIcons.chipsGuac,
        },
        {
          name: 'ALL COCKTAILS',
          price: '$3 OFF',
          description: 'Get $3 off all cocktails during Happy Hour (4 PM - 7 PM M-F)',
          icon: drinkIcons.cocktail,
        },
        {
          name: 'CANS OF BEER',
          price: '$6',
          description: 'Special Happy Hour pricing on cans of beer (4 PM - 7 PM M-F)',
          icon: drinkIcons.beer,
        },
        {
          name: 'GLASSES OF WINE',
          price: '$7',
          description: 'Special Happy Hour pricing on glasses of wine (4 PM - 7 PM M-F)',
          icon: drinkIcons.wine,
        },
      ],
      notes: ['Happy Hour available Monday through Friday, 4 PM - 7 PM'],
    },
    {
      title: 'HOUSE FAVORITES',
      icon: categoryIcons.drinks,
      items: [
        {
          name: 'ICED MARGATIRA',
          price: '$17',
          description:
            'Don Julio Blanco, Mango, Lime Juice, Chamoy, and Tajin',
          icon: drinkIcons.margarita,
        },
        {
          name: 'ICED DOÑA 70',
          price: '$22',
          description: 'Don 70, Strawberry Syrup, Peach Syrup, Lime Juice,',
          icon: drinkIcons.cocktail,
        },
        {
          name: 'ICED PINA COLADA',
          price: '$15',
          description: 'Captain Morgan, Coconut Syrup, and Coconut Milk',
          icon: drinkIcons.cocktail,
        },
        {
          name: 'CANTARITO',
          price: '$12',
          description: 'Herradura Blanco, Orange, Lime, and Salt',
          icon: drinkIcons.cocktail,
        },
        {
          name: 'PALOMA',
          price: '$11',
          description: 'Cazadores, Orange, Grape Fruit Juice, Lime, and Salt',
          icon: drinkIcons.cocktail,
        },
        {
          name: 'PINEAPPLE PARADISE',
          price: '$11',
          description: 'Grey Goose, Passion Fruit, and Pineapple',
          icon: drinkIcons.cocktail,
        },
        {
          name: 'MICHELADA',
          price: '$12',
          description: 'Beer, Michelada Mix, and Fresh Lime',
          icon: drinkIcons.beer,
        },
        {
          name: 'BLOODY MARY',
          price: '$12',
          description:
            'Tito\'s, Bloody Mary Mix, Pickles, Banana Peppers, Olives, and Spices',
          icon: drinkIcons.cocktail,
        },
        {
          name: 'PEACHY BEACHY',
          price: '$12',
          description: 'Tito\'s, Champaign, and Peach syrup',
          icon: drinkIcons.cocktail,
        },
        {
          name: 'COCONUT BERRY DREAM',
          price: '$12',
          description: 'Vanilla Vodka, Huckleberry, Coconut, and Pineapple',
          icon: drinkIcons.cocktail,
        },
        {
          name: 'MANGO TAMARINDO',
          price: '$12.50',
          description: 'Spicy Tamarindo, Mango, and Pineapple',
          icon: drinkIcons.cocktail,
        },
      ],
    },
    {
      title: 'MARTINIS',
      icon: categoryIcons.martinis,
      items: [
        {
          name: 'CLASSIC MARTINI',
          price: '$11',
          description: 'Gin, Vermouth, and Olive',
          icon: drinkIcons.martini,
        },
        {
          name: 'ESPRESSO MARTINI',
          price: '$11',
          description: 'Espresso Shot and Kahlua',
          icon: drinkIcons.coffee,
        },
        {
          name: 'FRESH LEMON DROP',
          price: '$11',
          description: 'Fresh Lemon Juice, Syrup, and Grey Goose,',
          icon: drinkIcons.martini,
        },
        {
          name: 'LECHERA ESPRESSO',
          price: '$12',
          description: 'Kahlua, Bay Leaves, Condensed Milk, and Espresso Shot',
          icon: drinkIcons.coffee,
        },
        {
          name: 'PASSION FRUIT DROP',
          price: '$12',
          description: 'Fresh Lemon Juice, Black Berry Syrup, and Grey Goose,',
          icon: drinkIcons.martini,
        },
      ],
    },
    {
      title: 'BOARDS',
      icon: categoryIcons.boards,
      items: [
        {
          name: 'MIMOSA BOARD',
          price: '$19',
          description: 'Brut Champagne.',
          options: ['CHOOSE TWO: Orange Juice, Cranberry Juice, Pineapple Juice'],
          note: '(Comes w/ 4 Glasses)',
          icon: drinkIcons.mimosa,
        },
        {
          name: 'MARGATRIA BOARD',
          price: '$35',
          description: 'Hornitos, Combier, Lime Juice, Fresh Fruit',
          options: ['(Pineapple, Mango, Coconut, and Watermelon)'],
          note: '(Comes w/ 4 Glasses)',
          icon: drinkIcons.margarita,
        },
      ],
    },
    {
      title: 'FLIGHTS',
      icon: categoryIcons.flights,
      items: [
        {
          name: 'Patron Flight',
          price: '$35',
          description: 'Patron, Fresh lime juice, and Combier.',
          options: [
            'CHOOSE FOUR: Strawberry, Watermelon, Mango, Peach, Passion Fruit, Raspberry, Prickly Pear, Pineapple, Guava, Kiwi, Blackberry, Coconut',
          ],
          note: '(Comes w/ 4 Glasses)',
          icon: drinkIcons.margarita,
        },
      ],
    },
    {
      title: 'TOWERS (88 OZ)',
      icon: categoryIcons.towers,
      items: [
        {
          name: 'HUSTLE MARGARITA',
          price: '$50',
          description: 'Hornitos, Combier, Fresh Lime Juice, Blue Agave, and Salt',
          icon: drinkIcons.margarita,
        },
        {
          name: 'TEXAS MARGARITA',
          price: '$65',
          description: 'Patron, Fresh Lime Juice, Orange Juice, Combier, and Salt',
          icon: drinkIcons.margarita,
        },
      ],
      subSections: [
        {
          name: 'BEER TOWERS...',
          items: [],
          pricing: '$27+',
          options: [
            'CHOOSE BEER: COORS, MODELO, NEGRA MODELO, CORONA, PACIFICO, HEFE, and CIDERS',
          ],
          icon: drinkIcons.beer,
        },
      ],
    },
  ],
  food: [
    {
      title: 'SMALL BITES',
      icon: categoryIcons.smallBites,
      items: [
        {
          name: 'CHIPS & GUAC',
          price: '$8.00',
          description: 'Fresh tortilla chips served with house-made guacamole',
          icon: foodIcons.chipsGuac,
          image: '@chips-guac.png'
        },
        {
          name: 'BASKET OF FRIES',
          price: '$7.00',
          description: 'Crispy golden fries seasoned with our special blend',
          icon: foodIcons.fries,
          image: '@menu-item-basket-fries.png'
        },
        {
          name: 'BASKET OF TOTS',
          price: '$7.00',
          description: 'Crispy tater tots, perfectly seasoned',
          icon: foodIcons.tots,
          image: '@menu-item-basket-tots.png'
        },
      ],
    },
    {
      title: 'MAIN',
      icon: categoryIcons.main,
      items: [
        {
          name: 'FLAUTAS (4)',
          price: '$12.00',
          description: 'POTATOES AND CARNITAS',
          icon: foodIcons.flautas,
          image: '@menu-item-flautas-potatoes.png'
        },
        {
          name: 'LOADED FRIES',
          price: '$14.00',
          description: 'NACHO CHEESE, PICO, JALAPENOS, GUAC SAUCE, CHIPOTLE, COTIJA, SOUR CREAM, CHOICE OF MEAT',
          icon: foodIcons.loadedFries,
          image: '@menu-item-loaded-fries.png'
        },
        {
          name: 'LOADED NACHO',
          price: '$14.00',
          description: 'NACHO CHEESE, PICO, JALAPENOS, GUAC SAUCE, CHIPOTLE, COTIJA, SOUR CREAM, CHOICE OF MEAT',
          icon: foodIcons.chipsGuac,
        },
        {
          name: 'BURRITO',
          price: '$12.00',
          description:
            'FLOUR TORTILLA, BEANS, RICE, CILANTRO, ONIONS, GUAC SAUCE, CHIPOTLE, TORTILLA CHIPS, CHOICE OF MEAT',
          icon: foodIcons.burrito,
        },
        {
          name: 'TACOS',
          price: '$3.75',
          description: 'GLUTEN FREE CORN TORTILLA, ONIONS, CILANTRO, CHOICE OF MEAT',
          icon: foodIcons.tacos,
        },
        {
          name: 'MULITAS',
          price: '$7.75',
          description:
            'CORN TORTILLA, QUESO OAXACA, CILANTRO, ONIONS, GUAC SAUCE, CHOICE OF MEAT',
          icon: foodIcons.mulitas,
        },
        {
          name: 'TORTA',
          price: '$13.50',
          description:
            'BREAD, CHEESE OAXACA, BEANS, LETTUCE, TOMATOES, ONIONS, CILANTRO, AVOCADO, JALAPENOS, CHIPOTLE, GUAC SAUCE, COTIJA, CHOICE OF MEAT',
          icon: foodIcons.torta,
        },
        {
          name: 'HUSTLE BOWL',
          price: '$15.00',
          description:
            'BEANS, RICE, LETTUCE, PICO, JALAPENOS, SOUR CREAM, GUAC SAUCE, COTIJA, TORTILLA CHIPS, CHOICE OF MEAT',
          icon: foodIcons.bowl,
        },
        {
          name: 'QUESO TACOS',
          price: '$5.75',
          description:
            'GLUTEN FREE CORN TORTILLA, QUESO OAXACA, ONIONS, CILANTRO CHOICE OF MEAT',
          icon: foodIcons.tacos,
        },
        {
          name: 'QUESADILLA',
          price: '$14.00',
          description:
            'FLOUR TORTILLA, QUESO OAXACA, GUAC SAUCE, CHOICE OF MEAT',
          icon: foodIcons.quesadilla,
        },
        {
          name: 'VAMPIROS',
          price: '$7.75',
          description:
            'CORN TORTILLA, QUESO OAXACA, GUACAMOLE, CHOICE OF MEAT',
          icon: foodIcons.vampiros,
        },
        {
          name: 'EMPANADAS',
          price: '$7.00',
          description:
            'FRIED FLOUR, QUESO OAXACA, SOUR CREAM, GUAC SAUCE, LETTUCE CHOICE OF MEAT',
          icon: foodIcons.empanadas,
        },
        {
          name: 'TACO SALAD',
          price: '$14.00',
          description:
            'FLOUR TORTILLA, LETTUCE, PICO CILANTRO, SOUR CREAM, COTIJA, CHOICE OF MEAT',
          icon: foodIcons.salad,
        },
      ],
    },
    {
      title: 'BIRRIA (ALL BIRRA ITEMS COME WITH CONSUME)',
      icon: categoryIcons.birria,
      items: [
        {
          name: 'BIRRIA QUESO TACOS',
          price: '$16.75',
          description: '3 QUESO BIRRIA TACOS, QUESO OAXACA, ONIONS, CILANTRO,',
          icon: foodIcons.tacos,
        },
        {
          name: 'BIRRIA PIZZA',
          price: '$29.00',
          description: 'TWO FLOUR TORTILLAS, CILANTRO, ONIONS, QUESO OAXACA',
          icon: foodIcons.pizza,
        },
        {
          name: 'BIRRIA RAMEN BOWL',
          price: '$14.75',
          description: 'BIRRIA TAPATIO NOODLES, CILANTRO AND ONIONS',
          icon: foodIcons.ramen,
        },
        {
          name: 'BIRRIA FLAUTAS',
          price: '$12.00',
          description: 'CORN TORTILLA, BIRRIA, COSME',
          icon: foodIcons.flautas,
        },
      ],
    },
    {
      title: 'SEA FOOD',
      icon: categoryIcons.seafood,
      items: [
        {
          name: 'FRIED FISH TACOS (2)',
          price: '$8.75',
          description: 'ONIONS, CABBAGE, CHIPOTLE, CHEESE, CORN TORTILLA',
          icon: foodIcons.fish,
        },
        {
          name: 'FRIED SHRIMP TACOS (2)',
          price: '$8.75',
          description: 'ONIONS, CABBAGE, CHIPOTLE, CHEESE, CORN TORTILLA',
          icon: foodIcons.shrimp,
        },
      ],
    },
    {
      title: 'WINGS',
      icon: categoryIcons.wings,
      items: [],
      subSections: [
        {
          name: 'Type',
          items: [
            { name: 'TRADITIONAL', price: '' },
            { name: 'BONELESS', price: '' },
          ],
          pricing: '4 FOR $8 OR 8 FOR $15',
        },
        {
          name: 'Flavors',
          items: [
            { name: 'KOREAN BBQ', price: '' },
            { name: 'MANGO HABANERO', price: '' },
            { name: 'SWEET TERIYAKI', price: '' },
            { name: 'GARLIC BUFFALO', price: '' },
            { name: 'BUFFALO', price: '' },
            { name: 'GARLIC PARMESAN', price: '' },
            { name: 'BBQ', price: '' },
          ],
        },
      ],
    },
    {
      title: 'BREAKFAST (BURRITOS W/EGGS)',
      icon: categoryIcons.breakfast,
      items: [
        {
          name: 'ASADA & BACON',
          price: '$13.00',
          description:
            'FLOUR TORTILLA, ASADA, BACON, TOTS, SOUR CREAM, GUAC SAUCE',
          icon: foodIcons.burrito,
        },
      ],
    },
    {
      title: 'MEAT (Add $2.00 for each meat option)',
      icon: categoryIcons.meat,
      items: [
        { name: 'ASADA (BEEF)', price: '$2.00', icon: meatIcons.asada },
        { name: 'BIRRIA (BEEF)', price: '$2.00', icon: meatIcons.birriaMeat },
        { name: 'AL PASTOR (PORK)', price: '$2.00', icon: meatIcons.alPastor },
        { name: 'CARNITAS (PORK)', price: '$2.00', icon: meatIcons.carnitas },
        { name: 'CHORIZO (PORK)', price: '$2.00', icon: meatIcons.chorizo },
        { name: 'POLLO (CHICKEN)', price: '$2.00', icon: meatIcons.pollo },
        { name: 'VEGGIES', price: '$2.00', icon: meatIcons.veggies },
        { name: 'LENGUA', price: '$2.00', icon: meatIcons.lengua },
      ],
    },
    {
      title: 'CHEFA SAUCE (ALL SAUCE MADE IN HOUSE)',
      icon: categoryIcons.sauces,
      items: [
        { name: 'GUAC', price: '', icon: sauceIcons.guac },
        { name: 'TOMATILLO', price: '', icon: sauceIcons.tomatillo },
        { name: 'RANCHERA', price: '', icon: sauceIcons.ranchera },
        { name: 'CHILE DE ARBOL', price: '', icon: sauceIcons.chileDeArbol },
        { name: 'HABANERO', price: '', icon: sauceIcons.habanero },
      ],
    },
  ],
};

// Define interfaces matching the ones in the restaurant-menu component
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string | number;
  popular?: boolean;
  vegetarian?: boolean;
  vegan?: boolean;
  spicy?: boolean;
  glutenFree?: boolean;
  image?: string;
  dietary?: string[];
  isChefSpecial?: boolean;
}

interface MenuSection {
  id: string;
  title: string;
  story?: string;
  icon: React.ReactElement;
  items: MenuItem[];
}

// Mock menu data for the restaurant
export const menuSections: MenuSection[] = [
  {
    id: "starters",
    title: "STARTERS",
    story: "Begin your meal with our signature appetizers, perfect for sharing.",
    icon: React.createElement(Utensils, { className: "w-5 h-5 text-white" }),
    items: [
      {
        id: "nachos",
        name: "Loaded Nachos",
        description: "Crispy tortilla chips topped with melted cheese, jalapeños, guacamole, sour cream, and pico de gallo.",
        price: 12.99,
        image: "/images/menu/nachos.jpg",
        dietary: ["Vegetarian option available"],
        popular: true
      },
      {
        id: "wings",
        name: "Wolf Wings",
        description: "Crispy chicken wings tossed in your choice of sauce: Buffalo, BBQ, or Honey Garlic.",
        price: 14.99,
        image: "/images/menu/wings.jpg"
      },
      {
        id: "calamari",
        name: "Crispy Calamari",
        description: "Lightly battered calamari served with a zesty marinara sauce and lemon wedges.",
        price: 13.99,
        image: "/images/menu/calamari.jpg"
      },
      {
        id: "spinach-dip",
        name: "Spinach & Artichoke Dip",
        description: "Creamy spinach and artichoke dip served with toasted bread and tortilla chips.",
        price: 11.99,
        dietary: ["Vegetarian", "Contains dairy"]
      }
    ]
  },
  {
    id: "tacos",
    title: "TACOS & BURRITOS",
    story: "Authentic flavors wrapped in fresh tortillas with traditional preparation.",
    icon: React.createElement(Sandwich, { className: "w-5 h-5 text-white" }),
    items: [
      {
        id: "street-tacos",
        name: "Street Tacos",
        description: "Three corn tortillas filled with your choice of protein, topped with onions, cilantro, and salsa.",
        price: 13.99,
        image: "/images/menu/tacos.jpg",
        popular: true
      },
      {
        id: "fish-tacos",
        name: "Baja Fish Tacos",
        description: "Beer-battered fish, cabbage slaw, pico de gallo, and chipotle aioli on flour tortillas.",
        price: 15.99,
        image: "/images/menu/fish-tacos.jpg",
        isChefSpecial: true
      },
      {
        id: "burrito-bowl",
        name: "Burrito Bowl",
        description: "Rice, beans, cheese, guacamole, sour cream, and your choice of protein in a bowl.",
        price: 14.99,
        dietary: ["Gluten-free", "Vegetarian option available"]
      },
      {
        id: "california-burrito",
        name: "California Burrito",
        description: "Grilled steak, french fries, cheese, guacamole, and pico de gallo wrapped in a flour tortilla.",
        price: 16.99,
        image: "/images/menu/california-burrito.jpg"
      }
    ]
  },
  {
    id: "mains",
    title: "MAIN COURSES",
    story: "Expertly crafted entrées featuring the finest ingredients and bold flavors.",
    icon: React.createElement(Beef, { className: "w-5 h-5 text-white" }),
    items: [
      {
        id: "ribeye",
        name: "12oz Ribeye Steak",
        description: "Hand-cut ribeye steak grilled to perfection, served with roasted potatoes and seasonal vegetables.",
        price: 29.99,
        image: "/images/menu/ribeye.jpg",
        isChefSpecial: true
      },
      {
        id: "salmon",
        name: "Grilled Salmon",
        description: "Fresh Atlantic salmon with lemon-dill sauce, wild rice pilaf, and grilled asparagus.",
        price: 24.99,
        image: "/images/menu/salmon.jpg",
        dietary: ["Gluten-free"]
      },
      {
        id: "pasta",
        name: "Fettuccine Alfredo",
        description: "Fettuccine pasta tossed in a rich and creamy Alfredo sauce with garlic and Parmesan cheese.",
        price: 18.99,
        dietary: ["Vegetarian", "Contains dairy"],
        popular: true
      },
      {
        id: "burger",
        name: "Wolf Burger",
        description: "Half-pound Angus beef patty with cheddar, bacon, lettuce, tomato, and special sauce on a brioche bun.",
        price: 17.99,
        image: "/images/menu/burger.jpg"
      }
    ]
  },
  {
    id: "pizzas",
    title: "PIZZAS",
    story: "Handcrafted pizzas with house-made dough and premium toppings.",
    icon: React.createElement(Pizza, { className: "w-5 h-5 text-white" }),
    items: [
      {
        id: "margherita",
        name: "Margherita",
        description: "Fresh mozzarella, tomatoes, basil, olive oil, and our signature tomato sauce.",
        price: 16.99,
        image: "/images/menu/margherita.jpg",
        dietary: ["Vegetarian"]
      },
      {
        id: "pepperoni",
        name: "Pepperoni",
        description: "Pepperoni, mozzarella cheese, and our signature tomato sauce.",
        price: 17.99,
        image: "/images/menu/pepperoni.jpg",
        popular: true
      },
      {
        id: "bbq-chicken",
        name: "BBQ Chicken",
        description: "Grilled chicken, red onions, cilantro, BBQ sauce, and mozzarella cheese.",
        price: 18.99
      },
      {
        id: "veggie",
        name: "Veggie Supreme",
        description: "Bell peppers, onions, mushrooms, olives, tomatoes, and mozzarella cheese.",
        price: 17.99,
        dietary: ["Vegetarian"]
      }
    ]
  },
  {
    id: "desserts",
    title: "DESSERTS",
    story: "Indulgent sweet creations to complete your dining experience.",
    icon: React.createElement(Cake, { className: "w-5 h-5 text-white" }),
    items: [
      {
        id: "cheesecake",
        name: "New York Cheesecake",
        description: "Classic New York-style cheesecake with a graham cracker crust and berry compote.",
        price: 9.99,
        image: "/images/menu/cheesecake.jpg",
        popular: true
      },
      {
        id: "chocolate-cake",
        name: "Molten Chocolate Cake",
        description: "Warm chocolate cake with a melted chocolate center, served with vanilla ice cream.",
        price: 10.99,
        image: "/images/menu/chocolate-cake.jpg",
        isChefSpecial: true
      },
      {
        id: "tiramisu",
        name: "Tiramisu",
        description: "Layers of coffee-soaked ladyfingers and mascarpone cream, dusted with cocoa powder.",
        price: 8.99
      },
      {
        id: "ice-cream",
        name: "Ice Cream Sundae",
        description: "Three scoops of ice cream with your choice of toppings, whipped cream, and a cherry.",
        price: 7.99,
        dietary: ["Gluten-free option available"]
      }
    ]
  }
];

export const drinkSections: MenuSection[] = [
  {
    id: "coffee",
    title: "COFFEE",
    story: "Freshly brewed coffee and espresso drinks made with locally roasted beans.",
    icon: React.createElement(Coffee, { className: "w-5 h-5 text-white" }),
    items: [
      {
        id: "espresso",
        name: "Espresso",
        description: "A single shot of our bold espresso blend.",
        price: 3.49
      },
      {
        id: "latte",
        name: "Latte",
        description: "Espresso with steamed milk and a light layer of foam.",
        price: 4.99,
        image: "/images/menu/latte.jpg",
        popular: true
      },
      {
        id: "cappuccino",
        name: "Cappuccino",
        description: "Equal parts espresso, steamed milk, and foam.",
        price: 4.99
      },
      {
        id: "mocha",
        name: "Mocha",
        description: "Espresso with steamed milk, chocolate syrup, and whipped cream.",
        price: 5.49,
        image: "/images/menu/mocha.jpg"
      }
    ]
  },
  {
    id: "drinks",
    title: "DRINKS",
    story: "Refreshing beverages and craft cocktails to complement your meal.",
    icon: React.createElement(Wine, { className: "w-5 h-5 text-white" }),
    items: [
      {
        id: "margarita",
        name: "House Margarita",
        description: "Tequila, fresh lime juice, and triple sec, served on the rocks with a salt rim.",
        price: 9.99,
        image: "/images/menu/margarita.jpg",
        popular: true
      },
      {
        id: "old-fashioned",
        name: "Old Fashioned",
        description: "Bourbon, sugar, bitters, and an orange twist.",
        price: 11.99,
        isChefSpecial: true
      },
      {
        id: "mojito",
        name: "Mojito",
        description: "Rum, fresh mint, lime, sugar, and soda water.",
        price: 10.99
      },
      {
        id: "beer",
        name: "Craft Beer Selection",
        description: "Ask your server about our rotating selection of local and imported craft beers.",
        price: "6.99 - 8.99"
      }
    ]
  },
  {
    id: "dessert-drinks",
    title: "DESSERT DRINKS",
    story: "Delightful sweet beverages to satisfy your cravings.",
    icon: React.createElement(IceCream, { className: "w-5 h-5 text-white" }),
    items: [
      {
        id: "milkshake",
        name: "Classic Milkshake",
        description: "Hand-spun milkshake in your choice of chocolate, vanilla, or strawberry.",
        price: 6.99,
        image: "/images/menu/milkshake.jpg",
        dietary: ["Vegetarian", "Contains dairy"],
        popular: true
      },
      {
        id: "hot-chocolate",
        name: "Deluxe Hot Chocolate",
        description: "Rich hot chocolate topped with whipped cream, marshmallows, and chocolate shavings.",
        price: 5.49
      },
      {
        id: "affogato",
        name: "Affogato",
        description: "Vanilla ice cream topped with a shot of hot espresso.",
        price: 6.99,
        dietary: ["Vegetarian", "Contains dairy"],
        isChefSpecial: true
      }
    ]
  }
];

// Function to combine all menu sections
export const getAllMenuSections = () => {
  return [...menuSections, ...drinkSections];
};

// Categories for filtering
export const categories = [
  { value: "starters", label: "Starters" },
  { value: "tacos", label: "Tacos & Burritos" },
  { value: "mains", label: "Main Courses" },
  { value: "pizzas", label: "Pizzas" },
  { value: "desserts", label: "Desserts" },
  { value: "coffee", label: "Coffee" },
  { value: "drinks", label: "Drinks" },
  { value: "dessert-drinks", label: "Dessert Drinks" }
];
