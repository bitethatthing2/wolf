#!/bin/bash

# Cleanup script for removing unused Elfsight/Instagram components

echo "Creating backup directory..."
mkdir -p backups/$(date +"%Y-%m-%d")

ELFSIGHT_FILES=(
  "src/components/features/social/ElfsightInstagramFeed.tsx"
  "src/components/features/SideHustleInstagramFeed.tsx"
  "src/components/features/SmartElfsightWidget.tsx"
  "src/components/features/ElfsightWidget.tsx"
  "src/components/features/ElfsightMock.tsx"
)

echo "Backing up files before deletion..."
for file in "${ELFSIGHT_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Backing up $file..."
    cp "$file" "backups/$(date +"%Y-%m-%d")/$(basename "$file")"
  else
    echo "Warning: $file does not exist!"
  fi
done

echo "Deleting unused components..."
for file in "${ELFSIGHT_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Removing $file..."
    rm "$file"
  else
    echo "Warning: $file does not exist!"
  fi
done

echo "Cleanup completed!"
echo "Backup files are stored in backups/$(date +"%Y-%m-%d")/"
