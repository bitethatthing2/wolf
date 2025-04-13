/**
 * Image Renaming Script
 * 
 * This script assists with renaming image files according to the new naming convention
 * and updating references in the codebase.
 * 
 * To use:
 * 1. Run `node scripts/rename-images.js --dry-run` to preview changes
 * 2. Run `node scripts/rename-images.js` to execute the renaming
 */

const fs = require('fs');
const path = require('path');
const { globSync } = require('glob');

// Define base directory relative to the script location
const projectRoot = path.join(__dirname, '..');
const publicDir = path.join(projectRoot, 'public');
const srcDir = path.join(projectRoot, 'src');

// Map of current file paths (relative to project root) to new names (relative to project root)
const renameMap = {
  // App Icons and Installation Images
  '/public/wolf_girl.png': '/public/homepage-chef-icon.png',
  '/public/apple_icon_install_white.png': '/public/app-install-ios-dark.png',
  '/public/ios_pwa_install-black.png': '/public/app-install-ios-light.png',
  '/public/android-installation-guide-white.png.png': '/public/app-install-android-dark.png', // Note potential double .png
  '/public/android_installation_guide-black.png': '/public/app-install-android-light.png',
  '/public/share-ios.png': '/public/ios-share-button.png',
  '/public/ios-add-homescreen.png': '/public/ios-add-homescreen-screenshot.png',

  // Navigation & UI Icons
  '/public/wolf-icon-black.png': '/public/logo-main-light.png',
  '/public/wolf-icon-white.png': '/public/logo-main-dark.png',
  '/public/wolf-light-white.png': '/public/logo-footer-dark.png',
  '/public/main-menu-icon-black.png': '/public/nav-menu-light.png',
  '/public/main-menu-icon-white.png': '/public/nav-menu-dark.png',
  '/public/nav-bar-sidehustle-white.png': '/public/nav-header-dark.png',
  '/public/nav-bar-sidehustle-dark.png': '/public/nav-header-light.png',

  // Food & Menu Images
  '/public/loaded_frys.png': '/public/menu-item-loaded-fries.png',
  '/public/loaded_nacho.png': '/public/menu-item-loaded-nachos.png',
  '/public/flautas_potatoes.png': '/public/menu-item-flautas-potatoes.png',
  '/public/basket_fry.png': '/public/menu-item-basket-fries.png',
  '/public/basket_tots.png': '/public/menu-item-basket-tots.png',
  '/public/chips_guac.png': '/public/menu-item-chips-guac.png',

  // Blog Images
  '/public/flour-tortillas-at-home-blog-image.png': '/public/blog-flour-tortillas.png',
  '/public/guacamole-blog-image.png': '/public/blog-guacamole.png',
  '/public/make-elote-at-home-blog-image.png': '/public/blog-make-elote.png',
  '/public/perfect-salsa-verde-blog.png': '/public/blog-salsa-verde.png',
  '/public/secrets-mexican-chef-blog.png': '/public/blog-mexican-chef-secrets.png',
  '/public/tacos-barria-blog-image.png': '/public/blog-tacos-birria.png',

  // Event Images
  '/public/hustle_jam_event.png': '/public/event-hustle-jam.png',
  '/public/img_placeholder_event_default.jpg': '/public/event-placeholder-default.jpg',

  // Delivery Service Icons
  '/public/darkdoordash_icon.png': '/public/delivery-doordash-dark.png',
  '/public/doordash_icon-light.png': '/public/delivery-doordash-light.png',
  '/public/postmates-black-icon.png': '/public/delivery-postmates-light.png',
  '/public/postmates-icon-white.png': '/public/delivery-postmates-dark.png',
  '/public/uber eats.png': '/public/delivery-ubereats-light.png', // Note space in filename
  '/public/uber_eats-dark.png': '/public/delivery-ubereats-dark.png',

  // Notification Icons (Adjust paths if they are not directly in public)
  '/public/only_these/android/android-launchericon-96-96.png': '/public/only_these/notification-icon-android.png',
  '/public/only_these/ios/apple-icon-180x180.png': '/public/only_these/notification-icon-ios.png',
  '/public/only_these/android-icon-96x96.png': '/public/only_these/notification-badge.png',
  '/public/enable-notifications-dark.png': '/public/notification-enable-dark.png',
  '/public/enable-notifications-light-screen.png': '/public/notification-enable-light.png',
};

