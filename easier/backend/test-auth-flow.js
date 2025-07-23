const mongoose = require('mongoose');
const User = require('./Models/User');
require('dotenv').config();

// Test user data
const testUser = {
    name: 'Test User',
    email: 'testuser@example.com',
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

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
        log('✅ Connected to MongoDB', 'green');
        return true;
    } catch (error) {
        log('❌ Failed to connect to MongoDB', 'red');
        log(`Error: ${error.message}`, 'red');
        return false;
    }
}

async function clearTestUser() {
    try {
        await User.deleteOne({ email: testUser.email });
        log('🧹 Cleared existing test user', 'yellow');
    } catch (error) {
        log('⚠️ Error clearing test user:', 'yellow');
        log(`Error: ${error.message}`, 'yellow');
    }
}

async function testRegistration() {
    log('\n📝 Testing User Registration...', 'blue');
    
    try {
        // Simulate registration request
        const { name, email, password, phone, role } = testUser;
        
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { phonenumber: phone }] });
        if (existingUser) {
            log('❌ User already exists', 'red');
            return false;
        }

        // Validate email format
        if (!email || !email.trim()) {
            log('❌ Email is required', 'red');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const trimmedEmail = email.trim();
        if (!emailRegex.test(trimmedEmail)) {
            log('❌ Invalid email format', 'red');
            return false;
        }

        // Split name into firstname and lastname
        const nameParts = name.trim().split(' ');
        const firstname = nameParts[0] || '';
        const lastname = nameParts.slice(1).join(' ') || '';

        // Create new user
        const user = await User.create({
            username: email,
            email,
            password: password,
            firstname,
            lastname,
            address: 'Nairobi, Kenya',
            role: role || 'user',
            phonenumber: phone
        });

        log('✅ User registered successfully!', 'green');
        log(`   User ID: ${user._id}`, 'green');
        log(`   Email: ${user.email}`, 'green');
        log(`   Name: ${user.firstname} ${user.lastname}`, 'green');
        log(`   Role: ${user.role}`, 'green');
        
        return user;
    } catch (error) {
        log('❌ Registration failed', 'red');
        log(`Error: ${error.message}`, 'red');
        return false;
    }
}

async function testLogin(user) {
    log('\n🔐 Testing User Login...', 'blue');
    
    try {
        const { email, password } = testUser;
        
        // Find user and include password field
        const foundUser = await User.findOne({ email }).select('+password');
        
        if (!foundUser) {
            log('❌ User not found', 'red');
            return false;
        }

        // Check if account is active
        if (!foundUser.isActive) {
            log('❌ Account is deactivated', 'red');
            return false;
        }

        // Compare passwords
        const bcrypt = require('bcryptjs');
        const isPasswordValid = await bcrypt.compare(password, foundUser.password);
        
        if (!isPasswordValid) {
            log('❌ Invalid password', 'red');
            return false;
        }

        log('✅ Login successful!', 'green');
        log(`   User ID: ${foundUser._id}`, 'green');
        log(`   Email: ${foundUser.email}`, 'green');
        log(`   Name: ${foundUser.firstname} ${foundUser.lastname}`, 'green');
        log(`   Role: ${foundUser.role}`, 'green');
        
        return foundUser;
    } catch (error) {
        log('❌ Login failed', 'red');
        log(`Error: ${error.message}`, 'red');
        return false;
    }
}

async function testPasswordHashing() {
    log('\n🔒 Testing Password Hashing...', 'blue');
    
    try {
        const user = await User.findOne({ email: testUser.email }).select('+password');
        
        if (!user) {
            log('❌ User not found for password test', 'red');
            return false;
        }

        const bcrypt = require('bcryptjs');
        const isPasswordValid = await bcrypt.compare(testUser.password, user.password);
        
        if (isPasswordValid) {
            log('✅ Password is properly hashed and verifiable', 'green');
            log(`   Original password: ${testUser.password}`, 'green');
            log(`   Hashed password: ${user.password.substring(0, 20)}...`, 'green');
            return true;
        } else {
            log('❌ Password verification failed', 'red');
            return false;
        }
    } catch (error) {
        log('❌ Password test failed', 'red');
        log(`Error: ${error.message}`, 'red');
        return false;
    }
}

async function runCompleteTest() {
    log('🚀 Starting Complete Authentication Flow Test', 'blue');
    log('==============================================', 'blue');
    
    // Connect to database
    const connected = await connectDB();
    if (!connected) {
        log('❌ Cannot proceed without database connection', 'red');
        process.exit(1);
    }

    // Clear any existing test user
    await clearTestUser();

    // Test registration
    const registeredUser = await testRegistration();
    if (!registeredUser) {
        log('❌ Registration test failed - stopping here', 'red');
        await mongoose.disconnect();
        process.exit(1);
    }

    // Test password hashing
    const passwordTest = await testPasswordHashing();
    if (!passwordTest) {
        log('❌ Password hashing test failed', 'red');
    }

    // Test login
    const loggedInUser = await testLogin(registeredUser);
    if (!loggedInUser) {
        log('❌ Login test failed', 'red');
    }

    // Summary
    log('\n📊 Test Summary', 'blue');
    log('==============', 'blue');
    
    if (registeredUser && loggedInUser && passwordTest) {
        log('🎉 ALL TESTS PASSED!', 'green');
        log('✅ Registration: Working', 'green');
        log('✅ Password Hashing: Working', 'green');
        log('✅ Login: Working', 'green');
        log('\n🎯 Your authentication system is working correctly!', 'green');
        log('   You can now register and login users through your frontend.', 'green');
    } else {
        log('❌ Some tests failed', 'red');
        log('   Please check the errors above and fix them.', 'red');
    }

    // Clean up
    await clearTestUser();
    await mongoose.disconnect();
    log('\n🔌 Disconnected from database', 'yellow');
}

// Run the test
runCompleteTest().catch(error => {
    log('❌ Test script failed with error:', 'red');
    log(error.message, 'red');
    process.exit(1);
}); 