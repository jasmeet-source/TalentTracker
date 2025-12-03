# Test Case Designs

## 1. Unit Testing (Backend)
**Component**: `AuthService`
**Objective**: Verify core authentication logic (Login).

| Test Case ID | Description | Input Data | Expected Result |
| :--- | :--- | :--- | :--- |
| **UT-AUTH-01** | Verify Login with Valid Credentials | Email: `test@example.com`, Password: `password123`, Role: `Seeker` | Returns `AuthResponse` with correct Email and Role. |
| **UT-AUTH-02** | Verify Login with Invalid Password | Email: `test@example.com`, Password: `wrongpass`, Role: `Seeker` | Throws `Exception` ("Invalid credentials"). |
| **UT-AUTH-03** | Verify Login with Non-existent User | Email: `unknown@example.com`, Password: `any`, Role: `Seeker` | Throws `Exception` ("Invalid credentials"). |

## 2. Integration Testing (API)
**Component**: `TalentTracker.API`
**Objective**: Verify API endpoints and data flow.

| Test Case ID | Description | Endpoint | Method | Expected Result |
| :--- | :--- | :--- | :--- | :--- |
| **IT-API-01** | Get All Jobs | `/api/jobs` | GET | Status `200 OK`, Returns list of jobs. |
| **IT-API-02** | Login with Valid User | `/api/auth/login` | POST | Status `200 OK`, Returns JWT Token. |
| **IT-API-03** | Login with Invalid User | `/api/auth/login` | POST | Status `401 Unauthorized`. |

## 3. System Testing (UI)
**Component**: `TalentTracker.UI`
**Objective**: Verify end-to-end user flows.

| Test Case ID | Description | Steps | Expected Result |
| :--- | :--- | :--- | :--- |
| **ST-UI-01** | Job Seeker Login | 1. Open Login Page<br>2. Select "Job Seeker"<br>3. Enter valid credentials<br>4. Click "Sign In" | Redirects to Dashboard, shows "Welcome back". |
| **ST-UI-02** | Login Validation | 1. Open Login Page<br>2. Enter invalid credentials<br>3. Click "Sign In" | Displays error message "Invalid credentials". |
| **ST-UI-03** | View Job Listings | 1. Login as Seeker<br>2. Navigate to Dashboard | Displays "Recommended Jobs" section with job cards. |
