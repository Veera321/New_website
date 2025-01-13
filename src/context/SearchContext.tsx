import React, { createContext, useContext, useState, useEffect } from 'react';
import { Test } from '../../tests/data/testData';
import { HealthPackage as Package, initialPackages } from '../data/initialPackages';

interface SearchItem {
  id: string;
  name: string;
  type: 'test' | 'package';
  price: number;
}

interface SearchContextType {
  tests: Test[];
  packages: Package[];
  searchItems: SearchItem[];
  addTest: (test: Test) => void;
  addPackage: (pkg: Package) => void;
  removeTest: (id: string) => void;
  removePackage: (id: string) => void;
  updateTest: (id: string, test: Partial<Test>) => void;
  updatePackage: (id: string, pkg: Partial<Package>) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tests, setTests] = useState<Test[]>(() => {
    const savedTests = localStorage.getItem('tests');
    return savedTests ? JSON.parse(savedTests) : [];
  });

  const [packages, setPackages] = useState<Package[]>(() => {
    const savedPackages = localStorage.getItem('packages');
    return savedPackages ? JSON.parse(savedPackages) : initialPackages;
  });

  const [searchItems, setSearchItems] = useState<SearchItem[]>([]);

  useEffect(() => {
    localStorage.setItem('tests', JSON.stringify(tests));
    updateSearchItems();
  }, [tests]);

  useEffect(() => {
    localStorage.setItem('packages', JSON.stringify(packages));
    updateSearchItems();
  }, [packages]);

  const updateSearchItems = () => {
    const testItems: SearchItem[] = tests.map(test => ({
      id: String(test.id),
      name: test.name,
      type: 'test',
      price: test.price,
    }));

    const packageItems: SearchItem[] = packages.map(pkg => ({
      id: String(pkg.id),
      name: pkg.name,
      type: 'package',
      price: pkg.price,
    }));

    setSearchItems([...testItems, ...packageItems]);
  };

  const addTest = (test: Test) => {
    setTests(prev => [...prev, test]);
  };

  const addPackage = (pkg: Package) => {
    setPackages(prev => [...prev, pkg]);
  };

  const removeTest = (id: string) => {
    setTests(prev => prev.filter(test => String(test.id) !== id));
  };

  const removePackage = (id: string) => {
    setPackages(prev => prev.filter(pkg => String(pkg.id) !== id));
  };

  const updateTest = (id: string, test: Partial<Test>) => {
    setTests(prev =>
      prev.map(t => (String(t.id) === id ? { ...t, ...test } : t))
    );
  };

  const updatePackage = (id: string, pkg: Partial<Package>) => {
    setPackages(prev =>
      prev.map(p => (String(p.id) === id ? { ...p, ...pkg } : p))
    );
  };

  useEffect(() => {
    updateSearchItems();
  }, []);

  return (
    <SearchContext.Provider
      value={{
        tests,
        packages,
        searchItems,
        addTest,
        addPackage,
        removeTest,
        removePackage,
        updateTest,
        updatePackage,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
