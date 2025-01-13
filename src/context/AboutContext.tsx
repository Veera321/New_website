import React, { createContext, useContext, useState, useEffect } from 'react';

interface AboutContent {
  content: string;
  lastUpdated: string;
}

interface AboutContextType {
  aboutContent: AboutContent;
  updateAboutContent: (content: string) => void;
}

const AboutContext = createContext<AboutContextType | undefined>(undefined);

const defaultAboutContent = {
  content: `# About PS Healthcare

## Our Vision
To be the leading healthcare diagnostics provider, delivering accurate, timely, and affordable medical testing services to our community.

## Our Mission
At PS Healthcare, we are committed to:
- Providing high-quality diagnostic services
- Ensuring accurate and reliable test results
- Making healthcare accessible to all
- Maintaining the highest standards of patient care

## Our Values
- Excellence in Service
- Patient-Centric Care
- Integrity and Trust
- Innovation in Healthcare
- Professional Ethics

## Our Services
We offer a comprehensive range of diagnostic services:
- Routine Blood Tests
- Advanced Diagnostic Tests
- Health Packages
- Home Collection Services
- Online Reports
- Expert Consultation

## Our Team
Our team consists of highly qualified healthcare professionals:
- Experienced Pathologists
- Skilled Technicians
- Dedicated Support Staff
- Professional Phlebotomists

## Quality Assurance
We maintain the highest standards of quality through:
- State-of-the-art Equipment
- Regular Quality Checks
- Standardized Procedures
- Continuous Training

## Why Choose Us
- Accurate Results
- Quick Turnaround Time
- Affordable Rates
- Home Collection Service
- Online Report Access
- Expert Consultation

Contact us today to experience healthcare services that put you first.`,
  lastUpdated: new Date().toISOString(),
};

export const AboutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [aboutContent, setAboutContent] = useState<AboutContent>(defaultAboutContent);

  useEffect(() => {
    const savedContent = localStorage.getItem('aboutContent');
    if (savedContent) {
      try {
        setAboutContent(JSON.parse(savedContent));
      } catch (error) {
        console.error('Error parsing about content:', error);
        setAboutContent(defaultAboutContent);
      }
    }
  }, []);

  const updateAboutContent = (content: string) => {
    const updatedContent = {
      content,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem('aboutContent', JSON.stringify(updatedContent));
    setAboutContent(updatedContent);
  };

  return (
    <AboutContext.Provider value={{ aboutContent, updateAboutContent }}>
      {children}
    </AboutContext.Provider>
  );
};

export const useAbout = () => {
  const context = useContext(AboutContext);
  if (context === undefined) {
    throw new Error('useAbout must be used within an AboutProvider');
  }
  return context;
};
