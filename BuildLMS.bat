@echo off
REM ========================================
REM    UE5 Scenario Tracker - LMS Builder
REM ========================================

color 0A
title Building LMS Package...

echo.
echo ========================================
echo    UE5 SCENARIO TRACKER - LMS BUILD
echo ========================================
echo.
echo This will create a production-ready
echo SCORM package for LMS deployment.
echo.
echo Press any key to continue...
pause > nul

echo.
echo [1/3] Activating Python environment...
call .venv\Scripts\activate.bat

echo.
echo [2/3] Running build script...
echo.
python build-lms.py --clean --zip --version 1.0.0

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo    BUILD SUCCESSFUL!
    echo ========================================
    echo.
    echo ZIP package created and ready for upload!
    echo Location: UE5-Scenario-Tracker-v1.0.0-LMS.zip
    echo.
    echo Next steps:
    echo   1. Test locally: Open lms-build/index.html
    echo   2. Upload ZIP to your LMS
    echo   3. Verify scenarios load correctly
    echo.
) else (
    echo.
    echo ========================================
    echo    BUILD FAILED!
    echo ========================================
    echo.
    echo Check the error messages above.
    echo.
)

echo Press any key to exit...
pause > nul
