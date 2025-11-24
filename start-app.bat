@echo off
echo Installing FooTable dependencies...
echo.
echo Step 1: Installing npm packages...
npm install
echo.
echo Step 2: Starting development server...
npm run dev
echo.
echo Your football tracker should now be running at http://localhost:3000
pause
