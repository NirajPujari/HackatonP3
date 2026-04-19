@echo off
REM ======================================================
REM FastAPI Development Environment Activator (uv + venv)
REM ======================================================

REM Change directory to project root (where this script exists)
cd /d %~dp0

echo.
echo [INFO] Activating virtual environment...

REM Activate the .venv environment
call .venv\Scripts\activate

IF ERRORLEVEL 1 (
echo [ERROR] Failed to activate virtual environment.
echo Make sure .venv exists. Run: uv venv
pause
exit /b
)

echo [SUCCESS] Virtual environment activated.
echo.

REM Optional: Sync dependencies from pyproject.toml using uv
echo [INFO] Syncing dependencies using uv...
uv sync

IF ERRORLEVEL 1 (
echo [WARNING] uv sync failed. Check your pyproject.toml or uv installation.
) ELSE (
echo [SUCCESS] Dependencies are up to date.
)

echo.

REM Run FastAPI app
echo [INFO] Starting FastAPI server...
echo.

uv run uvicorn app.main:app --reload

echo.
echo [INFO] Server stopped.
