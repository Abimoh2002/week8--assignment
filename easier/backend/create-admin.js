const mongoose = require('mongoose');
const User = require('./Models/User');
require('dotenv').config();

// Admin user data
const adminUser = {
    name: 'Admin User',
    email: 'admin@mobigas.com',
    password: 'admin123',
    phone: '+254115479310',
    role: 'admin'
};

// Colors for console output
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    purple: '\x1b[35m',
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

async function createAdminUser() {
    log('\n👑 Creating Admin User...', 'purple');
    
    try {
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminUser.email });
        if (existingAdmin) {
            log('⚠️ Admin user already exists!', 'yellow');
            log(`   Email: ${existingAdmin.email}`, 'yellow');
            log(`   Role: ${existingAdmin.role}`, 'yellow');
            log(`   ID: ${existingAdmin._id}`, 'yellow');
            
            // Update role to admin if not already admin
            if (existingAdmin.role !== 'admin') {
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                log('✅ Updated existing user to admin role', 'green');
            }
            
            return existingAdmin;
        }

        // Split name into firstname and lastname
        const nameParts = adminUser.name.trim().split(' ');
        const firstname = nameParts[0] || '';
        const lastname = nameParts.slice(1).join(' ') || '';

        // Create new admin user
        const user = await User.create({
            username: adminUser.email,
            email: adminUser.email,
            password: adminUser.password,
            firstname,
            lastname,
            address: 'Nairobi, Kenya',
            role: 'admin',
            phonenumber: adminUser.phone
        });

        log('✅ Admin user created successfully!', 'green');
        log(`   User ID: ${user._id}`, 'green');
        log(`   Email: ${user.email}`, 'green');
        log(`   Name: ${user.firstname} ${user.lastname}`, 'green');
        log(`   Role: ${user.role}`, 'green');
        
        return user;
    } catch (error) {
        log('❌ Failed to create admin user', 'red');
        log(`Error: ${error.message}`, 'red');
        return false;
    }
}

async function testAdminLogin() {
    log('\n🔐 Testing Admin Login...', 'blue');
    
    try {
        const { email, password } = adminUser;
        
        // Find admin user and include password field
        const foundUser = await User.findOne({ email }).select('+password');
        
        if (!foundUser) {
            log('❌ Admin user not found', 'red');
            return false;
        }

        // Check if account is active
        if (!foundUser.isActive) {
            log('❌ Admin account is deactivated', 'red');
            return false;
        }

        // Check if user is admin
        if (foundUser.role !== 'admin') {
            log('❌ User is not an admin', 'red');
            return false;
        }

        // Compare passwords
        const bcrypt = require('bcryptjs');
        const isPasswordValid = await bcrypt.compare(password, foundUser.password);
        
        if (!isPasswordValid) {
            log('❌ Invalid password', 'red');
            return false;
        }

        log('✅ Admin login successful!', 'green');
        log(`   User ID: ${foundUser._id}`, 'green');
        log(`   Email: ${foundUser.email}`, 'green');
        log(`   Name: ${foundUser.firstname} ${foundUser.lastname}`, 'green');
        log(`   Role: ${foundUser.role}`, 'green');
        
        return foundUser;
    } catch (error) {
        log('❌ Admin login test failed', 'red');
        log(`Error: ${error.message}`, 'red');
        return false;
    }
}

async function showAdminInstructions() {
    log('\n📋 Admin Login Instructions', 'purple');
    log('============================', 'purple');
    log('To sign in as admin:', 'blue');
    log('1. Go to your login page', 'blue');
    log('2. Use these credentials:', 'blue');
    log(`   Email: ${adminUser.email}`, 'green');
    log(`   Password: ${adminUser.password}`, 'green');
    log('3. After login, you\'ll see admin features in the header', 'blue');
    log('4. Admin features include:', 'blue');
    log('   - Admin Dashboard', 'blue');
    log('   - User Management', 'blue');
    log('   - Order Management', 'blue');
    log('   - Product Management', 'blue');
    log('\n🔗 Admin Routes:', 'purple');
    log('- /admin/users - Manage users', 'blue');
    log('- /admin/orders - Manage orders', 'blue');
    log('- /admin/products - Manage products', 'blue');
}

async function runAdminSetup() {
    log('👑 Admin User Setup', 'purple');
    log('==================', 'purple');
    
    // Connect to database
    const connected = await connectDB();
    if (!connected) {
        log('❌ Cannot proceed without database connection', 'red');
        process.exit(1);
    }

    // Create admin user
    const adminUser = await createAdminUser();
    if (!adminUser) {
        log('❌ Failed to create admin user', 'red');
        await mongoose.disconnect();
        process.exit(1);
    }

    // Test admin login
    const loginTest = await testAdminLogin();
    if (!loginTest) {
        log('❌ Admin login test failed', 'red');
    }

    // Show instructions
    await showAdminInstructions();

    // Summary
    log('\n📊 Admin Setup Summary', 'purple');
    log('=====================', 'purple');
    
    if (adminUser && loginTest) {
        log('🎉 ADMIN SETUP COMPLETE!', 'green');
        log('✅ Admin user created', 'green');
        log('✅ Admin login working', 'green');
        log('\n🎯 You can now sign in as admin using the credentials above!', 'green');
    } else {
        log('❌ Some steps failed', 'red');
        log('   Please check the errors above and fix them.', 'red');
    }

    // Clean up
    await mongoose.disconnect();
    log('\n🔌 Disconnected from database', 'yellow');
}

// Run the setup
runAdminSetup().catch(error => {
    log('❌ Admin setup failed with error:', 'red');
    log(error.message, 'red');
    process.exit(1);
}); 