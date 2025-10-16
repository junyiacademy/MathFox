#!/bin/bash

# Deploy to gh-pages script
# Usage: ./deploy-gh-pages.sh [build|build-local|deploy]

set -e

COMMAND=$1

# Function to show usage
usage() {
  echo "Usage: ./deploy-gh-pages.sh [build|build-local|deploy]"
  echo ""
  echo "Commands:"
  echo "  build       - Build for GitHub Pages (publicPath: /MathFox/)"
  echo "  build-local - Build for local testing (publicPath: /)"
  echo "  deploy      - Build and push to gh-pages branch on GitHub"
  echo ""
  exit 1
}

# Function to build for GitHub Pages
build() {
  echo "Starting build process for GitHub Pages..."

  # Clean dist folder manually
  echo "Cleaning dist folder..."
  rm -rf dist

  # Build with gh-pages config
  echo "Building production bundle with publicPath=/MathFox/..."
  npx webpack --config webpack.ghpages.js

  # Check if dist folder exists
  if [ ! -d "dist" ]; then
    echo "Error: dist folder not found. Build failed?"
    exit 1
  fi

  # Create gh-pages folder
  echo "Creating gh-pages folder..."
  rm -rf gh-pages
  mkdir -p gh-pages

  # Copy dist contents to gh-pages folder
  echo "Copying dist files to gh-pages folder..."
  cp -r dist/* gh-pages/

  # Find bundle filenames
  VENDOR_BUNDLE=$(ls gh-pages/*.vendor.bundle.js | xargs basename)
  APP_BUNDLE=$(ls gh-pages/*.bundle.js | grep -v vendor | xargs basename)

  echo "Found bundles:"
  echo "  Vendor: $VENDOR_BUNDLE"
  echo "  App: $APP_BUNDLE"

  # Copy mock globals script
  echo "Copying mock-globals.js..."
  cp mock-globals-ghpages.js gh-pages/mock-globals.js

  # Create index.html in gh-pages folder
  echo "Creating index.html..."
  cat > gh-pages/index.html << EOF
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>MathFox Game</title>
    <link rel="stylesheet" href="styles.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script src="mock-globals.js"></script>
</head>
<body>
    <script src="$VENDOR_BUNDLE"></script>
    <script src="$APP_BUNDLE"></script>
</body>
</html>
EOF

  echo ""
  echo "✓ Build completed successfully for GitHub Pages!"
  echo "  Output: gh-pages/"
  echo ""
  echo "To test locally, use: ./deploy-gh-pages.sh build-local"
  echo ""
}

# Function to build for local testing
build_local() {
  echo "Starting build process for local testing..."

  # Clean dist folder manually
  echo "Cleaning dist folder..."
  rm -rf dist

  # Build with local config
  echo "Building production bundle with publicPath=/..."
  npx webpack --config webpack.local.js

  # Check if dist folder exists
  if [ ! -d "dist" ]; then
    echo "Error: dist folder not found. Build failed?"
    exit 1
  fi

  # Create gh-pages-local folder
  echo "Creating gh-pages-local folder..."
  rm -rf gh-pages-local
  mkdir -p gh-pages-local

  # Copy dist contents
  echo "Copying dist files..."
  cp -r dist/* gh-pages-local/

  # Find bundle filenames
  VENDOR_BUNDLE=$(ls gh-pages-local/*.vendor.bundle.js | xargs basename)
  APP_BUNDLE=$(ls gh-pages-local/*.bundle.js | grep -v vendor | xargs basename)

  echo "Found bundles:"
  echo "  Vendor: $VENDOR_BUNDLE"
  echo "  App: $APP_BUNDLE"

  # Copy mock globals with local path
  echo "Copying mock-globals.js..."
  cp mock-globals-local.js gh-pages-local/mock-globals.js

  # Create index.html
  echo "Creating index.html..."
  cat > gh-pages-local/index.html << EOF
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>MathFox Game (Local Test)</title>
    <link rel="stylesheet" href="styles.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script src="mock-globals.js"></script>
</head>
<body>
    <script src="$VENDOR_BUNDLE"></script>
    <script src="$APP_BUNDLE"></script>
</body>
</html>
EOF

  echo ""
  echo "✓ Build completed successfully for local testing!"
  echo "  Output: gh-pages-local/"
  echo ""
  echo "To test, run:"
  echo "  cd gh-pages-local && python3 -m http.server 8080"
  echo "  Then open: http://localhost:8080"
  echo ""
}

# Function to deploy
deploy() {
  # First, build for GitHub Pages
  build

  echo "Starting deployment process..."

  # Initialize git in gh-pages folder
  echo "Initializing git repository in gh-pages folder..."
  cd gh-pages
  git init
  git add -A
  git commit -m "deploy: update gh-pages $(date '+%Y-%m-%d %H:%M:%S')"

  # Push to gh-pages branch
  echo "Pushing to gh-pages branch..."
  git push -f ../. HEAD:gh-pages

  cd ..

  echo ""
  echo "✓ Successfully deployed to gh-pages branch!"
  echo ""
  echo "Next steps:"
  echo "  1. Push to remote: git push origin gh-pages"
  echo "  2. Or force push: git push -f origin gh-pages"
  echo ""
  echo "Your site will be available at:"
  echo "  https://junyiacademy.github.io/MathFox/"
  echo ""
}

# Main script
case "$COMMAND" in
  build)
    build
    ;;
  build-local)
    build_local
    ;;
  deploy)
    deploy
    ;;
  *)
    usage
    ;;
esac
