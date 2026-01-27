require('dotenv').config();
const mongoose = require('mongoose');
const Instructor = require('../models/Instructor');

const queryLocationData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eazydriving');
    console.log('✅ Connected to MongoDB\n');

    // New locations we just added
    const newLocations = [
      'Wacol', 'Inala', 'Boronia Heights', 'Browns Plains', 'Bundamba',
      'Yamanto', 'Deebing Heights', 'Brassall', 'Collingwood Park',
      'Bellbird Park', 'Goodna', 'Ellen Grove', 'South Ripley',
      'Raceview', 'Hillcrest', 'Doolandella'
    ];

    console.log('📍 Checking for instructors in new locations:\n');

    // Query instructors serving any of the new locations
    const instructorsInNewLocations = await Instructor.find({
      'serviceArea.suburbs': { $in: newLocations }
    }).populate('user', 'firstName lastName email');

    console.log(`Found ${instructorsInNewLocations.length} instructors serving the new locations:\n`);

    instructorsInNewLocations.forEach(instructor => {
      const matchingSuburbs = instructor.serviceArea.suburbs.filter(
        suburb => newLocations.includes(suburb)
      );
      console.log(`- ${instructor.user.firstName} ${instructor.user.lastName}`);
      console.log(`  Email: ${instructor.user.email}`);
      console.log(`  Serves: ${matchingSuburbs.join(', ')}`);
      console.log('');
    });

    // Get all unique suburbs currently in database
    console.log('\n📊 All suburbs currently served by instructors:\n');
    const allInstructors = await Instructor.find({}).select('serviceArea.suburbs');
    const allSuburbs = new Set();
    allInstructors.forEach(instructor => {
      if (instructor.serviceArea && instructor.serviceArea.suburbs) {
        instructor.serviceArea.suburbs.forEach(suburb => allSuburbs.add(suburb));
      }
    });

    const sortedSuburbs = Array.from(allSuburbs).sort();
    console.log(`Total unique suburbs: ${sortedSuburbs.length}`);
    console.log(sortedSuburbs.join(', '));

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

queryLocationData();
