/**
 * Auth API Tests
 * Run with: npx tsx tests/auth.test.ts
 */

const BASE_URL = "http://localhost:3000/api/auth";
const TEST_EMAIL = "patilpurushottam775@gmail.com";
const TEST_PASSWORD = "Test@123456";
const TEST_NAME = "Purushottam Patil";

interface ApiResponse {
    message: string;
    token?: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
}

// Helper function to make API calls
async function apiCall(
    endpoint: string,
    method: string = "GET",
    body?: object
): Promise<{ status: number; data: ApiResponse }> {
    const options: RequestInit = {
        method,
        headers: { "Content-Type": "application/json" },
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();

    return { status: response.status, data };
}

// Test results storage
const results: { test: string; status: string; response: string }[] = [];

function logResult(test: string, success: boolean, response: string) {
    const status = success ? "✅ PASS" : "❌ FAIL";
    results.push({ test, status, response });
    console.log(`${status} | ${test}`);
    console.log(`   Response: ${response}\n`);
}

async function runTests() {
    console.log("═══════════════════════════════════════════════════════════");
    console.log("               🧪 AUTH API TEST SUITE");
    console.log("═══════════════════════════════════════════════════════════\n");
    console.log(`📧 Test Email: ${TEST_EMAIL}\n`);

    // ────────────────────────────────────────────────────────────
    // TEST 1: Health Check
    // ────────────────────────────────────────────────────────────
    console.log("─── TEST 1: Health Check ───");
    try {
        const res = await fetch("http://localhost:3000");
        const text = await res.text();
        logResult("Health Check", res.status === 200, text);
    } catch (error) {
        logResult("Health Check", false, String(error));
    }

    // ────────────────────────────────────────────────────────────
    // TEST 2: Signup (Register New User)
    // ────────────────────────────────────────────────────────────
    console.log("─── TEST 2: Signup ───");
    try {
        const { status, data } = await apiCall("/signup", "POST", {
            name: TEST_NAME,
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
        });
        const success = status === 201 || (status === 400 && data.message === "User already exists");
        logResult("Signup", success, data.message);
    } catch (error) {
        logResult("Signup", false, String(error));
    }

    // ────────────────────────────────────────────────────────────
    // TEST 3: Signup with Existing Email (should fail)
    // ────────────────────────────────────────────────────────────
    console.log("─── TEST 3: Duplicate Signup ───");
    try {
        const { status, data } = await apiCall("/signup", "POST", {
            name: TEST_NAME,
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
        });
        logResult("Duplicate Signup Prevention", status === 400, data.message);
    } catch (error) {
        logResult("Duplicate Signup Prevention", false, String(error));
    }

    // ────────────────────────────────────────────────────────────
    // TEST 4: Login (Unverified User - should fail)
    // ────────────────────────────────────────────────────────────
    console.log("─── TEST 4: Login (Unverified) ───");
    try {
        const { status, data } = await apiCall("/login", "POST", {
            email: TEST_EMAIL,
            password: TEST_PASSWORD,
        });
        // Should fail because email is not verified
        logResult("Login (Unverified User)", status === 401 && data.message === "Please verify your email", data.message);
    } catch (error) {
        logResult("Login (Unverified User)", false, String(error));
    }

    // ────────────────────────────────────────────────────────────
    // TEST 5: Login with Wrong Password
    // ────────────────────────────────────────────────────────────
    console.log("─── TEST 5: Login (Wrong Password) ───");
    try {
        const { status, data } = await apiCall("/login", "POST", {
            email: TEST_EMAIL,
            password: "wrongpassword",
        });
        logResult("Login (Wrong Password)", status === 401, data.message);
    } catch (error) {
        logResult("Login (Wrong Password)", false, String(error));
    }

    // ────────────────────────────────────────────────────────────
    // TEST 6: Login with Non-Existent User
    // ────────────────────────────────────────────────────────────
    console.log("─── TEST 6: Login (Non-Existent User) ───");
    try {
        const { status, data } = await apiCall("/login", "POST", {
            email: "nonexistent@example.com",
            password: "password123",
        });
        logResult("Login (Non-Existent User)", status === 401, data.message);
    } catch (error) {
        logResult("Login (Non-Existent User)", false, String(error));
    }

    // ────────────────────────────────────────────────────────────
    // TEST 7: Forgot Password (Send OTP)
    // ────────────────────────────────────────────────────────────
    console.log("─── TEST 7: Forgot Password ───");
    try {
        const { status, data } = await apiCall("/forgot-password", "POST", {
            email: TEST_EMAIL,
        });
        logResult("Forgot Password", status === 200, data.message);
    } catch (error) {
        logResult("Forgot Password", false, String(error));
    }

    // ────────────────────────────────────────────────────────────
    // TEST 8: Forgot Password (Non-Existent User)
    // ────────────────────────────────────────────────────────────
    console.log("─── TEST 8: Forgot Password (Non-Existent) ───");
    try {
        const { status, data } = await apiCall("/forgot-password", "POST", {
            email: "nonexistent@example.com",
        });
        logResult("Forgot Password (Non-Existent)", status === 404, data.message);
    } catch (error) {
        logResult("Forgot Password (Non-Existent)", false, String(error));
    }

    // ────────────────────────────────────────────────────────────
    // TEST 9: Reset Password with Invalid OTP
    // ────────────────────────────────────────────────────────────
    console.log("─── TEST 9: Reset Password (Invalid OTP) ───");
    try {
        const { status, data } = await apiCall("/reset-password", "POST", {
            email: TEST_EMAIL,
            otp: "000000",
            newPassword: "NewPassword@123",
        });
        logResult("Reset Password (Invalid OTP)", status === 400, data.message);
    } catch (error) {
        logResult("Reset Password (Invalid OTP)", false, String(error));
    }

    // ────────────────────────────────────────────────────────────
    // TEST 10: Verify Email with Invalid Token
    // ────────────────────────────────────────────────────────────
    console.log("─── TEST 10: Verify Email (Invalid Token) ───");
    try {
        const { status, data } = await apiCall("/verify/invalidtoken123", "GET");
        logResult("Verify Email (Invalid Token)", status === 400, data.message);
    } catch (error) {
        logResult("Verify Email (Invalid Token)", false, String(error));
    }

    // ────────────────────────────────────────────────────────────
    // TEST 11: Logout
    // ────────────────────────────────────────────────────────────
    console.log("─── TEST 11: Logout ───");
    try {
        const { status, data } = await apiCall("/logout", "POST");
        logResult("Logout", status === 200, data.message);
    } catch (error) {
        logResult("Logout", false, String(error));
    }

    // ────────────────────────────────────────────────────────────
    // SUMMARY
    // ────────────────────────────────────────────────────────────
    console.log("\n═══════════════════════════════════════════════════════════");
    console.log("                    📊 TEST SUMMARY");
    console.log("═══════════════════════════════════════════════════════════\n");

    const passed = results.filter((r) => r.status === "✅ PASS").length;
    const failed = results.filter((r) => r.status === "❌ FAIL").length;

    console.log(`Total Tests: ${results.length}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`\n📧 Emails sent to: ${TEST_EMAIL}`);
    console.log("   - Verification email (from signup)");
    console.log("   - OTP email (from forgot-password)\n");

    if (failed === 0) {
        console.log("🎉 ALL TESTS PASSED!");
    } else {
        console.log("⚠️  Some tests failed. Check the results above.");
    }
}

// Run all tests
runTests().catch(console.error);
