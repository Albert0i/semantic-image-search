@echo off
setlocal enabledelayedexpansion

REM loaddb.bat - load all .sql files into a SQLite database

if "%1"=="" (
    echo Usage: loaddb.bat database.db "C:\path\to\folder"
    exit /b 1
)

if "%2"=="" (
    echo Usage: loaddb.bat database.db "C:\path\to\folder"
    exit /b 1
)

set DB=%1
set FOLDER=%2
set COUNT=0

for %%f in ("%FOLDER%\*.sql") do (
    echo Importing %%f ...
    sqlite3.exe "%DB%" < "%%f"
    set /a COUNT+=1
    REM echo Imported files so far: !COUNT!
)

echo.
echo Total files imported: !COUNT!
echo Done.

endlocal


REM
REM loaddb.bat data\db.sq3 H:\PHLIB.SQLITE\2012
REM 