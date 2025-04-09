const https = require('https');
const fs = require('fs');
const path = require('path');

// Icon mappings with their Phosphor Icons names
const icons = {
  category: {
    'smallbites': 'fork-knife',
    'main': 'hamburger',
    'birria': 'flame',
    'seafood': 'fish',
    'wings': 'chicken',
    'breakfast': 'sun-horizon',
    'sauces': 'drop',
    'drinks': 'wine',
    'martinis': 'martini',
    'boards': 'squares-four',
    'flights': 'airplane',
    'towers': 'tower'
  },
  food: {
    'chips-guac': 'corn',
    'fries': 'french-fries',
    'loaded-fries': 'french-fries',
    'tots': 'potato',
    'flautas': 'scroll',
    'tacos': 'taco',
    'burrito': 'wrap',
    'mulitas': 'stack',
    'torta': 'bread',
    'bowl': 'bowl-food',
    'quesadilla': 'circle-half',
    'vampiros': 'moon',
    'empanadas': 'pie',
    'salad': 'leaf',
    'pizza': 'pizza',
    'ramen': 'bowl-hot',
    'fish': 'fish-simple',
    'shrimp': 'shrimp'
  },
  drink: {
    'margarita': 'glass',
    'cocktail': 'cocktail',
    'beer': 'beer-bottle',
    'coffee': 'coffee',
    'mimosa': 'champagne',
    'wine': 'wine'
  }
};

// Function to download an icon
function downloadIcon(iconName, type, fileName) {
  const url = `https://raw.githubusercontent.com/phosphor-icons/phosphor-icons/master/assets/${iconName}.svg`;
  const dir = path.join(__dirname, '..', 'src', 'assets', 'icons', 'menu', `${type}s`);
  const filePath = path.join(dir, `icon_menu_${type}_${fileName}.svg`);

  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Download the icon
  https.get(url, (response) => {
    if (response.statusCode === 200) {
      const file = fs.createWriteStream(filePath);
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filePath}`);
      });
    } else {
      console.error(`Failed to download: ${url}`);
    }
  }).on('error', (err) => {
    console.error(`Error downloading ${url}: ${err.message}`);
  });
}

// Download all icons
Object.entries(icons).forEach(([type, typeIcons]) => {
  Object.entries(typeIcons).forEach(([fileName, iconName]) => {
    downloadIcon(iconName, type, fileName);
  });
});
