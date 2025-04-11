import type { FullMenu } from '@/types';
import { categoryIcons, foodIcons, drinkIcons, meatIcons, sauceIcons } from '@/lib/menu-icons';

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
          image: '/chips_guac.png'
        },
        {
          name: 'BASKET OF FRIES',
          price: '$7.00',
          description: 'Crispy golden fries seasoned with our special blend',
          icon: foodIcons.fries,
          image: '/basket_fry.png'
        },
        {
          name: 'BASKET OF TOTS',
          price: '$7.00',
          description: 'Crispy tater tots, perfectly seasoned',
          icon: foodIcons.tots,
          image: '/basket_tots.png'
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
        },
        {
          name: 'LOADED FRIES',
          price: '$14.00',
          description: 'NACHO CHEESE, PICO, JALAPENOS, GUAC SAUCE, CHIPOTLE, COTIJA, SOUR CREAM, CHOICE OF MEAT',
          icon: foodIcons.loadedFries,
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
      title: 'MEAT (Options for items with "CHOICE OF MEAT")',
      icon: categoryIcons.meat,
      items: [
        { name: 'ASADA (BEEF)', price: '', icon: meatIcons.asada },
        { name: 'BIRRIA (BEEF)', price: '', icon: meatIcons.birriaMeat },
        { name: 'AL PASTOR (PORK)', price: '', icon: meatIcons.alPastor },
        { name: 'CARNITAS (PORK)', price: '', icon: meatIcons.carnitas },
        { name: 'CHORIZO (PORK)', price: '', icon: meatIcons.chorizo },
        { name: 'POLLO (CHICKEN)', price: '', icon: meatIcons.pollo },
        { name: 'VEGGIES', price: '', icon: meatIcons.veggies },
        { name: 'LENGUA', price: '+$2.00', icon: meatIcons.lengua },
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
