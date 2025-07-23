const axios = require('axios');
require('dotenv').config();

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Test user data
const testUser = {
    name: 'Frontend Test User',
    email: 'frontendtest@example.com',
    password: 'password123',
    phone: '+254115479310',
    role: 'user'
};

// Colors for console output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testRegistrationAPI() {
    log('\n📝 Testing Registration API...', 'blue');
    
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, {
            name: testUser.name,
            email: testUser.email,
            password: testUser.password,
            phone: testUser.phone,
            role: testUser.role
        });

        log('✅ Registration API call successful!', 'green');
        log(`   Status: ${response.status}`, 'green');
        log(`   Message: ${response.data.message}`, 'green');
        log(`   User ID: ${response.data.user.id}`, 'green');
        log(`   Token: ${response.data.user.token.substring(0, 20)}...`, 'green');
        
        return response.data.user.token;
    } catch (error) {
        log('❌ Registration API call failed', 'red');
        if (error.response) {
            log(`   Status: ${error.response.status}`, 'red');
            log(`   Message: ${error.response.data.message}`, 'red');
        } else {
            log(`   Error: ${error.message}`, 'red');
        }
        return null;
    }
}

async function testLoginAPI() {
    log('\n🔐 Testing Login API...', 'blue');
    
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
            email: testUser.email,
            password: testUser.password
        });

        log('✅ Login API call successful!', 'green');
        log(`   Status: ${response.status}`, 'green');
        log(`   User ID: ${response.data._id}`, 'green');
        log(`   Email: ${response.data.email}`, 'green');
        log(`   Name: ${response.data.name}`, 'green');
        log(`   Token: ${response.data.token.substring(0, 20)}...`, 'green');
        
        return response.data.token;
    } catch (error) {
        log('❌ Login API call failed', 'red');
        if (error.response) {
            log(`   Status: ${error.response.status}`, 'red');
            log(`   Message: ${error.response.data.message}`, 'red');
        } else {
            log(`   Error: ${error.message}`, 'red');
        }
        return null;
    }
}

async function testProtectedRoute(token) {
    log('\n🛡️ Testing Protected Route...', 'blue');
    
    try {
        const response = await axios.get(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        log('✅ Protected route access successful!', 'green');
        log(`   Status: ${response.status}`, 'green');
        log(`   User ID: ${response.data._id}`, 'green');
        log(`   Email: ${response.data.email}`, 'green');
        
        return true;
    } catch (error) {
        log('❌ Protected route access failed', 'red');
        if (error.response) {
            log(`   Status: ${error.response.status}`, 'red');
            log(`   Message: ${error.response.data.message}`, 'red');
        } else {
            log(`   Error: ${error.message}`, 'red');
        }
        return false;
    }
}

async function testLogoutAPI(token) {
    log('\n🚪 Testing Logout API...', 'blue');
    
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        log('✅ Logout API call successful!', 'green');
        log(`   Status: ${response.status}`, 'green');
        log(`   Message: ${response.data.message}`, 'green');
        
        return true;
    } catch (error) {
        log('❌ Logout API call failed', 'red');
        if (error.response) {
            log(`   Status: ${error.response.status}`, 'red');
            log(`   Message: ${error.response.data.message}`, 'red');
        } else {
            log(`   Error: ${error.message}`, 'red');
        }
        return false;
    }
}

async function runFrontendTest() {
    log('🚀 Starting Frontend API Flow Test', 'blue');
    log('==================================', 'blue');
    log('Make sure your backend server is running on port 5000!', 'yellow');
    
    // Test registration
    const registrationToken = await testRegistrationAPI();
    if (!registrationToken) {
        log('❌ Registration failed - stopping here', 'red');
        return;
    }

    // Test login
    const loginToken = await testLoginAPI();
    if (!loginToken) {
        log('❌ Login failed', 'red');
    }

    // Test protected route with registration token
    const protectedRouteSuccess = await testProtectedRoute(registrationToken);
    
    // Test logout
    const logoutSuccess = await testLogoutAPI(registrationToken);

    // Summary
    log('\n📊 Frontend API Test Summary', 'blue');
    log('============================', 'blue');
    
    const tests = [
        { name: 'Registration API', passed: !!registrationToken },
        { name: 'Login API', passed: !!loginToken },
        { name: 'Protected Route', passed: protectedRouteSuccess },
        { name: 'Logout API', passed: logoutSuccess }
    ];

    const passedTests = tests.filter(test => test.passed).length;
    
    tests.forEach(test => {
        const status = test.passed ? '✅' : '❌';
        const color = test.passed ? 'green' : 'red';
        log(`${status} ${test.name}: ${test.passed ? 'Working' : 'Failed'}`, color);
    });

    if (passedTests === tests.length) {
        log('\n🎉 ALL FRONTEND API TESTS PASSED!', 'green');
        log('✅ Your backend API is ready for frontend integration!', 'green');
        log('   You can now use these endpoints in your React frontend.', 'green');
    } else {
        log(`\n⚠️ ${tests.length - passedTests} test(s) failed`, 'yellow');
        log('   Please check the errors above and fix them.', 'yellow');
    }
}

// Check if backend server is running
async function checkServerStatus() {
    try {
        await axios.get(`${API_BASE_URL}/auth/me`, { timeout: 3000 });
        return true;
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            log('❌ Backend server is not running!', 'red');
            log('   Please start your backend server with: npm start', 'red');
            return false;
        }
        return true; // Other errors might be expected
    }
}

// Run the test
async function main() {
    const serverRunning = await checkServerStatus();
    if (!serverRunning) {
        process.exit(1);
    }
    
    await runFrontendTest();
}

main().catch(error => {
    log('❌ Test script failed with error:', 'red');
    log(error.message, 'red');
    process.exit(1);
}); 