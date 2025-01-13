import React from 'react';

export interface BloodTest {
  id: number;
  name: string;
  description: string;
  price: number;
  parameters: string[];
  preparation: string[];
  turnaroundTime: string;
  published: boolean;
}

export const bloodTests: BloodTest[] = [
  {
    id: 1,
    name: 'Complete Blood Count',
    description: 'A complete blood count (CBC) is a blood test used to evaluate your overall health and detect a wide range of disorders, including anemia, infection and leukemia.',
    price: 599,
    parameters: [
      'Red Blood Cell Count',
      'White Blood Cell Count',
      'Platelet Count',
      'Hemoglobin',
      'Hematocrit',
      'Mean Corpuscular Volume'
    ],
    preparation: [
      'Fasting for 8-12 hours may be required',
      'Avoid smoking before the test',
      'Inform about any medications'
    ],
    turnaroundTime: '24 hours',
    published: true
  },
  {
    id: 2,
    name: 'Lipid Profile',
    description: 'A lipid profile measures the levels of fats in your blood, including cholesterol and triglycerides. It helps assess your risk of heart disease.',
    price: 799,
    parameters: [
      'Total Cholesterol',
      'HDL Cholesterol',
      'LDL Cholesterol',
      'Triglycerides',
      'VLDL Cholesterol'
    ],
    preparation: [
      'Fasting for 9-12 hours required',
      'Avoid fatty foods 24 hours before',
      'Continue medications unless advised'
    ],
    turnaroundTime: '24 hours',
    published: true
  },
  {
    id: 3,
    name: 'Liver Function Test',
    description: 'Liver function tests help determine the health of your liver by measuring the levels of proteins, liver enzymes, and bilirubin in your blood.',
    price: 899,
    parameters: [
      'SGOT/AST',
      'SGPT/ALT',
      'Alkaline Phosphatase',
      'Total Bilirubin',
      'Total Proteins',
      'Albumin'
    ],
    preparation: [
      'Fasting for 8-10 hours required',
      'Avoid alcohol for 24 hours',
      'Continue regular medications'
    ],
    turnaroundTime: '24 hours',
    published: true
  },
  {
    id: 4,
    name: 'Kidney Function Test',
    description: 'Kidney function tests assess how well your kidneys are working by measuring various substances in your blood.',
    price: 699,
    parameters: [
      'Blood Urea Nitrogen',
      'Serum Creatinine',
      'Uric Acid',
      'Electrolytes',
      'eGFR'
    ],
    preparation: [
      'No special preparation needed',
      'Continue regular medications',
      'Stay well hydrated'
    ],
    turnaroundTime: '24 hours',
    published: true
  },
  {
    id: 5,
    name: 'Thyroid Profile',
    description: 'A thyroid profile checks the function of your thyroid gland by measuring various hormone levels in your blood.',
    price: 999,
    parameters: [
      'T3 (Triiodothyronine)',
      'T4 (Thyroxine)',
      'TSH (Thyroid Stimulating Hormone)'
    ],
    preparation: [
      'Early morning test preferred',
      'No fasting required',
      'Inform about thyroid medications'
    ],
    turnaroundTime: '24 hours',
    published: true
  },
  {
    id: 6,
    name: 'Diabetes Tests',
    description: 'Diabetes tests measure your blood glucose levels and help diagnose or monitor diabetes.',
    price: 499,
    parameters: [
      'Fasting Blood Sugar',
      'Post Prandial Blood Sugar',
      'HbA1c',
      'Insulin'
    ],
    preparation: [
      'Fasting for 8-12 hours required',
      'Avoid sugary foods 24 hours before',
      'Continue medications unless advised'
    ],
    turnaroundTime: '24 hours',
    published: true
  }
];
