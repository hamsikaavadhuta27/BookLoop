/**
 * Shared catalog used by the API.
 * Add a new category object here when you want more options.
 */
const categories = [
  {
    id: 'btech',
    name: 'B.Tech',
    type: 'academic',
    branches: ['CSE', 'ECE', 'EEE', 'Mechanical', 'Civil']
  },
  {
    id: 'mbbs',
    name: 'MBBS',
    type: 'academic',
    branches: ['General']
  },
  {
    id: 'intermediate',
    name: 'Intermediate',
    type: 'academic',
    branches: ['MPC', 'BiPC', 'MEC', 'CEC']
  },
  {
    id: 'degree',
    name: 'Degree',
    type: 'academic',
    branches: ['B.Sc', 'B.Com', 'BA', 'BBA']
  },
  {
    id: 'pg',
    name: 'PG',
    type: 'academic',
    branches: ['M.Tech', 'MBA', 'M.Sc', 'MA']
  },
  {
    id: 'fiction',
    name: 'Fiction',
    type: 'non-academic',
    branches: []
  },
  {
    id: 'non-fiction',
    name: 'Non-fiction',
    type: 'non-academic',
    branches: []
  },
  {
    id: 'competitive',
    name: 'Competitive Exams',
    type: 'non-academic',
    branches: ['GATE', 'UPSC', 'EAMCET', 'NEET']
  },
  {
    id: 'self-help',
    name: 'Self-help',
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
  'Madhapur'
];

const conditions = ['Like New', 'Good', 'Fair', 'Acceptable'];

const years = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  'Semester 1',
  'Semester 2',
  'Not applicable'
];

module.exports = {
  categories,
  locations,
  conditions,
  years
};
