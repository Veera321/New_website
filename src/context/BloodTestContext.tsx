import React, { createContext, useContext, useState, useEffect } from 'react';
import { BloodTest } from '../components/BloodTests';

interface BloodTestContextType {
  tests: BloodTest[];
  addTest: (test: BloodTest) => void;
  updateTest: (test: BloodTest) => void;
  deleteTest: (id: number) => void;
  togglePublish: (id: number) => void;
  loading: boolean;
}

const BloodTestContext = createContext<BloodTestContextType | undefined>(undefined);

export const BloodTestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tests, setTests] = useState<BloodTest[]>([]);
  const [loading, setLoading] = useState(true);

  // Load initial tests from localStorage or default data
  useEffect(() => {
    const loadTests = () => {
      const savedTests = localStorage.getItem('bloodTests');
      if (savedTests) {
        setTests(JSON.parse(savedTests));
      } else {
        // Import default tests
        import('../components/BloodTests').then(module => {
          setTests(module.bloodTests);
          localStorage.setItem('bloodTests', JSON.stringify(module.bloodTests));
        });
      }
      setLoading(false);
    };

    loadTests();
  }, []);

  const addTest = (test: BloodTest) => {
    const newTest = { ...test, published: false };
    const newTests = [...tests, newTest];
    setTests(newTests);
    localStorage.setItem('bloodTests', JSON.stringify(newTests));
  };

  const updateTest = (updatedTest: BloodTest) => {
    const newTests = tests.map(test => 
      test.id === updatedTest.id ? updatedTest : test
    );
    setTests(newTests);
    localStorage.setItem('bloodTests', JSON.stringify(newTests));
  };

  const deleteTest = (id: number) => {
    const newTests = tests.filter(test => test.id !== id);
    setTests(newTests);
    localStorage.setItem('bloodTests', JSON.stringify(newTests));
  };

  const togglePublish = (id: number) => {
    const newTests = tests.map(test =>
      test.id === id ? { ...test, published: !test.published } : test
    );
    setTests(newTests);
    localStorage.setItem('bloodTests', JSON.stringify(newTests));
  };

  return (
    <BloodTestContext.Provider value={{ tests, addTest, updateTest, deleteTest, togglePublish, loading }}>
      {children}
    </BloodTestContext.Provider>
  );
};

export const useBloodTest = () => {
  const context = useContext(BloodTestContext);
  if (context === undefined) {
    throw new Error('useBloodTest must be used within a BloodTestProvider');
  }
  return context;
};
