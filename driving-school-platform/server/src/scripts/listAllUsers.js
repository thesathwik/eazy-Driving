require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Learner = require('../models/Learner');
const Instructor = require('../models/Instructor');

const listAllUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eazydriving');
    console.log('✅ Connected to MongoDB\n');

    // Get all users
    const users = await User.find({}).sort({ createdAt: -1 });
    const learners = await Learner.find({}).populate('user');
    const instructors = await Instructor.find({}).populate('user');

    console.log('=' .repeat(80));
    console.log('📊 DATABASE USERS SUMMARY');
    console.log('=' .repeat(80));
    console.log(`Total Users: ${users.length}`);
    console.log(`Total Learners: ${learners.length}`);
    console.log(`Total Instructors: ${instructors.length}`);
    console.log('=' .repeat(80));
    console.log('\n');

    // Display all learners
    console.log('🎓 LEARNERS (' + learners.length + ')');
    console.log('-' .repeat(80));

    if (learners.length === 0) {
      console.log('No learners found in database.\n');
    } else {
      learners.forEach((learner, index) => {
        const user = learner.user;
        console.log(`\n${index + 1}. ${user.firstName} ${user.lastName}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Phone: ${user.phone || 'N/A'}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Profile Complete: ${learner.profileComplete ? 'Yes' : 'No'}`);

        if (learner.address) {
          console.log(`   Address: ${learner.address.suburb || 'N/A'}, ${learner.address.state || 'N/A'} ${learner.address.postcode || 'N/A'}`);
        }

        if (learner.preferences && learner.preferences.pickupLocation) {
          console.log(`   Pickup: ${learner.preferences.pickupLocation.suburb || 'N/A'}, ${learner.preferences.pickupLocation.postcode || 'N/A'}`);
        }

        console.log(`   Created: ${user.createdAt ? user.createdAt.toLocaleDateString() : 'N/A'}`);
      });
      console.log('\n');
    }

    // Display all instructors
    console.log('🚗 INSTRUCTORS (' + instructors.length + ')');
    console.log('-' .repeat(80));

    if (instructors.length === 0) {
      console.log('No instructors found in database.\n');
    } else {
      instructors.forEach((instructor, index) => {
        const user = instructor.user;
        console.log(`\n${index + 1}. ${user.firstName} ${user.lastName}${instructor.preferredFirstName ? ' (' + instructor.preferredFirstName + ')' : ''}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Phone: ${user.phone || 'N/A'}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Profile Complete: ${instructor.profileComplete ? 'Yes' : 'No'}`);
        console.log(`   Gender: ${instructor.gender || 'N/A'}`);
        console.log(`   Postcode: ${instructor.postcode || 'N/A'}`);

        if (instructor.serviceArea && instructor.serviceArea.suburbs) {
          const suburbs = instructor.serviceArea.suburbs.slice(0, 5).join(', ');
          const moreCount = instructor.serviceArea.suburbs.length > 5 ? ` (+ ${instructor.serviceArea.suburbs.length - 5} more)` : '';
          console.log(`   Service Areas: ${suburbs}${moreCount}`);
        }

        if (instructor.vehicle && instructor.vehicle.transmission) {
          console.log(`   Vehicle: ${instructor.vehicle.transmission.toUpperCase()}`);
        }

        if (instructor.rating) {
          console.log(`   Rating: ${instructor.rating.average}/5 (${instructor.rating.count} reviews)`);
        }

        console.log(`   Created: ${user.createdAt ? user.createdAt.toLocaleDateString() : 'N/A'}`);
      });
      console.log('\n');
    }

    // Display users without profiles
    const learnerUserIds = learners.map(l => l.user._id.toString());
    const instructorUserIds = instructors.map(i => i.user._id.toString());
    const usersWithoutProfiles = users.filter(u =>
      !learnerUserIds.includes(u._id.toString()) &&
      !instructorUserIds.includes(u._id.toString())
    );

    if (usersWithoutProfiles.length > 0) {
      console.log('👤 USERS WITHOUT PROFILES (' + usersWithoutProfiles.length + ')');
      console.log('-' .repeat(80));
      usersWithoutProfiles.forEach((user, index) => {
        console.log(`\n${index + 1}. ${user.firstName} ${user.lastName}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Created: ${user.createdAt ? user.createdAt.toLocaleDateString() : 'N/A'}`);
      });
      console.log('\n');
    }

    console.log('=' .repeat(80));

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

listAllUsers();
