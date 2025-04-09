// Script to prepare assets for Netlify deployment
const fs = require('fs-extra');
const path = require('path');

async function main() {
  try {
    console.log('Starting asset preparation for Netlify deployment...');
    
    // Step 1: Ensure out directory exists (Next.js static export goes to 'out')
    await fs.ensureDir('out');
    console.log('Ensured out directory exists');
    
    // Step 2: Create a _redirects file in out directory for SPA routing
    const redirectsPath = path.join('out', '_redirects');
    console.log('Creating _redirects file for SPA routing...');
    // This redirect rule ensures all routes work with client-side navigation
    await fs.writeFile(redirectsPath, '/* /index.html 200');
    console.log('Created _redirects file');
    
    // Step 3: Copy critical files to ensure they're in the out directory
    const criticalFiles = [
      'firebase-messaging-sw.js',
      'manifest.json',
      'favicon.ico'
    ];
    
    for (const file of criticalFiles) {
      const srcPath = path.join('public', file);
      const destPath = path.join('out', file);
      if (await fs.pathExists(srcPath)) {
        console.log(`Copying critical file ${file} to out directory`);
        await fs.copy(srcPath, destPath, { overwrite: true });
      } else {
        console.warn(`Warning: Critical file ${file} not found in public folder!`);
      }
    }

    // Step 4: Ensure 404.html exists in the out directory
    const notFoundPath = path.join('out', '404.html');
    if (!await fs.pathExists(notFoundPath)) {
      console.log('404.html not found, copying from pages/404.js output...');
      // Try to copy from the 404 page if it exists
      const customNotFoundPath = path.join('out', '404', 'index.html');
      if (await fs.pathExists(customNotFoundPath)) {
        await fs.copy(customNotFoundPath, notFoundPath);
        console.log('Created 404.html from custom 404 page');
      } else {
        // Create a basic 404 page if none exists
        const basic404Content = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>404 - Page Not Found</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                background-color: #000;
                color: #fff;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                padding: 1rem;
              }
              .container {
                max-width: 500px;
                text-align: center;
              }
              h1 {
                font-size: 2rem;
                margin-bottom: 1rem;
              }
              p {
                color: #aaa;
                margin-bottom: 2rem;
              }
              a {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 0.75rem 1.5rem;
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 0.375rem;
                color: #fff;
                background-color: #000;
                text-decoration: none;
                transition: background-color 0.2s;
              }
              a:hover {
                background-color: rgba(255, 255, 255, 0.1);
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>404 - Page Not Found</h1>
              <p>The page you're looking for doesn't exist or has been moved.</p>
              <a href="/">Return Home</a>
            </div>
          </body>
          </html>
        `;
        await fs.writeFile(notFoundPath, basic404Content);
        console.log('Created basic 404.html file');
      }
    }

    console.log('Assets prepared for Netlify deployment!');
  } catch (error) {
    console.error('Error preparing assets:', error);
    process.exit(1);
  }
}

main();
