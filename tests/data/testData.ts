// Test data moved from src/data/testData.ts
// This file contains test data and should not be included in production builds

export interface Test {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  requirements?: string[];
  sampleType?: string;
  reportTime?: string;
  fasting?: boolean;
}

const testData = {
  tests: [
    {
      id: 'test1',
      name: 'Complete Blood Count (CBC)',
      description: 'Comprehensive blood test that checks for various blood components',
      price: 500,
      category: 'blood-tests',
      requirements: ['8-12 hours fasting recommended'],
      sampleType: 'Blood',
      reportTime: '24 hours',
      fasting: true,
    },
    {
      id: 'test2',
      name: 'Lipid Profile',
      description: 'Measures different types of cholesterol and triglycerides',
      price: 600,
      category: 'blood-tests',
      requirements: ['12 hours fasting required'],
      sampleType: 'Blood',
      reportTime: '24 hours',
      fasting: true,
    },
    {
      id: 'test3',
      name: 'Thyroid Profile',
      description: 'Checks thyroid hormone levels',
      price: 800,
      category: 'hormone-tests',
      requirements: ['No special preparation needed'],
      sampleType: 'Blood',
      reportTime: '24-48 hours',
      fasting: false,
    },
    {
      id: 'test4',
      name: 'Blood Sugar (Fasting)',
      description: 'Measures blood glucose levels after fasting',
      price: 200,
      category: 'diabetes',
      requirements: ['8-12 hours fasting required'],
      sampleType: 'Blood',
      reportTime: '24 hours',
      fasting: true,
    },
    {
      id: 'test5',
      name: 'Vitamin D',
      description: 'Measures Vitamin D levels in blood',
      price: 1500,
      category: 'vitamin-tests',
      requirements: ['No special preparation needed'],
      sampleType: 'Blood',
      reportTime: '48 hours',
      fasting: false,
    },
  ] as Test[]
};

export const { tests } = testData;
