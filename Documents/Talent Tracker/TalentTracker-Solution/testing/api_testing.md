# API Testing Guide (Swagger)

The Talent Tracker API provides a built-in Swagger UI for interactive documentation and testing.

## Accessing Swagger UI
1. Ensure the backend API is running (`dotnet run` in `TalentTracker.API`).
2. Open your browser and navigate to: **[http://localhost:5285/swagger](http://localhost:5285/swagger)**

## Common Test Scenarios

### 1. Authentication
- **POST /api/auth/login**
    - Click "Try it out".
    - Enter valid credentials (e.g., `{"email": "admin@talenttracker.com", "password": "pass123"}`).
    - Execute and copy the `token` from the response body.
    - Scroll to the top, click **Authorize**, enter `Bearer <your_token>`, and click **Authorize**.

### 2. Jobs
- **GET /api/jobs**
    - Execute to see a list of available jobs.
- **POST /api/jobs** (Requires Employer/Admin)
    - Create a new job posting.

### 3. Applications
- **POST /api/applications** (Requires Seeker)
    - Apply for a job using a valid `jobId`.

## Troubleshooting
- If the UI doesn't load, check if the backend is running on port 5285.
- If you get 401 Unauthorized, ensure you have clicked the **Authorize** button and pasted the token correctly.