// Files/directories to search for references in (relative to project root)
const dirsToSearch = ['src', 'public'];
const fileExtsToSearch = ['.tsx', '.ts', '.js'];

// Parse command line arguments
const isDryRun = process.argv.includes('--dry-run');

console.log(`${isDryRun ? '[DRY RUN] ' : ''}Image renaming process starting...`);

// Function to find image references in files (informational only, not used for renaming logic)
function findReferences() {
  console.log('\nSearching for image references in files (informational)...');
  const searchPattern = `${projectRoot}/{${dirsToSearch.join(',')}}/**/*.{${fileExtsToSearch.map(ext => ext.substring(1)).join(',')}}`;
  const files = globSync(searchPattern, { nodir: true, windowsPathsNoEscape: true, ignore: [`${projectRoot}/node_modules/**`, `${projectRoot}/.next/**`] });

  Object.keys(renameMap).forEach(oldRelPath => {
    const oldName = path.basename(oldRelPath);
    let found = false;
    console.log(`\nReferences to ${oldName}:`);
    files.forEach(filePath => {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            if (content.includes(oldName) || content.includes(oldRelPath)) {
                console.log(`- Found in: ${path.relative(projectRoot, filePath)}`);
                found = true;
            }
        } catch (err) {
            console.warn(` - Could not read ${filePath}: ${err.message}`);
        }
    });
    if (!found) {
        console.log(`- No references found for ${oldName}`);
    }
  });
}

// Function to rename files
function renameFiles() {
  console.log('\nRenaming image files...');

  Object.entries(renameMap).forEach(([oldRelPath, newRelPath]) => {
    // Construct absolute paths from project root + relative paths
    const oldPath = path.join(projectRoot, oldRelPath.startsWith('/') ? oldRelPath.substring(1) : oldRelPath);
    const newPath = path.join(projectRoot, newRelPath.startsWith('/') ? newRelPath.substring(1) : newRelPath);

    // Create directory if it doesn't exist
    const newDir = path.dirname(newPath);
    if (!fs.existsSync(newDir)) {
      if (isDryRun) {
        console.log(`Would create directory: ${path.relative(projectRoot, newDir)}`);
      } else {
        try {
          fs.mkdirSync(newDir, { recursive: true });
          console.log(`Created directory: ${path.relative(projectRoot, newDir)}`);
        } catch (err) {
            console.error(`Error creating directory ${newDir}: ${err.message}`);
            return; // Skip renaming if dir creation failed
        }
      }
    }

    // Rename file
    if (fs.existsSync(oldPath)) {
      if (isDryRun) {
        console.log(`Would rename: ${path.relative(projectRoot, oldPath)} -> ${path.relative(projectRoot, newPath)}`);
      } else {
         try {
            fs.renameSync(oldPath, newPath);
            console.log(`Renamed: ${path.relative(projectRoot, oldPath)} -> ${path.relative(projectRoot, newPath)}`);
         } catch (err) {
             console.error(`Error renaming ${oldPath} to ${newPath}: ${err.message}`);
         }
      }
    } else {
      // Log warning only if not a dry run, as dry run might show files not yet present
      if (!isDryRun) {
        console.warn(`Warning: Source file not found: ${path.relative(projectRoot, oldPath)}`);
      }
    }
  });
}

