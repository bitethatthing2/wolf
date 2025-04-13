/**
 * Icon Usage Analysis Script
 * 
 * This script analyzes the codebase to find where icons and images are used,
 * creating a detailed report of image references.
 * 
 * Run with:
 * node scripts/analyze-icon-usage.js
 */

const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

// Directories to scan
const DIRS_TO_SCAN = ['src', 'public'];

// File extensions to analyze
const FILE_EXTENSIONS = ['.tsx', '.ts', '.js', '.jsx', '.css', '.scss'];

// Output file
const OUTPUT_FILE = 'docs/icon-usage-report.md';

// Types of image references to look for
const IMAGE_PATTERNS = [
  { pattern: 'src=[\'"](.*?)[\'"\\]]', description: 'src attribute' },
  { pattern: '\\.src\\s*=\\s*[\'"](.*?)[\'"\\]]', description: 'src property' },
  { pattern: 'image:\\s*[\'"](.*?)[\'"\\]]', description: 'image property' },
  { pattern: 'from\\s*[\'"](.*/icons/.*?)[\'"\\]]', description: 'icon import' },
  { pattern: 'url\\([\'"]?(.*?)[\'"]?\\)', description: 'CSS url()' },
  { pattern: 'backgroundImage:\\s*[\'"](.*?)[\'"\\]]', description: 'backgroundImage property' },
];

// Function to get all image files in public directory
function getImageFiles() {
  console.log('Getting list of image files...');

  // Use glob.sync for cross-platform file searching
  const imagePattern = '../{public,src}/**/*.{png,jpg,jpeg,svg,webp,gif,ico}';
  const imageFiles = globSync(imagePattern, { nodir: true, windowsPathsNoEscape: true });

  // Normalize paths (remove ../, use forward slashes) relative to project root
  return imageFiles
    .map(file => '/' + path.relative('..', file).replace(/\\/g, '/'))
    .filter(Boolean)
    .sort();
}

// Function to scan files for image references
function findImageReferences() {
  console.log('Scanning files for image references...');

  const references = {};

  // Use glob.sync to get the list of files to scan
  const codeFilePattern = `../{${DIRS_TO_SCAN.join(',')}}/**/*.{${FILE_EXTENSIONS.map(ext => ext.substring(1)).join(',')}}`;
  const files = globSync(codeFilePattern, {
      nodir: true,
      windowsPathsNoEscape: true,
      ignore: ['../node_modules/**', '../.next/**'] // Add ignore patterns
  });

  // Process each file
  files.forEach(file => {
    // Normalize file path for reporting
    const relativeFile = '/' + path.relative('..', file).replace(/\\/g, '/');
    try {
      const content = fs.readFileSync(file, 'utf8');

      // Check for image references using the patterns
      IMAGE_PATTERNS.forEach(({ pattern, description }) => {
        const regex = new RegExp(pattern, 'g');
        let match;
        
        while ((match = regex.exec(content)) !== null) {
          const imagePath = match[1];
          
          // Skip data URLs, HTTP URLs, relative module imports, node_modules, and JS files
          if (imagePath.startsWith('data:') || 
              imagePath.startsWith('http') || 
              imagePath.startsWith('./') || 
              imagePath.startsWith('../') ||
              imagePath.includes('node_modules') ||
              imagePath.toLowerCase().endsWith('.js')) { 
            continue;
          }
          
          // Skip if path contains a variable
          if (imagePath.includes('${') || imagePath.includes('${}')) {
            continue;
          }
          
          // Skip if empty
          if (!imagePath.trim()) {
            continue;
          }
          
          // Format the image path
          const formattedPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
          
          // Add to references
          if (!references[formattedPath]) {
            references[formattedPath] = [];
          }
          
          references[formattedPath].push({
            file: relativeFile,
            type: description,
            context: getLineContext(content, match.index)
          });
        }
      });
    } catch (error) {
      // Handle potential errors reading files (e.g., permissions)
      console.error(`Error processing file ${relativeFile}: ${error.message}`);
    }
  });

  return references;
}

// Function to get context around a match
function getLineContext(content, index) {
  const lines = content.substring(0, index).split('\n');
  const lineNumber = lines.length;
  const line = lines[lines.length - 1] + content.substring(index).split('\n')[0];
  return { lineNumber, line: line.trim() };
}

// Function to generate the report
function generateReport(imageFiles, references) {
  console.log('Generating report...');
  
  const imageFileSet = new Set(imageFiles);
  const referencedImages = new Set(Object.keys(references));
  
  const unreferencedImages = [...imageFileSet].filter(img => !referencedImages.has(img));
  const missingImages = [...referencedImages].filter(img => !imageFileSet.has(img) && !img.includes('*'));
  
  let report = `# Icon and Image Usage Report\n\n`;
  report += `Generated on: ${new Date().toISOString().split('T')[0]}\n\n`;
  
  // Summary section
  report += `## Summary\n\n`;
  report += `- Total image files: ${imageFiles.length}\n`;
  report += `- Referenced images: ${referencedImages.size}\n`;
  report += `- Unreferenced images: ${unreferencedImages.length}\n`;
  report += `- Missing references: ${missingImages.length}\n\n`;
  
  // Unreferenced images section
  report += `## Unreferenced Images\n\n`;
  if (unreferencedImages.length > 0) {
    report += `The following images exist in the codebase but are not referenced:\n\n`;
    report += `| Image Path |\n|------------|\n`;
    unreferencedImages.forEach(img => {
      report += `| ${img} |\n`;
    });
  } else {
    report += `All images are referenced in the codebase.\n`;
  }
  report += `\n`;
  
  // Missing images section
  report += `## Missing Images\n\n`;
  if (missingImages.length > 0) {
    report += `The following images are referenced but don't exist in the codebase:\n\n`;
    report += `| Image Path | Referenced In |\n|------------|---------------|\n`;
    missingImages.forEach(img => {
      const refs = references[img].map(r => r.file).join(', ');
      report += `| ${img} | ${refs} |\n`;
    });
  } else {
    report += `All referenced images exist in the codebase.\n`;
  }
  report += `\n`;
  
  // Referenced images section
  report += `## Image References\n\n`;
  report += `| Image | Referenced In | Type | Line |\n|-------|--------------|------|------|\n`;
  
  Object.entries(references)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([image, refs]) => {
      const exists = imageFileSet.has(image) ? '✅' : '❌';
      refs.forEach(ref => {
        report += `| ${exists} ${image} | ${ref.file} | ${ref.type} | ${ref.context.lineNumber} |\n`;
      });
    });
  
  return report;
}

// Main function
function main() {
  console.log('Starting icon usage analysis...');
  
  // Get all image files
  const imageFiles = getImageFiles();
  console.log(`Found ${imageFiles.length} image files.`);
  
  // Find references to images
  const references = findImageReferences();
  console.log(`Found references to ${Object.keys(references).length} unique images.`);
  
  // Generate the report
  const report = generateReport(imageFiles, references);
  
  // Write the report
  // Adjusted output path to be relative to the script's location
  fs.writeFileSync(`../${OUTPUT_FILE}`, report);
  console.log(`Report generated at ${OUTPUT_FILE} in the project root.`);
}

// Run the main function
main();