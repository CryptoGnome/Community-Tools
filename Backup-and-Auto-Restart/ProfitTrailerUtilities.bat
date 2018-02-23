REM EDIT THESE IF YOU WANT TO CHANGE AMOUNT OF RAM IN MB OR THE INTERIVAL IN MIN
set RUN_INTERVAL_IN_MINUTES=10
set ramMB=512


REM PRE SETUP
set old=%cd%
set fromPath=%cd%\ProfitTrailer
set fromPath2=%cd%\GnomeFeeder
set to1Path=%cd%\ProfitTrailerUtilities

REM START
cls
@echo off

REM AUTO START ON PC CRASH/SHUTDOWN
set SCRIPT="%TEMP%\%RANDOM%-%RANDOM%-%RANDOM%-%RANDOM%.vbs"

echo Set oWS = WScript.CreateObject("WScript.Shell") >> %SCRIPT%
echo sLinkFile = "%USERPROFILE%\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup\ProfitTrailerUtilities.lnk" >> %SCRIPT%
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> %SCRIPT%
echo oLink.TargetPath = "%old%\ProfitTrailer\pccreashrecover.bat" >> %SCRIPT%
echo oLink.Save >> %SCRIPT%

cscript /nologo %SCRIPT%
del %SCRIPT%

REM FIXING PT LAUNCH FILE

del %cd%\ProfitTrailer\*.cmd
echo java ^-jar ProfitTrailer.jar ^-XX:+UseConcMarkSweepGC ^-Xmx%ramMB%m ^-Xms%ramMB%m>> %cd%\ProfitTrailer\ProfitTrailer.cmd

del %cd%\ProfitTrailer\pccreashrecover.bat
echo cd %old% ^& start ProfitTrailerUtilities.bat >> %old%\ProfitTrailer\pccreashrecover.bat

cd %fromPath%
start ProfitTrailer.cmd
cd %old%

cd %fromPath%
if exist Run_Profit_Tracker.bat (
    start Run_Profit_Tracker.bat
) else (
    goto A
)
:A
cd %old%

cd %fromPath2%
if exist pt-feeder.bat (
    start pt-feeder.bat
	set feeder=true
) else (
    goto C
)
:B
cd %old%

cd %fromPath2%
if exist ProfitTrailer-blacklist.bat (
    start ProfitTrailer-blacklist.bat
	goto D
) else (
    goto C
)
:C
cd %old%

cd %fromPath%
if exist ProfitTrailer-blacklist.bat (
    start ProfitTrailer-blacklist.bat
) else (
    goto D
)
:D
cd %old%

start "" https://github.com/CryptoGnome/Community-Tools/blob/master/ProfitTrailer-Tools/Backup-and-Auto-Restart/README.md#if-you-need-any-help-please-pm-a%%E0%%B9%%87qua0001-on-discord

:start
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

if not %feeder%==true goto:F
xcopy "%fromPath2%\config" "%toPath%\*.*" /e /h /k /s /i /f /y
xcopy "%fromPath%\ProfitTrailerData.json" "%toPath%\*.*" /e /h /k /s /i /f /y
goto G
:F
xcopy "%fromPath%\trading" "%toPath%\*.*" /e /h /k /s /i /f /y
xcopy "%fromPath%\ProfitTrailerData.json" "%toPath%\*.*" /e /h /k /s /i /f /y
:G

REM POST BACKUP MESSAGES AND PT CRASH CHECK

cls
@echo off
echo If you need any help please PM @Aqua#0247 on Discord
echo If you found the utility useful
echo LTC: LWMMsRPXkXmB2H2f5qPJ8Tqt7h3S7SELxq
echo BTC: 1HBy9MExLN31nPZaYFMqqSVrC1SmphVWCn
echo ETH: 0x715004457357fb52b927063D3eB9DACc001b0B28
echo BCH: qzdtqf3wl43w007uv8qj0laltuxch73qevd7k65sn8
echo .
echo Hello, this is the waiting for next backup screen!
echo I'm going to back up your files again in %RUN_INTERVAL_IN_MINUTES% minutes!
echo If you push any buttons on this screan it will backup immediately!
echo ===========================================================================================
echo Last run on: %DATE% %TIME%
echo ===========================================================================================


timeout /t %timeoutInSeconds%

goto start
