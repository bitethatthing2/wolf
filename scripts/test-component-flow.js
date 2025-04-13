/**
 * Component Flow Test Script
 * 
 * This script verifies the component flow by checking the imports, dependencies,
 * and relationships between all main components of the website.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const projectRoot = path.join(__dirname, '..'); // Define project root relative to script

console.log('🔍 Analyzing component flow and relationships...');

// Main components to analyze (relative to project root)
const mainComponents = [
  'src/app/(main)/page.tsx',                              // Homepage
  'src/components/features/social/ElfsightInstagramFeed.tsx', // Old Instagram section
  'src/components/features/social/InstagramFeedSection.tsx', // New Instagram section
  'src/components/features/social/InstagramEmbed.tsx',    // Custom Instagram embed
  'src/components/features/social/ReservationSection.tsx', // Reservation section
  'src/components/features/social/GoogleReviewsSection.tsx', // Reviews section
  'src/components/features/install/AppInstallFlow.tsx',   // Install prompts
];

// Track component relationships
const relationships = {};
const importMap = {};

// Helper to extract imports from a file
function extractImports(content) {
  const imports = [];
  // Match both ESM imports
  const importRegex = /import\s+(?:(?:{[^}]+}|\*\s+as\s+[^,]+|[\w\d_$]+)(?:\s*,\s*(?:{[^}]+}|\*\s+as\s+[^,]+|[\w\d_$]+))*\s+from\s+)?['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  
  return imports;
}

// Process each file to build the dependency graph
mainComponents.forEach(componentPath => {
  const fullPath = path.join(projectRoot, componentPath); // Use projectRoot
  
  try {
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const imports = extractImports(content);
      
      // Map relative imports to full paths
      const resolvedImports = imports
        .filter(imp => imp.startsWith('@/') || imp.startsWith('./') || imp.startsWith('../'))
        .map(imp => {
          if (imp.startsWith('@/')) {
            // Handle alias imports (@/components/...)
            // Convert alias to path relative to project root
            return path.join('src', imp.substring(2)).replace(/\\/g, '/'); // Ensure forward slashes for consistency
          } else {
            // Handle relative imports
            const dirName = path.dirname(componentPath);
            // Resolve relative path and ensure it's relative to project root
            const resolved = path.resolve(projectRoot, dirName, imp).replace(/\\/g, '/');
            return path.relative(projectRoot, resolved).replace(/\\/g, '/'); // Ensure forward slashes
          }
        });
      
      importMap[componentPath] = resolvedImports;
    } else {
      console.warn(`⚠️  File not found: ${fullPath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${componentPath}:`, error);
  }
});

// Build relationship graph
Object.keys(importMap).forEach(component => {
  relationships[component] = {
    imports: importMap[component],
    importedBy: []
  };
});

// Populate 'importedBy' for each component
Object.keys(importMap).forEach(component => {
  importMap[component].forEach(imported => {
    // Handle extensions and potential matches
    const candidates = [
      imported,
      `${imported}.tsx`,
      `${imported}.ts`,
      `${imported}.jsx`,
      `${imported}.js`,
      `${imported}/index.tsx`,
      `${imported}/index.ts`,
    ];
    
    candidates.forEach(candidate => {
      if (relationships[candidate]) {
        relationships[candidate].importedBy.push(component);
      }
    });
  });
});

// Analyze component flow on the homepage
console.log('\n📊 Homepage Component Flow Analysis:');
const homepagePath = 'src/app/(main)/page.tsx'; // Relative to project root

try {
  const homepageFullPath = path.join(projectRoot, homepagePath); // Use projectRoot
  const homepageContent = fs.readFileSync(homepageFullPath, 'utf8');
  
  // Extract JSX component usage to determine rendering order
  const jsxComponentRegex = /<([A-Z][a-zA-Z0-9]*)(?:\s|\/|>)/g;
  const componentUsage = [];
  let matchJSX;
  
  while ((matchJSX = jsxComponentRegex.exec(homepageContent)) !== null) {
    const component = matchJSX[1];
    if (!['div', 'span', 'main', 'section', 'h1', 'h2', 'h3', 'p'].includes(component)) {
      componentUsage.push(component);
    }
  }
  
  console.log('📐 Component rendering order in homepage:');
  const uniqueComponents = [...new Set(componentUsage)];
  uniqueComponents.forEach((component, idx) => {
    console.log(`   ${idx + 1}. ${component}`);
  });
  
} catch (error) {
  console.error(`❌ Error analyzing homepage:`, error);
}

// Check if Instagram implementations match
console.log('\n🖼️  Instagram Implementation Analysis:');
const instagramFiles = [ // Relative to project root
  'src/components/features/social/ElfsightInstagramFeed.tsx',
  'src/components/features/social/InstagramFeedSection.tsx',
  'src/components/features/social/InstagramEmbed.tsx',
  'src/components/features/SideHustleInstagramFeed.tsx',
  'src/components/features/ElfsightWidget.tsx',
  'src/components/features/SmartElfsightWidget.tsx',
  'src/components/features/ElfsightMock.tsx',
];

// Check which implementation is used on the homepage
try {
  const homepageFullPath = path.join(projectRoot, 'src/app/(main)/page.tsx'); // Use projectRoot
  const homepageContent = fs.readFileSync(homepageFullPath, 'utf8');
  
  console.log('📱 Instagram components in use:');
  instagramFiles.forEach(file => {
    try {
      const componentName = path.basename(file, path.extname(file));
      const componentFullPath = path.join(projectRoot, file); // Use projectRoot
      if (fs.existsSync(componentFullPath)) { // Check if file exists before reading
        const content = fs.readFileSync(componentFullPath, 'utf8');
        
        // Check if component is imported in homepage
        const importRegex = new RegExp(`import\\s+(?:{[^}]*}|\\*\\s+as\\s+[^,]+|${componentName})\\s+from`, 'g');
        const isImported = importRegex.test(homepageContent);
        
        // Check if component is used in JSX
        const jsxRegex = new RegExp(`<${componentName}[\\s/>]`, 'g');
        const isUsed = jsxRegex.test(homepageContent);
        
        console.log(`   ${componentName}: ${isImported ? '✅ imported' : '❌ not imported'}, ${isUsed ? '✅ used' : '❌ not used'}`);
        
        // If using ElfsightInstagramFeed, check if it uses InstagramEmbed or Elfsight
        if (componentName === 'ElfsightInstagramFeed' || componentName === 'InstagramFeedSection') {
          if (content.includes('import InstagramEmbed from')) {
            console.log('      └─ ℹ️  Uses our custom InstagramEmbed implementation');
          } 
          if (content.includes('import { ElfsightWidget }') || content.includes('from \'next-elfsight-widget\'')) {
            console.log('      └─ ℹ️  Uses Elfsight widget');
          }
        }
      } else {
         console.warn(`   ⚠️ Could not find file for analysis: ${file}`);
      }
    } catch (error) {
      // Log specific error for this file
      console.warn(`   ⚠️ Error analyzing ${file}: ${error.message}`);
    }
  });
  
} catch (error) {
  console.error('❌ Error analyzing Instagram implementation:', error);
}

// Analyze notification implementation
console.log('\n🔔 Push Notification System Analysis:');
try {
  const swPath = path.join(projectRoot, 'public/firebase-messaging-sw.js'); // Use projectRoot
  if (fs.existsSync(swPath)) { // Check if service worker exists
    const serviceWorker = fs.readFileSync(swPath, 'utf8');
    const version = serviceWorker.match(/SW_VERSION = ['"]([^'"]+)['"]/);
    console.log(`   Service Worker Version: ${version ? version[1] : 'unknown'}`);
    
    // Check for platform-specific handling
    if (serviceWorker.includes('isAndroid') || serviceWorker.includes('isIOS')) {
      console.log('   ✅ Has platform-specific notification handling');
    } else {
      console.log('   ⚠️ No platform-specific notification handling detected');
    }
    
    // Check notification icon directory
    const iconsPath = path.join(projectRoot, 'public/only_these'); // Use projectRoot
    if (fs.existsSync(iconsPath)) {
      console.log('   ✅ Notification icons directory exists');
      
      const iosPath = path.join(iconsPath, 'ios');
      const androidPath = path.join(iconsPath, 'android');
      
      if (fs.existsSync(iosPath)) {
        console.log('   ✅ iOS icons directory exists');
      } else {
        console.log('   ⚠️ Missing iOS icons directory');
      }
      
      if (fs.existsSync(androidPath)) {
        console.log('   ✅ Android icons directory exists');
      } else {
        console.log('   ⚠️ Missing Android icons directory');
      }
    } else {
      console.log('   ⚠️ Notification icons directory not found: public/only_these');
    }
  } else {
    console.warn('   ⚠️ Service worker file not found: public/firebase-messaging-sw.js');
  }
  
} catch (error) {
  console.error('❌ Error analyzing notification system:', error);
}

// Check reservation section integration
console.log('\n📅 Reservation System Analysis:');
try {
  const reservationSectionPath = path.join(projectRoot, 'src/components/features/social/ReservationSection.tsx'); // Use projectRoot
  if (fs.existsSync(reservationSectionPath)) { // Check if file exists before reading
    const reservationSection = fs.readFileSync(reservationSectionPath, 'utf8');
    
    // Check form types
    const formTypes = reservationSection.match(/\[formType, setFormType\] = useState<'([^']+)'.*?>\('([^']+)'\)/);
    if (formTypes) {
      console.log(`   Form types: ${formTypes[1].split('|').join(', ')}`);
      console.log(`   Default form: ${formTypes[2]}`);
    }
    
    // Check contact info
    const phoneMatch = reservationSection.match(/href="tel:([^"]+)"/);
    const emailMatch = reservationSection.match(/href="mailto:([^"]+)"/);
    
    console.log(`   Phone: ${phoneMatch ? phoneMatch[1] : 'Not found'}`);
    console.log(`   Email: ${emailMatch ? emailMatch[1] : 'Not found'}`);
    
    // Check if it uses Framer Motion
    if (reservationSection.includes('from "framer-motion"')) {
      console.log('   ✅ Uses Framer Motion for animations');
    }
  } else {
    console.warn('   ⚠️ Reservation section file not found: src/components/features/social/ReservationSection.tsx');
  }
} catch (error) {
  console.error('❌ Error analyzing reservation section:', error);
}

console.log('\n✅ Component flow analysis complete!');