import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 20 }, // Ramp up to 20 users
        { duration: '1m', target: 20 },  // Stay at 20 users
        { duration: '10s', target: 0 },  // Ramp down
    ],
};

const BASE_URL = 'http://localhost:5285/api';

export default function () {
    // 1. Public Endpoint Test: Get Jobs
    const jobsRes = http.get(`${BASE_URL}/jobs`);
    check(jobsRes, {
        'status is 200': (r) => r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
    });

    // 2. Login Test (Simulate load on auth)
    const loginPayload = JSON.stringify({
        email: 'aryan@seeker.com',
        password: 'pass123',
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, params);
    check(loginRes, {
        'login status is 200': (r) => r.status === 200,
        'token received': (r) => r.json('token') !== undefined,
    });

    sleep(1);
}
