/**
 * Sample listings used when MongoDB is not connected,
 * and also used to seed MongoDB (npm run seed).
 */
const sampleBooks = [
  {
    title: 'Java: The Complete Reference',
    author: 'Herbert Schildt',
    edition: '12th Edition',
    image: '/images/covers/java.svg',
    category: 'B.Tech',
    branch: 'CSE',
    year: '2nd Year',
    condition: 'Good',
    price: 350,
    location: 'Koti',
    description:
      'Covers core Java, OOP, collections, and examples. Highlighted a few chapters. No missing pages. Perfect for 2nd year CSE labs.',
    seller: {
      name: 'Aarav Reddy',
      email: 'aarav.reddy@student.example',
      contact: '9000000001'
    },
    available: true,
    createdAt: new Date('2026-08-12')
  },
  {
    title: 'Data Structures Using C',
    author: 'Reema Thareja',
    edition: '2nd Edition',
    image: '/images/covers/dsa.svg',
    category: 'B.Tech',
    branch: 'CSE',
    year: '2nd Year',
    condition: 'Like New',
    price: 300,
    location: 'Ameerpet',
    description:
      'Almost unused. Includes stacks, queues, trees, and graphs. Great for internals and lab exams.',
    seller: {
      name: 'Sneha Rao',
      email: 'sneha.rao@student.example',
      contact: '9000000002'
    },
    available: true,
    createdAt: new Date('2026-08-18')
  },
  {
    title: 'Higher Engineering Mathematics',
    author: 'B.S. Grewal',
    edition: '44th Edition',
    image: '/images/covers/maths.svg',
    category: 'B.Tech',
    branch: '',
    year: '1st Year',
    condition: 'Fair',
    price: 250,
    location: 'Secunderabad',
    description:
      'Classic maths textbook. Some pencil marks in differential equations. Binding is intact.',
    seller: {
      name: 'Rohan Naik',
      email: 'rohan.naik@student.example',
      contact: '9000000003'
    },
    available: true,
    createdAt: new Date('2026-07-30')
  },
  {
    title: 'Digital Electronics',
    author: 'R.P. Jain',
    edition: '4th Edition',
    image: '/images/covers/digital.svg',
    category: 'B.Tech',
    branch: 'ECE',
    year: '2nd Year',
    condition: 'Good',
    price: 280,
    location: 'Paradise',
    description:
      'Logic gates, combinational and sequential circuits. Notes on a few pages. Pickup near Paradise metro.',
    seller: {
      name: 'Fatima Khan',
      email: 'fatima.khan@student.example',
      contact: '9000000004'
    },
    available: true,
    createdAt: new Date('2026-08-22')
  },
  {
    title: 'Strength of Materials',
    author: 'R.K. Bansal',
    edition: '6th Edition',
    image: '/images/covers/som.svg',
    category: 'B.Tech',
    branch: 'Civil',
    year: '3rd Year',
    condition: 'Good',
    price: 400,
    location: 'Dilsukhnagar',
    description:
      'Useful for Civil 3rd year. Solved problems are clean. Cover has slight wear.',
    seller: {
      name: 'Vikram Singh',
      email: 'vikram.singh@student.example',
      contact: '9000000005'
    },
    available: true,
    createdAt: new Date('2026-08-05')
  },
  {
    title: 'A Textbook of Fluid Mechanics',
    author: 'R.K. Bansal',
    edition: 'Revised Edition',
    image: '/images/covers/fluid.svg',
    category: 'B.Tech',
    branch: 'Mechanical',
    year: '3rd Year',
    condition: 'Acceptable',
    price: 220,
    location: 'Secunderabad',
    description:
      'Working copy for Mechanical students. Highlighted sections. Price is flexible for college pickup.',
    seller: {
      name: 'Meera Iyer',
      email: 'meera.iyer@student.example',
      contact: '9000000006'
    },
    available: true,
    createdAt: new Date('2026-07-21')
  },
  {
    title: 'Gray\'s Anatomy for Students',
    author: 'Drake, Vogl & Mitchell',
    edition: '4th Edition',
    image: '/images/covers/anatomy.svg',
    category: 'MBBS',
    branch: 'General',
    year: '1st Year',
    condition: 'Like New',
    price: 650,
    location: 'Koti',
    description:
      'Kept with care. Colour diagrams are complete. Ideal for 1st year MBBS.',
    seller: {
      name: 'Ananya Sharma',
      email: 'ananya.sharma@student.example',
      contact: '9000000007'
    },
    available: true,
    createdAt: new Date('2026-08-25')
  },
  {
    title: 'Intermediate Physics Volume 1',
    author: 'Telugu Akademi',
    edition: 'Latest',
    image: '/images/covers/physics.svg',
    category: 'Intermediate',
    branch: 'MPC',
    year: '1st Year',
    condition: 'Good',
    price: 180,
    location: 'Ameerpet',
    description:
      'First year Intermediate Physics. Board exam notes inside the last chapter.',
    seller: {
      name: 'Karthik Varma',
      email: 'karthik.varma@student.example',
      contact: '9000000008'
    },
    available: true,
    createdAt: new Date('2026-08-01')
  },
  {
    title: 'Harry Potter and the Philosopher\'s Stone',
    author: 'J.K. Rowling',
    edition: 'Paperback',
    image: '/images/covers/potter.svg',
    category: 'Fiction',
    branch: '',
    year: 'Not applicable',
    condition: 'Good',
    price: 150,
    location: 'Madhapur',
    description:
      'A fun reread copy. No torn pages. Meet near Inorbit or college hostel.',
    seller: {
      name: 'Diya Patel',
      email: 'diya.patel@student.example',
      contact: '9000000009'
    },
    available: true,
    createdAt: new Date('2026-08-28')
  },
  {
    title: 'Atomic Habits',
    author: 'James Clear',
    edition: 'Paperback',
    image: '/images/covers/habits.svg',
    category: 'Self-help',
    branch: '',
    year: 'Not applicable',
    condition: 'Like New',
    price: 200,
    location: 'Kukatpally',
    description:
      'Barely read. No highlights. Pickup from KPHB or Kukatpally metro.',
    seller: {
      name: 'Nikhil Joshi',
      email: 'nikhil.joshi@student.example',
      contact: '9000000010'
    },
    available: true,
    createdAt: new Date('2026-09-01')
  },
  {
    title: 'GATE CSE Previous Year Papers',
    author: 'Made Easy',
    edition: '2025 Edition',
    image: '/images/covers/gate.svg',
    category: 'Competitive Exams',
    branch: 'GATE',
    year: '4th Year',
    condition: 'Good',
    price: 450,
    location: 'Madhapur',
    description:
      'Solved papers with short notes. Useful if you are starting GATE prep this semester.',
    seller: {
      name: 'Priya Nair',
      email: 'priya.nair@student.example',
      contact: '9000000011'
    },
    available: true,
    createdAt: new Date('2026-08-15')
  },
  {
    title: 'Organic Chemistry',
    author: 'Morrison and Boyd',
    edition: '7th Edition',
    image: '/images/covers/organic.svg',
    category: 'Degree',
    branch: 'B.Sc',
    year: '2nd Year',
    condition: 'Fair',
    price: 220,
    location: 'Dilsukhnagar',
    description:
      'Standard B.Sc chemistry text. Some yellowing on edges. All chapters present.',
    seller: {
      name: 'Sanjay Kumar',
      email: 'sanjay.kumar@student.example',
      contact: '9000000012'
    },
    available: false,
    createdAt: new Date('2026-06-18')
  }
];

module.exports = sampleBooks;
