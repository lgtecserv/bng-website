@echo off
chcp 65001 >nul
echo ====================================================================
echo   GRUPO BNG - SINCRONIZACAO COM REPOSITORIOS OFICIAIS GITHUB
echo ====================================================================
echo.
echo [1/2] A enviar Website para https://github.com/lgtecserv/bng-website...
git push -u origin-website main
if %ERRORLEVEL% EQU 0 (
    echo [OK] Website sincronizado com sucesso!
) else (
    echo [AVISO] Se solicitada autenticacao, faça login na janela do navegador ou insira o seu Personal Access Token do GitHub.
)
echo.
echo [2/2] A enviar Aplicativo para https://github.com/lgtecserv/bng-app...
git push -u origin-app main
if %ERRORLEVEL% EQU 0 (
    echo [OK] Aplicativo sincronizado com sucesso!
) else (
    echo [AVISO] Se solicitada autenticacao, faça login na janela do navegador ou insira o seu Personal Access Token do GitHub.
)
echo.
echo ====================================================================
echo   Processo concluido!
echo ====================================================================
pause
