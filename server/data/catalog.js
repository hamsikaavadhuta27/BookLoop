/**
 * Shared catalog used by the API.
 * Academic categories + Non-academic genres and Hyderabad locations.
 */
const categories = [
  // Academic / Educational
  {
    id: 'btech',
    name: 'B.Tech',
    type: 'academic',
    branches: ['CSE', 'CSE (AI/ML)', 'CSE (Data Science)', 'IT', 'ECE', 'EEE', 'Mechanical', 'Civil', 'Other']
  },
  {
    id: 'computer-science',
    name: 'Computer Science',
    type: 'academic',
    branches: ['CSE', 'CSE (AI/ML)', 'CSE (Data Science)', 'IT', 'Software Engineering', 'Other']
  },
  {
    id: 'engineering',
    name: 'Engineering',
    type: 'academic',
    branches: ['ECE', 'EEE', 'Mechanical', 'Civil', 'Biotech', 'Chemical', 'Other']
  },
  {
    id: 'mbbs',
    name: 'MBBS',
    type: 'academic',
    branches: ['General Medicine', 'Anatomy', 'Physiology', 'Biochemistry', 'Pathology', 'Pharmacology', 'Other']
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    type: 'academic',
    branches: ['MPC', 'BiPC', 'MEC', 'CEC', 'Other']
  },
  {
    id: 'degree',
    name: 'Degree',
    type: 'academic',
    branches: ['B.Sc', 'B.Com', 'BA', 'BBA', 'BCA', 'Other']
  },
  {
    id: 'pg',
    name: 'PG',
    type: 'academic',
    branches: ['M.Tech', 'MBA', 'MCA', 'M.Sc', 'MA', 'Other']
  },
  {
    id: 'competitive',
    name: 'Competitive Exams',
    type: 'academic',
    branches: ['GATE', 'UPSC', 'EAMCET', 'NEET', 'CAT', 'GRE/IELTS', 'Other']
  },

  // Non-Academic / General
  {
    id: 'devotional',
    name: 'Devotional',
    type: 'non-academic',
    branches: []
  },
  {
    id: 'mystery',
    name: 'Mystery',
    type: 'non-academic',
    branches: []
  },
  {
    id: 'thriller',
    name: 'Thriller',
    type: 'non-academic',
    branches: []
  },
  {
    id: 'romance',
    name: 'Romance',
    type: 'non-academic',
    branches: []
  },
  {
    id: 'fiction',
    name: 'Fiction',
    type: 'non-academic',
    branches: []
  },
  {
    id: 'fantasy',
    name: 'Fantasy',
    type: 'non-academic',
    branches: []
  },
  {
    id: 'self-help',
    name: 'Self-help',
    type: 'non-academic',
    branches: []
  },
  {
    id: 'biography',
    name: 'Biography',
    type: 'non-academic',
    branches: []
  },
  {
    id: 'non-fiction',
    name: 'Non-fiction',
    type: 'non-academic',
    branches: []
  }
];

const locations = [
  'Koti',
  'Secunderabad',
  'Paradise',
  'Ameerpet',
  'Dilsukhnagar',
  'Kukatpally',
  'Madhapur',
  'Gachibowli',
  'Kondapur',
  'Hitech City',
  'Begumpet',
  'Banjara Hills',
  'Jubilee Hills',
  'LB Nagar',
  'Mehdipatnam',
  'Miyapur',
  'Uppal',
  'Tarnaka',
  'Nacharam',
  'Himayatnagar',
  'Abids',
  'Masab Tank',
  'Nallagandla',
  'Manikonda',
  'Attapur',
  'Vanasthalipuram',
  'Other'
];

const conditions = ['New', 'Like New', 'Very Good', 'Good', 'Fair', 'Acceptable', 'Used'];

const years = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  '1st Semester',
  '2nd Semester',
  '3rd Semester',
  '4th Semester',
  '5th Semester',
  '6th Semester',
  '7th Semester',
  '8th Semester',
  'Not applicable',
  'Other'
];

module.exports = {
  categories,
  locations,
  conditions,
  years
};
