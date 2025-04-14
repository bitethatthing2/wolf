import { Beef, Coffee, IceCream, Sandwich, Utensils, Wine, Beer, GlassWater, Glasses } from "lucide-react";

// Menu item images with consistent naming pattern
// All images should be stored in the public directory
const ITEM_IMAGES = {
  // Starters
  "CHIPS & GUAC": "/assets/foodmenu/chips-guac.png",
  "BASKET OF FRIES": "/assets/foodmenu/basket-fries.png",
  "BASKET OF TOTS": "/assets/foodmenu/basket-tots.png",
  
  // Main dishes
  "FLAUTAS": "/assets/foodmenu/flautas.png",
  "LOADED FRIES": "/assets/foodmenu/loaded-fries.png",
  "LOADED NACHO": "/assets/foodmenu/loaded-nacho.png",
  "BURRITO": "/assets/foodmenu/burrito.png",
  "TACOS": "/assets/foodmenu/tacos.png",
  "MULITAS": "/assets/foodmenu/mulitas.png",
  "TORTA": "/assets/foodmenu/torta.png",
  "HUSTLE BOWL": "/assets/foodmenu/hustle-bowl.png",
  "QUESO TACOS": "/assets/foodmenu/queso-tacos.png",
  "QUESADILLA": "/assets/foodmenu/quesadilla.png",
  "VAMPIROS": "/assets/foodmenu/vampiros.png",
  "EMPANADAS": "/assets/foodmenu/empanadas.png",
  "TACO SALAD": "/assets/foodmenu/taco-salad.png",
  
  // Birria
  "BIRRIA QUESO TACOS": "/assets/foodmenu/birria-queso-tacos.png",
  "BIRRIA PIZZA": "/assets/foodmenu/birria-pizza.png",
  "BIRRIA RAMEN BOWL": "/assets/foodmenu/birria-ramen.png",
  "BIRRIA FLAUTAS": "/assets/foodmenu/birria-flautas.png",
  
  // Seafood
  "FRIED FISH TACOS": "/assets/foodmenu/fish-tacos.png",
  "FRIED SHRIMP TACOS": "/assets/foodmenu/shrimp-tacos.png",
  
  // Breakfast
  "ASADA & BACON": "/assets/foodmenu/asada-bacon.png",
  
  // Drinks
  "ESPRESSO": "/assets/foodmenu/espresso.png",
  "MARGARITA": "/assets/foodmenu/iced-margarita.png",
  "ICED DOÑA 70": "/assets/foodmenu/iced-dona-70.png",
  "ICED PINA COLADA": "/assets/foodmenu/iced-pina-colada.png",
  "CANTARITO": "/assets/foodmenu/cantarito.png",
  "PALOMA": "/assets/foodmenu/paloma.png",
  "PINEAPPLE PARADISE": "/assets/foodmenu/pineapple-paradise.png",
  "MICHELADA": "/assets/foodmenu/michelada.png",
  "BLOODY MARY": "/assets/foodmenu/bloody-mary.png",
  "PEACHY BEACHY": "/assets/foodmenu/peachy-beachy.png",
  "COCONUT BERRY DREAM": "/assets/foodmenu/coconut-berry-dream.png",
  "MANGO TAMARINDO": "/assets/foodmenu/mango-tamarindo.png",
};

// Section stories for enhanced context
export const SECTION_STORIES = {
  "STARTERS": "Every great meal begins with the perfect starter. Our small bites are crafted to awaken your palate with bold flavors that hint at what's to come.",
  "TACOS & BURRITOS": "Our authentic corn tortillas bring traditional flavor to every bite, using techniques that Ms. Hustle perfected over years of culinary training.",
  "MAIN COURSES": "Hearty, satisfying, and bursting with flavor. Our mains showcase the depth of flavor that comes from respecting traditional techniques.",
  "DESSERTS": "A sweet ending to your meal, our desserts balance tradition with creativity for the perfect finale to your dining experience.",
  "HOUSE FAVORITES": "These signature dishes have earned their place as the most requested items on our menu. One taste and you'll understand why.",
  "COFFEE": "We source our beans from small farms committed to sustainable practices, then roast them to bring out their unique flavor profiles.",
  "DRINKS": "Our bar program celebrates both classics and creative signature cocktails, using house-made syrups, fresh-squeezed juices, and quality spirits.",
  "HAPPY HOUR": "Join us during Happy Hour for special prices on drinks and appetizers. Available Monday through Friday, 4 PM - 7 PM.",
  "CHEFA SAUCE": "Our signature sauces are made in-house with authentic techniques and quality ingredients. Each sauce offers a unique flavor profile to enhance your meal."
};

