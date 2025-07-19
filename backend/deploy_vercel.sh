#!/bin/bash

# BoneHealth AI Backend - Vercel Deployment Script
# This script helps deploy your FastAPI backend to Vercel

set -e

echo "🚀 BoneHealth AI Backend - Vercel Deployment"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "api_vercel.py" ]; then
    print_error "api_vercel.py not found. Please run this script from the backend directory."
    exit 1
fi

# Check if vercel.json exists
if [ ! -f "vercel.json" ]; then
    print_error "vercel.json not found. Please ensure all Vercel configuration files are present."
    exit 1
fi

# Check if requirements-vercel.txt exists
if [ ! -f "requirements-vercel.txt" ]; then
    print_error "requirements-vercel.txt not found. Please ensure all Vercel configuration files are present."
    exit 1
fi

print_status "Configuration files found ✓"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

print_status "Vercel CLI found ✓"

# Check if git is initialized
if [ ! -d ".git" ]; then
    print_warning "Git repository not initialized. Initializing..."
    git init
    git add .
    git commit -m "Initial commit for Vercel deployment"
fi

print_status "Git repository ready ✓"

# Deploy to Vercel
print_status "Deploying to Vercel..."
echo ""

# Run Vercel deployment
if vercel --prod; then
    print_status "Deployment successful! 🎉"
    echo ""
    print_status "Your API endpoints:"
    echo "  • Health Check: https://your-project.vercel.app/health"
    echo "  • API Docs: https://your-project.vercel.app/docs"
    echo "  • Predictions: https://your-project.vercel.app/api/predict"
    echo ""
    print_status "To test your deployment:"
    echo "  python test_network.py https://your-project.vercel.app"
    echo ""
    print_status "To view logs:"
    echo "  vercel logs"
    echo ""
    print_status "To redeploy:"
    echo "  vercel --prod"
else
    print_error "Deployment failed. Please check the error messages above."
    exit 1
fi 