#!/bin/bash

# Deploy to gh-pages script
# Usage: ./deploy-gh-pages.sh [build|deploy]

set -e

COMMAND=$1

# Function to show usage
usage() {
  echo "Usage: ./deploy-gh-pages.sh [build|deploy]"
  echo ""
  echo "Commands:"
  echo "  build   - Build production bundle to gh-pages folder"
  echo "  deploy  - Build and push to gh-pages branch on GitHub"
  echo ""
  exit 1
}

# Function to build
build() {
  echo "Starting build process..."

  # 1. Build the project
  echo "Building production bundle..."
  npm run build

  # 2. Check if dist folder exists
  if [ ! -d "dist" ]; then
    echo "Error: dist folder not found. Build failed?"
    exit 1
  fi

  # 3. Create gh-pages folder
  echo "Creating gh-pages folder..."
  rm -rf gh-pages
  mkdir -p gh-pages

  # 4. Copy dist contents to gh-pages folder
  echo "Copying dist files to gh-pages folder..."
  cp -r dist/* gh-pages/

  # 5. Create index.html in gh-pages folder
  echo "Creating index.html..."
  cat > gh-pages/index.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>MathFox Game</title>
    <link rel="stylesheet" href="styles.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
</head>
<body>
    <script src="9a02e55a2dec53bc8194.vendor.bundle.js"></script>
    <script src="9a02e55a2dec53bc8194.bundle.js"></script>
</body>
</html>
EOF

  echo ""
  echo "✓ Build completed successfully!"
  echo "  Output: gh-pages/"
  echo ""
}

# Function to deploy
deploy() {
  # First, build
  build

  echo "Starting deployment process..."

  # 6. Initialize git in gh-pages folder
  echo "Initializing git repository in gh-pages folder..."
  cd gh-pages
  git init
  git add -A
  git commit -m "deploy: update gh-pages $(date '+%Y-%m-%d %H:%M:%S')"

  # 7. Push to gh-pages branch
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
  deploy)
    deploy
    ;;
  *)
    usage
    ;;
esac
