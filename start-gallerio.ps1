# Gallerio Test Script (PowerShell)
Write-Host "🎨 Gallerio - Rwandan Art Gallery Platform" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🚀 Starting application..." -ForegroundColor Green
docker compose up --build -d

Write-Host ""
Write-Host "⏳ Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

Write-Host ""
Write-Host "📊 Checking service status..." -ForegroundColor Magenta
docker compose ps

Write-Host ""
Write-Host "✅ Application is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Access Points:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend API: http://localhost:8080" -ForegroundColor White
Write-Host "   Database: localhost:5432" -ForegroundColor White
Write-Host ""
Write-Host "👥 Default Login Credentials:" -ForegroundColor Yellow
Write-Host "   Admin:    admin@gallerio.com    / password123" -ForegroundColor White
Write-Host "   Artist:   artist@gallerio.com   / password123" -ForegroundColor White
Write-Host "   Collector: collector@gallerio.com / password123" -ForegroundColor White
Write-Host ""
Write-Host "📋 Useful Commands:" -ForegroundColor Magenta
Write-Host "   View logs: docker compose logs -f" -ForegroundColor White
Write-Host "   Stop:      docker compose down" -ForegroundColor White
Write-Host "   Reset:     docker compose down -v" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Happy Testing!" -ForegroundColor Green