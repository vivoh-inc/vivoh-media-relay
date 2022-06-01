@echo OFF

REM This script can be executed from within a powershell script so that the bat file
REM passed as %1 will not cause execution to halt if PAUSE is encountered.
REM If {logfile} is included, bat file output will be appended to logfile.
REM
REM Usage:
REM runner.bat [path of bat script to execute] {logfile}

if not [%2] == [] GOTO APPEND_OUTPUT
@echo | call %1
GOTO EXIT

:APPEND_OUTPUT
@echo | call %1 %3  1> %2 2>&1

:EXIT