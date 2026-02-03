@echo off
echo ============================================================
echo   WARNING: This script must be run as Administrator!
echo   If not, it will fail to stop services or delete files.
echo ============================================================
echo.

echo Stopping Windows Update services...
net stop wuauserv
net stop bits

echo Deleting Windows Update cache...
rd /s /q C:\Windows\SoftwareDistribution\Download

echo Starting Windows Update services...
net start wuauserv
net start bits

echo ------------------------------------------------------------
echo Windows Update cache cleared successfully!
echo ------------------------------------------------------------
echo.

echo Running Disk Cleanup for Windows Update files...
cleanmgr /sagerun:1

echo ------------------------------------------------------------
echo Disk Cleanup launched. Select Windows Update Cleanup to finish.
echo ------------------------------------------------------------
pause
