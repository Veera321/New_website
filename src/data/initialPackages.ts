export interface HealthPackage {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  tests: string[];
  category: string;
  ageGroup?: string;
  gender?: 'male' | 'female' | 'all';
  duration?: string;
}

export const initialPackages: HealthPackage[] = [
  {
    id: 1,
    name: 'Basic Health Package',
    description: 'Essential health checkup including blood tests, urine analysis, and basic vital checks.',
    price: 1999,
    image: '/images/packages/basic-health.jpg',
    tests: ['Complete Blood Count', 'Urine Analysis', 'Blood Pressure', 'BMI Check'],
    category: 'basic',
    ageGroup: '18+ years',
    gender: 'all',
    duration: '2-3 hours'
  },
  {
    id: 2,
    name: 'Comprehensive Health Package',
    description: 'Complete health assessment with advanced diagnostics and specialist consultation.',
    price: 4999,
    image: '/images/packages/comprehensive-health.jpg',
    tests: ['Full Body Check', 'Cardiac Assessment', 'Diabetes Screening', 'Thyroid Profile'],
    category: 'comprehensive',
    ageGroup: 'All ages',
    gender: 'all',
    duration: '4-5 hours'
  },
  {
    id: 3,
    name: 'Women Health Package',
    description: 'Specialized health package designed for women\'s wellness and preventive care.',
    price: 3499,
    image: '/images/packages/women-health.jpg',
    tests: ['Gynecological Exam', 'Mammogram', 'Bone Density', 'Thyroid Function'],
    category: 'women-health',
    ageGroup: '18+ years',
    gender: 'female',
    duration: '3-4 hours'
  },
  {
    id: 4,
    name: 'Men Health Package',
    description: 'Tailored health package addressing common men\'s health concerns.',
    price: 3499,
    image: '/images/packages/men-health.jpg',
    tests: ['PSA Test', 'Cardiac Risk Assessment', 'Liver Function', 'Testosterone Levels'],
    category: 'men-health',
    ageGroup: '18+ years',
    gender: 'male',
    duration: '3-4 hours'
  },
  {
    id: 5,
    name: 'Senior Citizen Package',
    description: 'Comprehensive health screening designed for adults over 60.',
    price: 5999,
    image: '/images/packages/senior-health.jpg',
    tests: ['Bone Health', 'Vision Test', 'Hearing Test', 'Memory Assessment'],
    category: 'senior',
    ageGroup: '60+ years',
    gender: 'all',
    duration: '4-5 hours'
  },
];