export const enhancedMenuData = {
  food: [
    {
      id: "starters",
      title: "STARTERS",
      icon: Utensils,
      story: SECTION_STORIES["STARTERS"],
      items: [
        {
          id: "chips-guac",
          name: "CHIPS & GUAC",
          description: "Fresh tortilla chips served with house-made guacamole",
          price: 8.00,
          popular: true,
          vegetarian: true,
          image: ITEM_IMAGES["CHIPS & GUAC"],
          dietary: ["Made without gluten"]
        },
        {
          id: "fries",
          name: "BASKET OF FRIES",
          description: "Crispy golden fries seasoned with our special blend",
          price: 7.00,
          vegetarian: true,
          vegan: true,
          image: ITEM_IMAGES["BASKET OF FRIES"]
        },
        {
          id: "tots",
          name: "BASKET OF TOTS",
          description: "Crispy tater tots, perfectly seasoned",
          price: 7.00,
          vegetarian: true,
          vegan: true,
          image: ITEM_IMAGES["BASKET OF TOTS"]
        }
      ]
    },
    {
      id: "main",
      title: "MAIN",
      icon: Beef,
      story: SECTION_STORIES["MAIN COURSES"],
      items: [
        {
          id: "flautas",
          name: "FLAUTAS (4)",
          description: "POTATOES AND CARNITAS",
          price: 12.00,
          image: ITEM_IMAGES["FLAUTAS"]
        },
        {
          id: "loaded-fries",
          name: "LOADED FRIES",
          description: "NACHO CHEESE, PICO, JALAPENOS, GUAC SAUCE, CHIPOTLE, COTIJA, SOUR CREAM, CHOICE OF MEAT",
          price: 14.00,
          image: ITEM_IMAGES["LOADED FRIES"]
        },
        {
          id: "loaded-nacho",
          name: "LOADED NACHO",
          description: "NACHO CHEESE, PICO, JALAPENOS, GUAC SAUCE, CHIPOTLE, COTIJA, SOUR CREAM, CHOICE OF MEAT",
          price: 14.00,
          image: ITEM_IMAGES["LOADED NACHO"]
        },
        {
          id: "burrito",
          name: "BURRITO",
          description: "FLOUR TORTILLA, BEANS, RICE, CILANTRO, ONIONS, GUAC SAUCE, CHIPOTLE, TORTILLA CHIPS, CHOICE OF MEAT",
          price: 12.00,
          image: ITEM_IMAGES["BURRITO"]
        },
        {
          id: "tacos",
          name: "TACOS",
          description: "GLUTEN FREE CORN TORTILLA, ONIONS, CILANTRO, CHOICE OF MEAT",
          price: 3.75,
          glutenFree: true,
          image: ITEM_IMAGES["TACOS"]
        },
        {
          id: "mulitas",
          name: "MULITAS",
          description: "CORN TORTILLA, QUESO OAXACA, CILANTRO, ONIONS, GUAC SAUCE, CHOICE OF MEAT",
          price: 7.75,
          image: ITEM_IMAGES["MULITAS"]
        },
        {
          id: "torta",
          name: "TORTA",
          description: "BREAD, CHEESE OAXACA, BEANS, LETTUCE, TOMATOES, ONIONS, CILANTRO, AVOCADO, JALAPENOS, CHIPOTLE, GUAC SAUCE, COTIJA, CHOICE OF MEAT",
          price: 13.50,
          image: ITEM_IMAGES["TORTA"]
        },
        {
          id: "hustle-bowl",
          name: "HUSTLE BOWL",
          description: "BEANS, RICE, LETTUCE, PICO, JALAPENOS, SOUR CREAM, GUAC SAUCE, COTIJA, TORTILLA CHIPS, CHOICE OF MEAT",
          price: 15.00,
          image: ITEM_IMAGES["HUSTLE BOWL"]
        },
        {
          id: "queso-tacos",
          name: "QUESO TACOS",
          description: "GLUTEN FREE CORN TORTILLA, QUESO OAXACA, ONIONS, CILANTRO CHOICE OF MEAT",
          price: 5.75,
          glutenFree: true,
          image: ITEM_IMAGES["QUESO TACOS"]
        },
        {
          id: "quesadilla",
          name: "QUESADILLA",
          description: "FLOUR TORTILLA, QUESO OAXACA, GUAC SAUCE, CHOICE OF MEAT",
          price: 14.00,
          image: ITEM_IMAGES["QUESADILLA"]
        },
        {
          id: "vampiros",
          name: "VAMPIROS",
          description: "CORN TORTILLA, QUESO OAXACA, GUACAMOLE, CHOICE OF MEAT",
          price: 7.75,
          image: ITEM_IMAGES["VAMPIROS"]
        },
        {
          id: "empanadas",
          name: "EMPANADAS",
          description: "FRIED FLOUR, QUESO OAXACA, SOUR CREAM, GUAC SAUCE, LETTUCE CHOICE OF MEAT",
          price: 7.00,
          image: ITEM_IMAGES["EMPANADAS"]
        },
        {
          id: "taco-salad",
          name: "TACO SALAD",
          description: "FLOUR TORTILLA, LETTUCE, PICO CILANTRO, SOUR CREAM, COTIJA, CHOICE OF MEAT",
          price: 14.00,
          image: ITEM_IMAGES["TACO SALAD"]
        }
      ]
    },
    {
      id: "birria",
      title: "BIRRIA (ALL BIRRA ITEMS COME WITH CONSUME)",
      icon: Beef,
      items: [
        {
          id: "birria-queso-tacos",
          name: "BIRRIA QUESO TACOS",
          description: "3 QUESO BIRRIA TACOS, QUESO OAXACA, ONIONS, CILANTRO",
          price: 16.75,
          image: ITEM_IMAGES["BIRRIA QUESO TACOS"]
        },
        {
          id: "birria-pizza",
          name: "BIRRIA PIZZA",
          description: "TWO FLOUR TORTILLAS, CILANTRO, ONIONS, QUESO OAXACA",
          price: 29.00,
          image: ITEM_IMAGES["BIRRIA PIZZA"]
        },
        {
          id: "birria-ramen",
          name: "BIRRIA RAMEN BOWL",
          description: "BIRRIA TAPATIO NOODLES, CILANTRO AND ONIONS",
          price: 14.75,
          image: ITEM_IMAGES["BIRRIA RAMEN BOWL"]
        },
        {
          id: "birria-flautas",
          name: "BIRRIA FLAUTAS",
          description: "CORN TORTILLA, BIRRIA, COSME",
          price: 12.00,
          image: ITEM_IMAGES["BIRRIA FLAUTAS"]
        }
      ]
    },
    {
      id: "seafood",
      title: "SEA FOOD",
      icon: Sandwich,
      items: [
        {
          id: "fish-tacos",
          name: "FRIED FISH TACOS (2)",
          description: "ONIONS, CABBAGE, CHIPOTLE, CHEESE, CORN TORTILLA",
          price: 8.75,
          image: ITEM_IMAGES["FRIED FISH TACOS"]
        },
        {
          id: "shrimp-tacos",
          name: "FRIED SHRIMP TACOS (2)",
          description: "ONIONS, CABBAGE, CHIPOTLE, CHEESE, CORN TORTILLA",
          price: 8.75,
          image: ITEM_IMAGES["FRIED SHRIMP TACOS"]
        }
      ]
    },
    {
      id: "breakfast",
      title: "BREAKFAST (BURRITOS W/EGGS)",
      icon: Sandwich,
      items: [
        {
          id: "asada-bacon",
          name: "ASADA & BACON",
          description: "FLOUR TORTILLA, ASADA, BACON, TOTS, SOUR CREAM, GUAC SAUCE",
          price: 13.00,
          image: ITEM_IMAGES["ASADA & BACON"]
        }
      ]
    },
    {
      id: "meat-options",
      title: "MEAT (Add $2.00 for each meat option)",
      icon: Beef,
      items: [
        {
          id: "asada",
          name: "ASADA (BEEF)",
          description: "",
          price: 2.00
        },
        {
          id: "birria-beef",
          name: "BIRRIA (BEEF)",
          description: "",
          price: 2.00
        },
        {
          id: "al-pastor",
          name: "AL PASTOR (PORK)",
          description: "",
          price: 2.00
        },
        {
          id: "carnitas",
          name: "CARNITAS (PORK)",
          description: "",
          price: 2.00
        },
        {
          id: "chorizo",
          name: "CHORIZO (PORK)",
          description: "",
          price: 2.00
        },
        {
          id: "pollo",
          name: "POLLO (CHICKEN)",
          description: "",
          price: 2.00
        },
        {
          id: "veggies",
          name: "VEGGIES",
          description: "",
          price: 2.00,
          vegetarian: true
        },
        {
          id: "lengua",
          name: "LENGUA",
          description: "",
          price: 2.00
        }
      ]
    },
    {
      id: "sauces",
      title: "CHEFA SAUCE (ALL SAUCE MADE IN HOUSE)",
      icon: GlassWater,
      story: SECTION_STORIES["CHEFA SAUCE"],
      items: [
        {
          id: "guac",
          name: "GUAC",
          description: "Creamy fresh avocado with lime, cilantro, and a hint of garlic",
          price: 0,
          vegetarian: true,
          vegan: true
        },
        {
          id: "tomatillo",
          name: "TOMATILLO",
          description: "Tangy roasted tomatillos blended with cilantro and mild peppers",
          price: 0,
          vegetarian: true,
          vegan: true
        },
        {
          id: "ranchera",
          name: "RANCHERA",
          description: "Classic tomato-based sauce with roasted peppers and Mexican spices",
          price: 0,
          vegetarian: true,
          vegan: true
        },
        {
          id: "chile-arbol",
          name: "CHILE DE ARBOL",
          description: "Bold and smoky sauce made with dried chile de arbol peppers",
          price: 0,
          vegetarian: true,
          vegan: true,
          spicy: true
        },
        {
          id: "habanero",
          name: "HABANERO",
          description: "Intense heat balanced with fruity notes from fresh habanero peppers",
          price: 0,
          vegetarian: true,
          vegan: true,
          spicy: true
        }
      ]
    }
  ],
  drinks: [
    {
      id: "happy-hour",
      title: "HAPPY HOUR",
      icon: Wine,
      story: SECTION_STORIES["HAPPY HOUR"],
      items: [
        {
          id: "happy-appetizers",
          name: "ALL APPETIZERS",
          description: "Get $3 off all appetizers during Happy Hour (4 PM - 7 PM M-F)",
          price: "$3 OFF"
        },
        {
          id: "happy-cocktails",
          name: "ALL COCKTAILS",
          description: "Get $3 off all cocktails during Happy Hour (4 PM - 7 PM M-F)",
          price: "$3 OFF"
        },
        {
          id: "happy-beer",
          name: "CANS OF BEER",
          description: "Special Happy Hour pricing on cans of beer (4 PM - 7 PM M-F)",
          price: 6
        },
        {
          id: "happy-wine",
          name: "GLASSES OF WINE",
          description: "Special Happy Hour pricing on glasses of wine (4 PM - 7 PM M-F)",
          price: 7
        }
      ]
    },
    {
      id: "house-favorites",
      title: "HOUSE FAVORITES",
      icon: Wine,
      story: SECTION_STORIES["DRINKS"],
      items: [
        {
          id: "iced-margarita",
          name: "ICED MARGATIRA",
          description: "Don Julio Blanco, Mango, Lime Juice, Chamoy, and Tajin",
          price: 17,
          image: ITEM_IMAGES["MARGARITA"]
        },
        {
          id: "iced-dona-70",
          name: "ICED DOÑA 70",
          description: "Don 70, Strawberry Syrup, Peach Syrup, Lime Juice",
          price: 22,
          image: ITEM_IMAGES["ICED DOÑA 70"]
        },
        {
          id: "iced-pina-colada",
          name: "ICED PINA COLADA",
          description: "Captain Morgan, Coconut Syrup, and Coconut Milk",
          price: 15,
          image: ITEM_IMAGES["ICED PINA COLADA"]
        },
        {
          id: "cantarito",
          name: "CANTARITO",
          description: "Herradura Blanco, Orange, Lime, and Salt",
          price: 12,
          image: ITEM_IMAGES["CANTARITO"]
        },
        {
          id: "paloma",
          name: "PALOMA",
          description: "Cazadores, Orange, Grape Fruit Juice, Lime, and Salt",
          price: 11,
          image: ITEM_IMAGES["PALOMA"]
        },
        {
          id: "pineapple-paradise",
          name: "PINEAPPLE PARADISE",
          description: "Grey Goose, Passion Fruit, and Pineapple",
          price: 11,
          image: ITEM_IMAGES["PINEAPPLE PARADISE"]
        },
        {
          id: "michelada",
          name: "MICHELADA",
          description: "Beer, Michelada Mix, and Fresh Lime",
          price: 12,
          image: ITEM_IMAGES["MICHELADA"]
        },
        {
          id: "bloody-mary",
          name: "BLOODY MARY",
          description: "Tito's, Bloody Mary Mix, Pickles, Banana Peppers, Olives, and Spices",
          price: 12,
          image: ITEM_IMAGES["BLOODY MARY"]
        },
        {
          id: "peachy-beachy",
          name: "PEACHY BEACHY",
          description: "Tito's, Champaign, and Peach syrup",
          price: 12,
          image: ITEM_IMAGES["PEACHY BEACHY"]
        },
        {
          id: "coconut-berry-dream",
          name: "COCONUT BERRY DREAM",
          description: "Vanilla Vodka, Huckleberry, Coconut, and Pineapple",
          price: 12,
          image: ITEM_IMAGES["COCONUT BERRY DREAM"]
        },
        {
          id: "mango-tamarindo",
          name: "MANGO TAMARINDO",
          description: "Spicy Tamarindo, Mango, and Pineapple",
          price: 12.50,
          image: ITEM_IMAGES["MANGO TAMARINDO"]
        }
      ]
    },
    {
      id: "martinis",
      title: "MARTINIS",
      icon: Glasses,
      items: [
        {
          id: "classic-martini",
          name: "CLASSIC MARTINI",
          description: "Gin, Vermouth, and Olive",
          price: 11
        },
        {
          id: "espresso-martini",
          name: "ESPRESSO MARTINI",
          description: "Espresso Shot and Kahlua",
          price: 11,
          image: ITEM_IMAGES["ESPRESSO"]
        },
        {
          id: "lemon-drop",
          name: "FRESH LEMON DROP",
          description: "Fresh Lemon Juice, Syrup, and Grey Goose",
          price: 11
        },
        {
          id: "lechera-espresso",
          name: "LECHERA ESPRESSO",
          description: "Kahlua, Bay Leaves, Condensed Milk, and Espresso Shot",
          price: 12
        },
        {
          id: "passion-fruit-drop",
          name: "PASSION FRUIT DROP",
          description: "Fresh Lemon Juice, Black Berry Syrup, and Grey Goose",
          price: 12
        }
      ]
    },
    {
      id: "boards",
      title: "BOARDS",
      icon: Wine,
      items: [
        {
          id: "mimosa-board",
          name: "MIMOSA BOARD",
          description: "Brut Champagne",
          options: ["CHOOSE TWO: Orange Juice, Cranberry Juice, Pineapple Juice"],
          note: "(Comes w/ 4 Glasses)",
          price: 19
        },
        {
          id: "margarita-board",
          name: "MARGATRIA BOARD",
          description: "Hornitos, Combier, Lime Juice, Fresh Fruit",
          options: ["(Pineapple, Mango, Coconut, and Watermelon)"],
          note: "(Comes w/ 4 Glasses)",
          price: 35
        }
      ]
    },
    {
      id: "flights",
      title: "FLIGHTS",
      icon: Glasses,
      items: [
        {
          id: "patron-flight",
          name: "Patron Flight",
          description: "Patron, Fresh lime juice, and Combier",
          options: ["CHOOSE FOUR: Strawberry, Watermelon, Mango, Peach, Passion Fruit, Raspberry, Prickly Pear, Pineapple, Guava, Kiwi, Blackberry, Coconut"],
          note: "(Comes w/ 4 Glasses)",
          price: 35
        }
      ]
    },
    {
      id: "towers",
      title: "TOWERS (88 OZ)",
      icon: Beer,
      items: [
        {
          id: "hustle-margarita",
          name: "HUSTLE MARGARITA",
          description: "Hornitos, Combier, Fresh Lime Juice, Blue Agave, and Salt",
          price: 50
        },
        {
          id: "texas-margarita",
          name: "TEXAS MARGARITA",
          description: "Patron, Fresh Lime Juice, Orange Juice, Combier, and Salt",
          price: 65
        }
      ],
      subSections: [
        {
          name: "BEER TOWERS...",
          items: [],
          pricing: "$27+",
          options: [
            "CHOOSE BEER: COORS, MODELO, NEGRA MODELO, CORONA, PACIFICO, HEFE, and CIDERS",
          ],
          icon: Beer,
        },
      ],
    },
    {
      id: "coffee",
      title: "COFFEE",
      icon: Coffee,
      story: SECTION_STORIES["COFFEE"],
      items: [
        {
          id: "espresso",
          name: "ESPRESSO",
          description: "Double shot of our house-blend espresso with a rich crema.",
          price: 3.99,
          vegetarian: true,
          vegan: true,
          glutenFree: true,
          image: ITEM_IMAGES["ESPRESSO"]
        },
        {
          id: "americano",
          name: "AMERICANO",
          description: "Double shot of espresso with hot water.",
          price: 4.50,
          vegetarian: true,
          vegan: true,
          glutenFree: true
        }
      ]
    }
  ]
}; 