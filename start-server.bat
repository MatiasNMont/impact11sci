@echo off
set PORT=%1
if "%PORT%"=="" set PORT=8080
echo Sirviendo en http://localhost:%PORT%
python -m http.server %PORT%
