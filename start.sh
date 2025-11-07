#!/bin/bash

# AutoBox Backend Quick Start Script

echo "🚗 AutoBox Backend Setup"
echo "========================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. Please configure your database credentials!"
    echo ""
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "🗄️  Database Setup Required:"
echo "   1. Make sure MySQL is running"
echo "   2. Create database: CREATE DATABASE autobox;"
echo "   3. Update .env with your MySQL credentials"
echo ""

read -p "Have you configured the database? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🚀 Starting development server..."
    npm run start:dev
else
    echo ""
    echo "📋 Next steps:"
    echo "   1. Edit .env file with your credentials"
    echo "   2. Run: npm run start:dev"
    echo ""
fi