// Function to update references in code files
function updateReferences() {
  console.log('\nUpdating references in code files...');

  // Get list of files to search using glob
  const searchPattern = `${projectRoot}/{${dirsToSearch.join(',')}}/**/*.{${fileExtsToSearch.map(ext => ext.substring(1)).join(',')}}`;
  const files = globSync(searchPattern, { nodir: true, windowsPathsNoEscape: true, ignore: [`${projectRoot}/node_modules/**`, `${projectRoot}/.next/**`] });

  files.forEach(filePath => {
    const relativeFilePath = path.relative(projectRoot, filePath);
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content; // Keep original to compare
      let hasChanges = false;

      // Check if the file contains any of the old image names or paths
      Object.entries(renameMap).forEach(([oldRelPath, newRelPath]) => {
        const oldName = path.basename(oldRelPath);
        const newName = path.basename(newRelPath);

        // Escape special characters for regex
        const escapeRegex = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

        // Replace by basename first
        const oldNameRegex = new RegExp(escapeRegex(oldName), 'g');
        if (content.match(oldNameRegex)) {
            content = content.replace(oldNameRegex, newName);
            console.log(` - Replacing ${oldName} -> ${newName} in ${relativeFilePath}`);
            hasChanges = true;
        }

        // Replace by full relative path (more specific)
        const oldRelPathRegex = new RegExp(escapeRegex(oldRelPath), 'g');
         if (content.match(oldRelPathRegex)) {
            content = content.replace(oldRelPathRegex, newRelPath);
            console.log(` - Replacing ${oldRelPath} -> ${newRelPath} in ${relativeFilePath}`);
            hasChanges = true;
        }
      });

      // Write the file only if changes were actually made and not a dry run
      if (hasChanges && content !== originalContent && !isDryRun) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated references in ${relativeFilePath}`);
      } else if (hasChanges && isDryRun) {
           console.log(`Would update references in ${relativeFilePath}`);
      }
    } catch (err) {
        console.warn(`Could not process ${relativeFilePath}: ${err.message}`)
    }
  });
}

// Function to create a backup of all relevant image files
function createBackup() {
  const backupDir = path.join(projectRoot, 'backup-images', `backup-${Date.now()}`);
  if (isDryRun) {
    console.log(`\n[DRY RUN] Would create backup directory: ${path.relative(projectRoot, backupDir)}`);
    console.log(`[DRY RUN] Would copy existing files from renameMap source paths to backup directory.`);
    return; // Skip actual backup in dry run
  }

  try {
    if (!fs.existsSync(path.dirname(backupDir))) {
        fs.mkdirSync(path.dirname(backupDir), { recursive: true });
    }
    fs.mkdirSync(backupDir);
    console.log(`\nCreated backup directory: ${path.relative(projectRoot, backupDir)}`);

    let copiedCount = 0;
    Object.keys(renameMap).forEach(oldRelPath => {
        const sourcePath = path.join(projectRoot, oldRelPath.startsWith('/') ? oldRelPath.substring(1) : oldRelPath);
        if (fs.existsSync(sourcePath)) {
            const destPath = path.join(backupDir, path.basename(oldRelPath));
            try {
                fs.copyFileSync(sourcePath, destPath);
                copiedCount++;
            } catch (copyErr) {
                console.error(` - Error backing up ${path.relative(projectRoot, sourcePath)}: ${copyErr.message}`);
            }
        } else {
             console.warn(` - Source file for backup not found: ${path.relative(projectRoot, sourcePath)}`);
        }
    });
     console.log(`Backed up ${copiedCount} existing source files.`);

  } catch (err) {
      console.error(`Error creating backup directory ${backupDir}: ${err.message}`);
      // Optionally, decide if the script should halt if backup fails
      // throw new Error("Backup failed, aborting rename.");
  }
}

// Main function
function main() {
  if (isDryRun) {
    console.log('\n--- DRY RUN MODE ---');
    console.log('No files will be renamed or modified.');
    console.log('---');
    findReferences(); // Show potential references in dry run
    renameFiles();    // Show potential renames
    updateReferences(); // Show potential updates
    createBackup();   // Show potential backup action
  } else {
    console.log('\n--- EXECUTION MODE ---');
    // 1. Backup existing files first
    createBackup();

    // 2. Rename the files
    renameFiles();

    // 3. Update references in code
    updateReferences();

    console.log('\n---');
    console.log('Image renaming process completed.');
    console.log('Please review the changes and test the application.');
    console.log('---');
  }
}

// Run the main function
main();