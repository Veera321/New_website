import React, { createContext, useContext, useState, useEffect } from 'react';
import { HealthPackage, initialPackages } from '../data/initialPackages';

interface HealthPackageContextType {
  packages: HealthPackage[];
  addPackage: (pkg: HealthPackage) => void;
  updatePackage: (id: number, pkg: HealthPackage) => void;
  deletePackage: (id: number) => void;
  saveChanges: () => Promise<void>;
}

const HealthPackageContext = createContext<HealthPackageContextType | undefined>(undefined);

export const useHealthPackage = () => {
  const context = useContext(HealthPackageContext);
  if (!context) {
    throw new Error('useHealthPackage must be used within a HealthPackageProvider');
  }
  return context;
};

export const HealthPackageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [packages, setPackages] = useState<HealthPackage[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load packages from localStorage or use initial packages
    const savedPackages = localStorage.getItem('healthPackages');
    if (savedPackages) {
      setPackages(JSON.parse(savedPackages));
    } else {
      setPackages(initialPackages);
    }
  }, []);

  const addPackage = (pkg: HealthPackage) => {
    setPackages(prev => [...prev, pkg]);
    setHasChanges(true);
  };

  const updatePackage = (id: number, updatedPkg: HealthPackage) => {
    setPackages(prev => prev.map(pkg => pkg.id === id ? updatedPkg : pkg));
    setHasChanges(true);
  };

  const deletePackage = (id: number) => {
    setPackages(prev => prev.filter(pkg => pkg.id !== id));
    setHasChanges(true);
  };

  const saveChanges = async () => {
    try {
      // Save to localStorage
      localStorage.setItem('healthPackages', JSON.stringify(packages));
      setHasChanges(false);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return (
    <HealthPackageContext.Provider value={{ packages, addPackage, updatePackage, deletePackage, saveChanges }}>
      {children}
    </HealthPackageContext.Provider>
  );
};
