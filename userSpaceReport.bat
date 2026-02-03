@echo off
echo ============================================================
echo   User Profile Disk Usage Report (Run as Administrator!)
echo ============================================================
echo.

for /d %%u in (C:\Users\*) do (
    echo Checking folder: %%u
    dir /s /-c "%%u" | find "File(s)"
    echo ------------------------------------------------------------
)

echo Report complete. Each line above shows total files and size.
pause