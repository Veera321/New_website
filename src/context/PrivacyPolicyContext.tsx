import React, { createContext, useContext, useState, useEffect } from 'react';

interface PrivacyPolicy {
  content: string;
  lastUpdated: string;
}

interface PrivacyPolicyContextType {
  privacyPolicy: PrivacyPolicy;
  updatePrivacyPolicy: (content: string) => void;
}

const PrivacyPolicyContext = createContext<PrivacyPolicyContextType | undefined>(undefined);

const defaultPrivacyPolicy = {
  content: `
# Privacy Policy

## Introduction
Welcome to PS Pathology. This privacy policy outlines how we collect, use, and protect your personal information.

## Information We Collect
- Personal identification information (Name, email address, phone number, etc.)
- Medical history and test results
- Payment information

## How We Use Your Information
- To provide medical testing services
- To communicate about your test results
- To improve our services
- To process payments

## Data Protection
We implement various security measures to maintain the safety of your personal information.

## Contact Us
If you have any questions about this privacy policy, please contact us.
`,
  lastUpdated: new Date().toISOString(),
};

export const PrivacyPolicyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [privacyPolicy, setPrivacyPolicy] = useState<PrivacyPolicy>(defaultPrivacyPolicy);

  useEffect(() => {
    const savedPolicy = localStorage.getItem('privacyPolicy');
    if (savedPolicy) {
      try {
        setPrivacyPolicy(JSON.parse(savedPolicy));
      } catch (error) {
        console.error('Error parsing privacy policy:', error);
        setPrivacyPolicy(defaultPrivacyPolicy);
      }
    }
  }, []);

  const updatePrivacyPolicy = (content: string) => {
    const updatedPolicy = {
      content,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem('privacyPolicy', JSON.stringify(updatedPolicy));
    setPrivacyPolicy(updatedPolicy);
  };

  return (
    <PrivacyPolicyContext.Provider value={{ privacyPolicy, updatePrivacyPolicy }}>
      {children}
    </PrivacyPolicyContext.Provider>
  );
};

export const usePrivacyPolicy = () => {
  const context = useContext(PrivacyPolicyContext);
  if (context === undefined) {
    throw new Error('usePrivacyPolicy must be used within a PrivacyPolicyProvider');
  }
  return context;
};
