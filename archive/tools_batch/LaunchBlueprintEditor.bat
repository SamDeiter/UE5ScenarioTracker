@echo off
:: This batch file starts a local web server using Python and
:: opens the application in the default web browser. This is required
:: because modern browsers block JavaScript modules from running on
:: local files directly (file:///...).
::
:: REQUIREMENTS:
:: 1. This file must be in the same folder as index.html.
:: 2. Python must be installed and added to your system's PATH.

title Launch Blueprint Editor Server

echo ======================================================
echo  Starting local web server for Blueprint Editor...
echo  URL: http://localhost:8000
echo ======================================================
echo.
echo  Close this window when you are finished to stop the server.
echo.

:: Start the default web browser and navigate to the local server address.
start http://localhost:8000

:: Start Python's built-in HTTP server on port 8000.
:: If this command fails, try changing 'py' to 'python'.
pushd %~dp0..\..
py -m http.server 8000
popd