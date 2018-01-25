REM SETTING PATHS
set fromPath=%cd%\ProfitTrailer
set to1Path=%cd%\ProfitTrailerBackup

:start
cls
@echo off
REM timeout interval in minutes for how often the backup will run.
REM ==========================================================
REM ===                                                    ===
REM ===   CHANGE THIS TO DESIRED MINUTES BETWEEN BACKUPS   ===
REM ===                     ||                             ===
REM ===                     ||                             ===
REM ===                    \  /                            ===
REM ===                     \/                             ===
set RUN_INTERVAL_IN_MINUTES=10
set ramMB=512
REM ===                                                    ===
REM ==========================================================



REM AUTO START ON PC CRASH/SHUTDOWN
set SCRIPT="%TEMP%\%RANDOM%-%RANDOM%-%RANDOM%-%RANDOM%.vbs"

echo Set oWS = WScript.CreateObject("WScript.Shell") >> %SCRIPT%
echo sLinkFile = "%USERPROFILE%\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\ProfitTrailerUtilities.lnk" >> %SCRIPT%
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %SCRIPT%
echo oLink.TargetPath = "%cd%\ProfitTrailerUtilities.bat" >> %SCRIPT%
echo oLink.Save >> %SCRIPT%

cscript /nologo %SCRIPT%
del %SCRIPT%

REM FIXING PT LAUNCH FILE
del %cd%\ProfitTrailer\ProfitTrailer.cmd
echo title PT215463463 ^& java ^-jar ProfitTrailer.jar ^-XX:+UseConcMarkSweepGC ^-Xmx%ramMB%m ^-Xms%ramMB%m>> %cd%\ProfitTrailer\ProfitTrailer.cmd

REM MAKING EXCLUDED BACKUP
del %cd%\ProfitTrailer\excludedfileslist.txt
echo .jar >> %fromPath%\excludedfileslist.txt

REM BACKUP SETTINGS
echo off

set /a timeoutInSeconds="60*%RUN_INTERVAL_IN_MINUTES%"

REM Format the Date/Time for the folders
for /f %%# in ('wMIC Path Win32_LocalTime Get /Format:value') do @for /f %%@ in ("%%#") do @set %%@

set month=000%month%
set month=%month:~-2%

set day=000%day%
set day=%day:~-2%

set hour=000%hour%
set hour=%hour:~-2%

set minute=000%minute%
set minute=%minute:~-2%

set second=000%second%
set second=%second:~-2%

set toPath=%to1Path%\YYYYMMDD_%year%%month%%day%\HHMMSS_%hour%%minute%%second%

mkdir %toPath%\%folderPath%

xcopy "%fromPath%" "%toPath%" /e /h /k /exclude:%fromPath%\excludedfileslist.txt

REM POST BACKUP MESSAGES AND PT CRASH CHECK
:ars
cls
echo Hello, this is post backup screen!
echo I just made a backup of your files!
echo If this is your first backup please go check the results!
echo I am checking to make sure ProfitTrailer is still running!
echo This will take a min or so!
echo We will return to the waiting for backup screen soon!

@echo off
tasklist /v /fo csv | findstr /i "PT215463463 " >nul
if %ERRORLEVEL% == 1 goto mycode
goto eof
:mycode
echo ProfitTrailer either crashed or was not running!
echo Starting now!
cd %fromPath%
start ProfitTrailer.cmd
choice /d y /t 20 > nul
goto ars

:eof

cls
@echo off
echo Hello, this is the waiting for next backup screen!
echo I'm going to back up your files again in %RUN_INTERVAL_IN_MINUTES% minutes!
echo Then I will make sure ProfitTrailer is running!
echo If you push any buttons on this screan it will backup immediately!
echo ===========================================================================================
echo Last run on: %DATE% %TIME%
echo ===========================================================================================

REM =============================================================================
REM ==      set RUN_INTERVAL_IN_MINUTES variable at the top of this file             
REM ==      to desired minutes near the top of this batch file or replace 
REM =============================================================================

timeout /t %timeoutInSeconds%

goto start
