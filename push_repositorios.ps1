Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "  GRUPO BNG - SINCRONIZACAO COM REPOSITORIOS GITHUB" -ForegroundColor Yellow
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/2] A enviar Website para https://github.com/lgtecserv/bng-website..." -ForegroundColor Green
git push -u origin-website main

Write-Host ""
Write-Host "[2/2] A enviar Aplicativo para https://github.com/lgtecserv/bng-app..." -ForegroundColor Green
git push -u origin-app main

Write-Host ""
Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "  Concluido com sucesso!" -ForegroundColor Green
Write-Host "====================================================================" -ForegroundColor Cyan
