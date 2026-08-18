@echo off
REM 🚀 Script de Despliegue Automatizado a GitHub Pages (Windows)
REM Autor: Yamir Vera

echo === Subiendo Portafolio a GitHub ===
git init
git add .
git commit -m "feat: Yamir Vera Data Science Portfolio with Retro Arcade & AI Engine"
git branch -M main
git remote add origin https://github.com/yamirvera/portafolio.git
git push -u origin main

echo.
echo ========================================================
echo Listo! En 60 segundos tu sitio estara publicado en:
echo https://yamirvera.github.io/portafolio/
echo ========================================================
pause
