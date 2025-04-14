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
  "ICED HUSTLE MARGARITA": "/assets/foodmenu/iced-hustle-margarita.png",
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
          description: "Fresh tortilla chips made in-house from hand-pressed corn tortillas, served with our signature guacamole prepared daily using ripe avocados, lime, and a hint of jalapeño. A taste of authentic Mexican tradition.",
          price: 8.00,
          popular: true,
          vegetarian: true,
          image: ITEM_IMAGES["CHIPS & GUAC"],
          dietary: ["Made without gluten"]
        },
        {
          id: "fries",
          name: "BASKET OF FRIES",
          description: "Hand-cut potatoes double-fried to golden perfection, tossed in our signature seasoning blend of smoky paprika, garlic, and herbs. Served piping hot with your choice of dipping sauce.",
          price: 7.00,
          vegetarian: true,
          vegan: true,
          image: ITEM_IMAGES["BASKET OF FRIES"]
        },
        {
          id: "tots",
          name: "BASKET OF TOTS",
          description: "Premium tater tots with a crispy exterior and fluffy interior, seasoned with our house spice blend and fried to golden perfection. Comfort food elevated to new heights.",
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
          description: "Crispy rolled corn tortillas filled with seasoned potatoes and slow-cooked carnitas, deep-fried until golden and topped with fresh crema. A perfect blend of textures in every bite.",
          price: 12.00,
          image: ITEM_IMAGES["FLAUTAS"]
        },
        {
          id: "loaded-fries",
          name: "LOADED FRIES",
          description: "Our signature fries topped with melted nacho cheese, fresh pico de gallo, jalapeños, house-made guac sauce, chipotle, cotija cheese, and sour cream. Served with your choice of protein.",
          price: 14.00,
          image: ITEM_IMAGES["LOADED FRIES"]
        },
        {
          id: "loaded-nacho",
          name: "LOADED NACHO",
          description: "Crispy tortilla chips layered with nacho cheese, pico de gallo, jalapeños, guac sauce, chipotle, cotija cheese, and sour cream. Customizable with your favorite protein for the ultimate nacho experience.",
          price: 14.00,
          image: ITEM_IMAGES["LOADED NACHO"]
        },
        {
          id: "burrito",
          name: "BURRITO",
          description: "Hand-rolled flour tortilla stuffed with seasoned beans, Mexican rice, fresh cilantro, onions, house-made guac and chipotle sauces, and crunchy tortilla chips. Custom-made with your choice of protein.",
          price: 12.00,
          image: ITEM_IMAGES["BURRITO"]
        },
        {
          id: "tacos",
          name: "TACOS",
          description: "Each taco begins with our hand-made corn tortillas, pressed daily in-house. We nixtamalize traditional corn using ancestral techniques, from masa to fresh tortilla each morning. Topped with your choice of protein, onions, cilantro, and house-made salsas that complement each unique filling.",
          price: 3.75,
          glutenFree: true,
          image: ITEM_IMAGES["TACOS"]
        },
        {
          id: "mulitas",
          name: "MULITAS",
          description: "Traditional Mexican sandwich made with corn tortillas, melted Oaxaca cheese, fresh cilantro, onions, and our house-made guac sauce. Served with your choice of perfectly seasoned protein.",
          price: 7.75,
          image: ITEM_IMAGES["MULITAS"]
        },
        {
          id: "torta",
          name: "TORTA",
          description: "Mexican sandwich served on authentic telera bread, picked up daily from our local Mexican bakery. The soft, slightly sweet bread provides the perfect foundation for Oaxaca cheese, beans, fresh vegetables, avocado, jalapeños, and our signature sauces. We partner with local Mexican bakers to ensure the most authentic experience.",
          price: 13.50,
          image: ITEM_IMAGES["TORTA"]
        },
        {
          id: "hustle-bowl",
          name: "HUSTLE BOWL",
          description: "A hearty bowl featuring seasoned beans, Mexican rice, fresh lettuce, house-made pico de gallo, jalapeños, sour cream, guac sauce, cotija cheese, and crispy tortilla chips. Choose your favorite protein to complete this flavor-packed meal.",
          price: 15.00,
          image: ITEM_IMAGES["HUSTLE BOWL"]
        },
        {
          id: "queso-tacos",
          name: "QUESO TACOS",
          description: "From the first bite of our freshly pressed tortillas to the last morsel of perfectly seasoned filling. Our nixtamalized corn tortillas are grilled with melted Oaxaca cheese, topped with your choice of protein, fresh onions, and cilantro. Every element creates an unforgettable authentic flavor experience.",
          price: 5.75,
          glutenFree: true,
          image: ITEM_IMAGES["QUESO TACOS"]
        },
        {
          id: "quesadilla",
          name: "QUESADILLA",
          description: "Large flour tortilla filled with melted Oaxaca cheese and your choice of protein, grilled to perfection and served with our house-made guac sauce. Simple, satisfying, and absolutely delicious.",
          price: 14.00,
          image: ITEM_IMAGES["QUESADILLA"]
        },
        {
          id: "vampiros",
          name: "VAMPIROS",
          description: "Crispy corn tortillas topped with melted Oaxaca cheese, fresh house-made guacamole, and your choice of protein. A popular Mexican street food with the perfect balance of crunch and flavor.",
          price: 7.75,
          image: ITEM_IMAGES["VAMPIROS"]
        },
        {
          id: "empanadas",
          name: "EMPANADAS",
          description: "Handcrafted flour pastries filled with Oaxaca cheese and your choice of protein, fried until golden and crispy. Served with sour cream, guac sauce, and fresh lettuce for a delightful contrast of textures.",
          price: 7.00,
          image: ITEM_IMAGES["EMPANADAS"]
        },
        {
          id: "taco-salad",
          name: "TACO SALAD",
          description: "Crispy flour tortilla bowl filled with fresh lettuce, pico de gallo, cilantro, sour cream, and cotija cheese. Topped with your choice of protein for a refreshing yet satisfying meal with Mexican flair.",
          price: 14.00,
          image: ITEM_IMAGES["TACO SALAD"]
        }
      ]
    },
    {
      id: "birria",
      title: "BIRRIA (ALL BIRRIA ITEMS COME WITH CONSOMÉ)",
      icon: Beef,
      items: [
        {
          id: "birria-queso-tacos",
          name: "BIRRIA QUESO TACOS",
          description: "Each taco begins with our hand-made corn tortillas, pressed daily in-house and dipped in rich birria consomé. The process from masa to tortilla happens fresh each morning. Filled with slow-cooked beef birria, melted Oaxaca cheese, fresh onions, and cilantro. Every element creates an unforgettable authentic flavor experience.",
          price: 16.75,
          image: ITEM_IMAGES["BIRRIA QUESO TACOS"]
        },
        {
          id: "birria-pizza",
          name: "BIRRIA PIZZA",
          description: "Our signature dish featuring two large flour tortillas layered with tender birria beef, melted Oaxaca cheese, fresh cilantro, and onions. Served with rich consomé for the ultimate flavor experience.",
          price: 29.00,
          image: ITEM_IMAGES["BIRRIA PIZZA"]
        },
        {
          id: "birria-ramen",
          name: "BIRRIA RAMEN BOWL",
          description: "A fusion masterpiece combining traditional birria consomé with authentic Tapatio noodles, tender birria beef, fresh cilantro, and onions. A unique blend of Mexican and Japanese culinary traditions.",
          price: 14.75,
          image: ITEM_IMAGES["BIRRIA RAMEN BOWL"]
        },
        {
          id: "birria-flautas",
          name: "BIRRIA FLAUTAS",
          description: "Crispy corn tortillas rolled and filled with our signature slow-cooked birria beef, deep-fried to perfection and served with consomé. A crunchy exterior gives way to tender, flavorful meat.",
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
          description: "Each taco begins with our hand-made corn tortillas, pressed daily in-house. Filled with crispy beer-battered white fish, topped with fresh onions, crunchy cabbage, and house-made salsas that complement the seafood perfectly. From the first bite to the last, an unforgettable authentic coastal flavor experience.",
          price: 8.75,
          image: ITEM_IMAGES["FRIED FISH TACOS"]
        },
        {
          id: "shrimp-tacos",
          name: "FRIED SHRIMP TACOS (2)",
          description: "Served on our nixtamalized corn tortillas made using ancestral techniques. Golden-fried jumbo shrimp topped with crisp onions, cabbage, our signature chipotle sauce, and melted cheese. Every element creates an unforgettable authentic Mexican seafood experience from the first bite to the last.",
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
          description: "Morning favorite featuring a warm flour tortilla filled with fluffy scrambled eggs, grilled asada steak, crispy bacon, golden tater tots, sour cream, and our signature guac sauce. The perfect breakfast on the go.",
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
          description: "Tender marinated beef steak grilled to perfection with a blend of Mexican spices and citrus notes.",
          price: 2.00
        },
        {
          id: "birria-beef",
          name: "BIRRIA (BEEF)",
          description: "Slow-cooked beef simmered in a rich broth of chilies and spices until melt-in-your-mouth tender.",
          price: 2.00
        },
        {
          id: "al-pastor",
          name: "AL PASTOR (PORK)",
          description: "Spit-roasted pork marinated in achiote paste, pineapple, and traditional Mexican spices.",
          price: 2.00
        },
        {
          id: "carnitas",
          name: "CARNITAS (PORK)",
          description: "Pork shoulder slow-cooked until tender, then lightly crisped for the perfect texture balance.",
          price: 2.00
        },
        {
          id: "chorizo",
          name: "CHORIZO (PORK)",
          description: "Flavorful Mexican sausage seasoned with paprika, garlic, and regional spices.",
          price: 2.00
        },
        {
          id: "pollo",
          name: "POLLO (CHICKEN)",
          description: "Juicy chicken marinated in a blend of citrus juices and Mexican herbs, then grilled to perfection.",
          price: 2.00
        },
        {
          id: "veggies",
          name: "VEGGIES",
          description: "Seasonal vegetables sautéed with traditional Mexican spices and a hint of lime.",
          price: 2.00,
          vegetarian: true
        },
        {
          id: "lengua",
          name: "LENGUA",
          description: "Tender beef tongue slow-cooked with garlic, bay leaves, and Mexican spices - a traditional delicacy.",
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
          name: "ICED MARGARITA",
          description: "Premium Don Julio Blanco tequila shaken with fresh-squeezed lime juice, ripe mango, tangy chamoy, and a signature Tajin rim. A refreshing blend of sweet, spicy, and citrus notes in every sip.",
          price: 17,
          image: ITEM_IMAGES["MARGARITA"]
        },
        {
          id: "iced-hustle-margarita",
          name: "ICED HUSTLE MARGARITA",
          description: "Our signature margarita featuring house-infused jalapeño tequila, fresh lime juice, agave nectar, and a splash of orange liqueur. Served over ice with a Tajin-salt rim for the perfect balance of heat and sweet.",
          price: 18,
          popular: true,
          image: ITEM_IMAGES["ICED HUSTLE MARGARITA"] || ITEM_IMAGES["MARGARITA"]
        },
        {
          id: "iced-dona-70",
          name: "ICED DOÑA 70",
          description: "Exclusive Don Julio 70 tequila mixed with house-made strawberry and peach syrups, fresh lime juice, and a touch of agave. An elegant, smooth cocktail with perfect fruit balance and premium tequila notes.",
          price: 22,
          image: ITEM_IMAGES["ICED DOÑA 70"]
        },
        {
          id: "iced-pina-colada",
          name: "ICED PINA COLADA",
          description: "Smooth Captain Morgan rum blended with house-made coconut syrup, creamy coconut milk, and fresh pineapple juice. A tropical vacation in a glass with the perfect balance of sweet and creamy.",
          price: 15,
          image: ITEM_IMAGES["ICED PINA COLADA"]
        },
        {
          id: "cantarito",
          name: "CANTARITO",
          description: "Smooth Herradura Blanco tequila combined with freshly squeezed orange and lime juices, topped with a salt rim. Served in a traditional clay cup that enhances the flavor with each sip - a taste of authentic Mexico.",
          price: 12,
          image: ITEM_IMAGES["CANTARITO"]
        },
        {
          id: "paloma",
          name: "PALOMA",
          description: "Premium Cazadores tequila mixed with fresh orange, tangy grapefruit juice, lime squeeze, and a hint of salt. A perfectly balanced, refreshing cocktail that's simultaneously sweet, tart, and subtly bitter.",
          price: 11,
          image: ITEM_IMAGES["PALOMA"]
        },
        {
          id: "pineapple-paradise",
          name: "PINEAPPLE PARADISE",
          description: "Smooth Grey Goose vodka infused with tropical passion fruit and fresh pineapple juice. Every sip transports you to a beachside paradise with the perfect balance of sweet and tangy tropical flavors.",
          price: 11,
          image: ITEM_IMAGES["PINEAPPLE PARADISE"]
        },
        {
          id: "michelada",
          name: "MICHELADA",
          description: "Your choice of crisp Mexican beer enhanced with our house-made michelada mix featuring tomato, lime, spices, and a touch of heat. Served with a salted rim and fresh lime for the ultimate refreshing beer cocktail.",
          price: 12,
          image: ITEM_IMAGES["MICHELADA"]
        },
        {
          id: "bloody-mary",
          name: "BLOODY MARY",
          description: "Premium Tito's vodka mixed with our signature spicy Bloody Mary blend, garnished with house-pickled vegetables, banana peppers, olives, and a proprietary spice blend. The perfect savory cocktail with a kick.",
          price: 12,
          image: ITEM_IMAGES["BLOODY MARY"]
        },
        {
          id: "peachy-beachy",
          name: "PEACHY BEACHY",
          description: "Crisp Tito's vodka complemented by effervescent champagne and house-made peach syrup. A light, fruity cocktail with subtle sweetness and elegant bubbles - perfect for celebrations or sunny afternoons.",
          price: 12,
          image: ITEM_IMAGES["PEACHY BEACHY"]
        },
        {
          id: "coconut-berry-dream",
          name: "COCONUT BERRY DREAM",
          description: "Smooth vanilla vodka shaken with tart huckleberry purée, creamy coconut, and fresh pineapple juice. A luxurious, tropical cocktail that perfectly balances berry tanginess with coconut sweetness.",
          price: 12,
          image: ITEM_IMAGES["COCONUT BERRY DREAM"]
        },
        {
          id: "mango-tamarindo",
          name: "MANGO TAMARINDO",
          description: "Our house-made spicy tamarind infusion combined with sweet mango purée and refreshing pineapple juice. A non-alcoholic option that delivers complex sweet, sour, and spicy notes in perfect harmony.",
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
          description: "A timeless cocktail featuring premium London dry gin, a whisper of dry vermouth, stirred to perfection and garnished with hand-stuffed olives. Served ice-cold with a silky-smooth texture and clean, botanical finish.",
          price: 11
        },
        {
          id: "espresso-martini",
          name: "ESPRESSO MARTINI",
          description: "Freshly pulled espresso shot combined with smooth Kahlua coffee liqueur and premium vodka. Shaken to create a velvety foam and served in a chilled martini glass for the perfect after-dinner pick-me-up.",
          price: 11,
          image: ITEM_IMAGES["ESPRESSO"]
        },
        {
          id: "lemon-drop",
          name: "FRESH LEMON DROP",
          description: "Handcrafted with freshly squeezed lemon juice, house-made simple syrup, and premium Grey Goose vodka. Shaken and served with a sugar rim for the perfect balance of sweet and sour in every sip.",
          price: 11
        },
        {
          id: "lechera-espresso",
          name: "LECHERA ESPRESSO",
          description: "A Mexican-inspired martini featuring rich Kahlua, aromatic bay leaves, sweet condensed milk, and a shot of our freshly pulled espresso. A creamy, indulgent cocktail with complex coffee notes and silky texture.",
          price: 12
        },
        {
          id: "passion-fruit-drop",
          name: "PASSION FRUIT DROP",
          description: "Tangy fresh-squeezed lemon juice, house-made blackberry syrup, tropical passion fruit, and smooth Grey Goose vodka. A vibrant, fruity martini with the perfect balance of sweet and tart flavors.",
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
          description: "Premium Brut Champagne served with your choice of two fresh-pressed juices for the perfect DIY mimosa experience. Each board comes with a bottle of chilled champagne and carafes of your selected juices.",
          options: ["CHOOSE TWO: Fresh-Squeezed Orange Juice, Premium Cranberry Juice, House-Made Pineapple Juice"],
          note: "Comes with 4 Champagne Flutes - Perfect for sharing!",
          price: 19,
          popular: true
        },
        {
          id: "margarita-board",
          name: "MARGARITA BOARD",
          description: "Premium Hornitos tequila, Combier orange liqueur, fresh-squeezed lime juice, and an array of tropical fruit purees. A DIY margarita experience with everything needed to craft your perfect cocktail.",
          options: ["Includes fresh fruit purees: Pineapple, Mango, Coconut, and Watermelon"],
          note: "Comes with 4 Salt-Rimmed Glasses - Great for groups!",
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
          name: "PATRON FLIGHT",
          description: "Premium Patron Silver tequila paired with fresh-squeezed lime juice and Combier orange liqueur. Customize your tasting experience with four different fruit-infused variations to explore the versatility of top-shelf tequila.",
          options: ["CHOOSE FOUR FLAVORS: Strawberry, Watermelon, Mango, Peach, Passion Fruit, Raspberry, Prickly Pear, Pineapple, Guava, Kiwi, Blackberry, Coconut"],
          note: "Served with 4 Tasting Glasses and Fresh Garnishes",
          price: 35,
          popular: true
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
          name: "HUSTLE MARGARITA TOWER",
          description: "Our signature house margarita scaled up for the ultimate group experience. Premium Hornitos tequila, Combier orange liqueur, fresh-squeezed lime juice, blue agave nectar, and salt. An impressive 88oz tower that keeps your margaritas flowing all night.",
          price: 50,
          popular: true
        },
        {
          id: "texas-margarita",
          name: "TEXAS MARGARITA TOWER",
          description: "Top-shelf Patron Silver tequila combined with fresh-squeezed lime juice, orange juice, Combier orange liqueur, and salt. A premium 88oz tower experience that delivers the perfect blend of citrus and smooth tequila for your entire table.",
          price: 65
        }
      ],
      subSections: [
        {
          name: "BEER TOWERS",
          items: [],
          pricing: "$27+",
          options: [
            "CHOOSE YOUR BEER: COORS LIGHT, MODELO ESPECIAL, NEGRA MODELO, CORONA, PACIFICO, HEFEWEIZEN, or SEASONAL CIDERS",
          ],
          icon: Beer,
          description: "88oz tower of your favorite beer, kept cold and ready to pour. Perfect for sharing with friends and keeping the good times flowing. Choose from our selection of domestic and imported options."
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
          description: "Double shot of our signature house-blend espresso, locally roasted and ground fresh for each order. Features notes of dark chocolate, cherry, and a hint of caramel with a perfect crema on top.",
          price: 3.99,
          vegetarian: true,
          vegan: true,
          glutenFree: true,
          image: ITEM_IMAGES["ESPRESSO"]
        },
        {
          id: "americano",
          name: "AMERICANO",
          description: "Double shot of our locally-roasted espresso carefully diluted with hot water to create a rich, full-bodied coffee with the perfect balance of strength and smoothness. Served at the ideal temperature to highlight the complex flavor notes.",
          price: 4.50,
          vegetarian: true,
          vegan: true,
          glutenFree: true
        },
        {
          id: "mexican-mocha",
          name: "MEXICAN MOCHA",
          description: "Our signature espresso blended with steamed milk, rich chocolate, a hint of cinnamon, and a touch of ancho chile for subtle warmth. Topped with whipped cream and a dash of cinnamon for a uniquely Mexican twist on a classic.",
          price: 5.50,
          vegetarian: true
        }
      ]
    }
  ]
}; 