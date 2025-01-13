import React from 'react';

export interface SpecialtyTest {
  id: number;
  name: string;
  description: string;
  price: number;
  parameters: string[];
  preparation: string[];
  turnaroundTime: string;
  category: string;
}

export const specialtyTests: SpecialtyTest[] = [
  {
    id: 1,
    name: 'Allergy Tests',
    description: 'Comprehensive allergy testing to identify specific allergens causing reactions. Includes tests for food allergies, environmental allergens, and seasonal allergies.',
    price: 2999,
    parameters: [
      'Food Allergen Panel',
      'Environmental Allergen Panel',
      'Seasonal Allergen Panel',
      'Drug Allergy Testing',
      'Skin Prick Testing',
      'IgE Antibody Testing'
    ],
    preparation: [
      'Avoid antihistamines for 7 days before testing',
      'Continue other regular medications unless advised otherwise',
      'Wear comfortable clothing',
      'Inform about any recent allergic reactions'
    ],
    turnaroundTime: '3-5 days',
    category: 'Allergy'
  },
  {
    id: 2,
    name: 'Hormone Tests',
    description: 'Comprehensive hormone panel to evaluate endocrine function and hormone levels. Essential for diagnosing hormonal imbalances and monitoring hormone therapy.',
    price: 3499,
    parameters: [
      'Estrogen Levels',
      'Testosterone Levels',
      'Cortisol Levels',
      'Growth Hormone',
      'Prolactin',
      'DHEA Levels'
    ],
    preparation: [
      'Fasting for 8-12 hours required',
      'Early morning testing preferred',
      'Avoid strenuous exercise 24 hours before',
      'Report any hormone medications'
    ],
    turnaroundTime: '2-3 days',
    category: 'Hormone'
  },
  {
    id: 3,
    name: 'Genetic Tests',
    description: 'Advanced genetic testing to analyze DNA and identify genetic variations. Helps understand genetic predispositions to various conditions and personalize healthcare.',
    price: 9999,
    parameters: [
      'DNA Sequencing',
      'Genetic Mutation Analysis',
      'Hereditary Disease Screening',
      'Pharmacogenetic Testing',
      'Cancer Gene Testing',
      'Carrier Status Testing'
    ],
    preparation: [
      'No special physical preparation needed',
      'Bring family medical history',
      'Genetic counseling session required',
      'Complete consent forms'
    ],
    turnaroundTime: '14-21 days',
    category: 'Genetic'
  }
];
