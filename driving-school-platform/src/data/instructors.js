export const instructors = [
  {
    id: 1,
    name: 'Michael Chen',
    avatar: 'M',
    rating: 4.9,
    reviewCount: 156,
    experience: 8,
    transmission: 'Both',
    location: 'Parramatta, NSW 2150',
    vehicle: '2023 Toyota Corolla',
    specialties: ['Nervous learners', 'Test preparation', 'Highway driving'],
    pricePerHour: 65,
    verified: true,
    topRated: true,
    bio: 'Experienced instructor specializing in building confidence for nervous learners.'
  },
  {
    id: 2,
    name: 'Emma Thompson',
    avatar: 'E',
    rating: 4.8,
    reviewCount: 142,
    experience: 6,
    transmission: 'Automatic',
    location: 'Melbourne CBD, VIC 3000',
    vehicle: '2022 Honda Civic',
    specialties: ['First-time drivers', 'Parking skills', 'Defensive driving'],
    pricePerHour: 60,
    verified: true,
    topRated: true,
    bio: 'Patient and friendly instructor with high first-time pass rates.'
  },
  {
    id: 3,
    name: 'James Wilson',
    avatar: 'J',
    rating: 4.9,
    reviewCount: 189,
    experience: 10,
    transmission: 'Manual',
    location: 'Brisbane City, QLD 4000',
    vehicle: '2023 Mazda 3',
    specialties: ['Manual transmission', 'Advanced techniques', 'Test routes'],
    pricePerHour: 70,
    verified: true,
    topRated: true,
    bio: 'Specialist in manual transmission with extensive test route knowledge.'
  },
  {
    id: 4,
    name: 'Sophie Anderson',
    avatar: 'S',
    rating: 4.7,
    reviewCount: 98,
    experience: 5,
    transmission: 'Both',
    location: 'Blacktown, NSW 2148',
    vehicle: '2022 Hyundai i30',
    specialties: ['Beginner friendly', 'Logbook hours', 'City driving'],
    pricePerHour: 58,
    verified: true,
    topRated: false,
    bio: 'Enthusiastic instructor focused on making learning fun and effective.'
  },
  {
    id: 5,
    name: 'David Kumar',
    avatar: 'D',
    rating: 4.8,
    reviewCount: 167,
    experience: 7,
    transmission: 'Automatic',
    location: 'Adelaide CBD, SA 5000',
    vehicle: '2023 Kia Cerato',
    specialties: ['Test packages', 'Mature age learners', 'Refresher courses'],
    pricePerHour: 62,
    verified: true,
    topRated: true,
    bio: 'Specializing in mature age learners and refresher training.'
  },
  {
    id: 6,
    name: 'Rachel Foster',
    avatar: 'R',
    rating: 4.9,
    reviewCount: 201,
    experience: 9,
    transmission: 'Both',
    location: 'Penrith, NSW 2750',
    vehicle: '2022 Volkswagen Golf',
    specialties: ['Female instructor', 'Test preparation', 'Intensive courses'],
    pricePerHour: 68,
    verified: true,
    topRated: true,
    bio: 'Female instructor offering intensive courses and comprehensive test prep.'
  },
  {
    id: 7,
    name: 'Alex Patel',
    avatar: 'A',
    rating: 4.8,
    reviewCount: 134,
    experience: 6,
    transmission: 'Automatic',
    location: 'Perth CBD, WA 6000',
    vehicle: '2023 Toyota Yaris',
    specialties: ['P-plate preparation', 'Defensive driving', 'City navigation'],
    pricePerHour: 63,
    verified: true,
    topRated: true,
    bio: 'Experienced instructor with excellent test pass rates in Perth metro area.'
  },
  {
    id: 8,
    name: 'Jessica Lee',
    avatar: 'J',
    rating: 4.9,
    reviewCount: 178,
    experience: 9,
    transmission: 'Both',
    location: 'Bondi Junction, NSW 2022',
    vehicle: '2022 Mazda 2',
    specialties: ['Eastern suburbs specialist', 'Beach driving', 'Confident driving'],
    pricePerHour: 72,
    verified: true,
    topRated: true,
    bio: 'Eastern suburbs specialist with extensive local knowledge and high success rates.'
  },
  {
    id: 9,
    name: 'Mohammed Hassan',
    avatar: 'M',
    rating: 4.7,
    reviewCount: 145,
    experience: 7,
    transmission: 'Manual',
    location: 'Canberra City, ACT 2601',
    vehicle: '2023 Volkswagen Polo',
    specialties: ['Manual transmission', 'Roundabout mastery', 'Test preparation'],
    pricePerHour: 66,
    verified: true,
    topRated: true,
    bio: 'Canberra-based instructor specializing in manual transmission and roundabouts.'
  },
  {
    id: 10,
    name: 'Sarah Williams',
    avatar: 'S',
    rating: 4.8,
    reviewCount: 162,
    experience: 8,
    transmission: 'Automatic',
    location: 'Gold Coast, QLD 4217',
    vehicle: '2022 Honda Jazz',
    specialties: ['Tourist areas', 'Highway confidence', 'Mature learners'],
    pricePerHour: 64,
    verified: true,
    topRated: true,
    bio: 'Gold Coast instructor with patience and expertise for mature age learners.'
  },
  {
    id: 11,
    name: 'Tom Richards',
    avatar: 'T',
    rating: 4.9,
    reviewCount: 195,
    experience: 11,
    transmission: 'Both',
    location: 'Geelong, VIC 3220',
    vehicle: '2023 Toyota Corolla',
    specialties: ['Regional Victoria', 'Country driving', 'All weather conditions'],
    pricePerHour: 61,
    verified: true,
    topRated: true,
    bio: 'Highly experienced instructor serving Geelong and surrounding regional areas.'
  },
  {
    id: 12,
    name: 'Lisa Nguyen',
    avatar: 'L',
    rating: 4.8,
    reviewCount: 151,
    experience: 6,
    transmission: 'Automatic',
    location: 'Chatswood, NSW 2067',
    vehicle: '2022 Kia Rio',
    specialties: ['North Shore specialist', 'Parking expertise', 'Nervous beginners'],
    pricePerHour: 67,
    verified: true,
    topRated: true,
    bio: 'Patient North Shore instructor specializing in building confidence for nervous learners.'
  }
];

export const getInstructorById = (id) => {
  return instructors.find(instructor => instructor.id === parseInt(id));
};

export const filterInstructors = (filters) => {
  return instructors.filter(instructor => {
    if (filters.location && !instructor.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (filters.transmission && filters.transmission !== 'both') {
      if (instructor.transmission.toLowerCase() !== 'both' &&
          instructor.transmission.toLowerCase() !== filters.transmission.toLowerCase()) {
        return false;
      }
    }
    return true;
  });
};
