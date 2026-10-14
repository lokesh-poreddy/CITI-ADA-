@echo off
setlocal EnableExtensions EnableDelayedExpansion
set "MAVEN_VERSION=3.9.11"
set "MAVEN_SHA512=03e2d65d4483a3396980629f260e25cac0d8b6f7f2791e4dc20bc83f9514db8d0f05b0479e699a5f34679250c49c8e52e961262ded468a20de0be254d8207076"
set "MAVEN_URL=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/%MAVEN_VERSION%/apache-maven-%MAVEN_VERSION%-bin.zip"
set "MAVEN_HOME_CACHE=%USERPROFILE%\.m2\wrapper\dists\apache-maven-%MAVEN_VERSION%"
set "MAVEN_EXE=%MAVEN_HOME_CACHE%\bin\mvn.cmd"
where mvn >nul 2>nul
if not errorlevel 1 (
  for /f "tokens=3" %%v in ('mvn -version 2^>^&1 ^| findstr /r /c:"Apache Maven [0-9]"') do set "MVN_VERSION=%%v"
  for /f "tokens=1,2 delims=." %%a in ("!MVN_VERSION!") do (set "MVN_MAJOR=%%a" & set "MVN_MINOR=%%b")
  if defined MVN_MAJOR if !MVN_MAJOR! GTR 3 (mvn %* & exit /b !errorlevel!)
  if defined MVN_MAJOR if !MVN_MAJOR! EQU 3 if !MVN_MINOR! GEQ 9 (mvn %* & exit /b !errorlevel!)
)
if exist "%MAVEN_EXE%" (%MAVEN_EXE% %* & exit /b !errorlevel!)
echo Bootstrapping checksum-verified Apache Maven %MAVEN_VERSION%...
set "TMPDIR=%TEMP%\udaan-maven-%RANDOM%%RANDOM%"
mkdir "%TMPDIR%" || exit /b 2
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ErrorActionPreference='Stop'; Invoke-WebRequest -Uri '%MAVEN_URL%' -OutFile '%TMPDIR%\maven.zip'; $h=(Get-FileHash '%TMPDIR%\maven.zip' -Algorithm SHA512).Hash.ToLower(); if ($h -ne '%MAVEN_SHA512%') { throw 'Maven distribution checksum mismatch' }; Expand-Archive -LiteralPath '%TMPDIR%\maven.zip' -DestinationPath '%TMPDIR%\unpacked' -Force; New-Item -ItemType Directory -Force -Path '%MAVEN_HOME_CACHE%' | Out-Null; Copy-Item -Path '%TMPDIR%\unpacked\apache-maven-%MAVEN_VERSION%\*' -Destination '%MAVEN_HOME_CACHE%' -Recurse -Force"
if errorlevel 1 (rmdir /s /q "%TMPDIR%" 2>nul & exit /b 3)
rmdir /s /q "%TMPDIR%" 2>nul
"%MAVEN_EXE%" %*
exit /b %errorlevel%
