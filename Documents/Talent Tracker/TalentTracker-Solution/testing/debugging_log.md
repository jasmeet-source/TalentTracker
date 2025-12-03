# Debugging Log - Login Failure

## Issue Description
**Date**: 2025-11-29
**Symptom**: Users (Seeker, Admin, etc.) were unable to log in using the reference credentials provided on the login page. The API returned `401 Unauthorized`.
**Error Message**: "Invalid credentials"

## Investigation Steps
1.  **Initial Verification**:
    - Attempted login via UI -> Failed.
    - Attempted login via `curl` with `email` payload -> Failed (401).
    - Attempted login via `curl` with `identifier` payload -> Failed (401).
2.  **Code Review**:
    - Checked `AuthService.cs`: Logic for password verification using `BCrypt.Verify` appeared correct.
    - Checked `DbSeeder.cs`: Confirmed default users are seeded with `BCrypt.HashPassword("pass123")`.
    - Checked `AuthDtos.cs`: Confirmed `LoginRequest` expects `Identifier`.
    - Checked `Login.jsx` & `authService.js`: Confirmed frontend sends `identifier` correctly.
3.  **Hypothesis**:
    - The database might contain stale data where the password hash does not match `pass123` (possibly from an older seed run or manual change).
    - The backend process might be holding a stale state or the seeder didn't run effectively on the last startup.

## Resolution
1.  **Action**: Restarted the backend API process (`dotnet run`).
    - This forced the `DbSeeder.SeedAsync` method to execute again.
    - Logs confirmed: `Resetting password status for aryan@seeker.com`.
2.  **Verification**:
    - Retried `curl` login with `identifier` -> **Success (200 OK)**.
    - Retried Cypress UI tests -> **Success**.

## Root Cause
The running backend instance was stale, and the database records for the default users likely had mismatched password hashes. Restarting the application re-seeded the correct data.

## Code Improvements
- **Logging**: Added `Console.WriteLine` in `AuthService` (temporarily) to trace the login flow, which helped confirm the "User found" but "Password invalid" state.
- **Testing**: Added Unit Tests (`AuthServiceTests.cs`) to ensure the logic remains correct in future changes.
