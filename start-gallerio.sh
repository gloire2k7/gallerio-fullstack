#!/bin/bash

# Gallerio Test Script
echo "🎨 Gallerio - Rwandan Art Gallery Platform"
echo "=========================================="
echo ""

echo "🚀 Starting application..."
docker compose up --build -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 30

echo ""
echo "📊 Checking service status..."
docker compose ps

echo ""
echo "✅ Application is ready!"
echo ""
echo "🌐 Access Points:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8080"
echo "   Database: localhost:5432"
echo ""
echo "👥 Default Login Credentials:"
echo "   Admin:    admin@gallerio.com    / password123"
echo "   Artist:   artist@gallerio.com   / password123"
echo "   Collector: collector@gallerio.com / password123"
echo ""
echo "📋 Useful Commands:"
echo "   View logs: docker compose logs -f"
echo "   Stop:      docker compose down"
echo "   Reset:     docker compose down -v"
echo ""
echo "🎯 Happy Testing!"