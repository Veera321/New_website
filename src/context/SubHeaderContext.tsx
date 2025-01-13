import React, { createContext, useContext, useEffect, useState } from 'react';
import { useBloodTest } from './BloodTestContext';
import { specialtyTests } from '../components/SpecialtyTests';

export interface SubMenuOption {
  text: string;
  items?: string[];
}

interface SubHeaderContextType {
  options: SubMenuOption[];
  updateOptions: (newOptions: SubMenuOption[]) => void;
  addOption: (option: SubMenuOption) => void;
  removeOption: (index: number) => void;
  updateOption: (index: number, option: SubMenuOption) => void;
  addSubItem: (optionIndex: number, item: string) => void;
  removeSubItem: (optionIndex: number, itemIndex: number) => void;
  updateSubItem: (optionIndex: number, itemIndex: number, newText: string) => void;
}

const SubHeaderContext = createContext<SubHeaderContextType | undefined>(undefined);

export const SubHeaderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [options, setOptions] = useState<SubMenuOption[]>([]);
  const { tests, loading } = useBloodTest();

  useEffect(() => {
    const publishedTests = tests?.filter(test => test.published).map(test => test.name) || [];

    setOptions([
      {
        text: 'Blood Tests',
        items: publishedTests,
      },
      {
        text: 'Specialty Tests',
        items: specialtyTests.map(test => test.name),
      },
      {
        text: 'Health Risk',
        items: [
          'Diabetes',
          'Heart Disease',
          'Thyroid',
          'Arthritis',
          'Kidney Disease',
          'Liver Disease',
        ],
      },
      {
        text: 'Doctor Consultation',
      },
      {
        text: 'Blogs',
        items: [
          'Health Tips',
          'Medical News',
          'Wellness Articles',
          'Diet & Nutrition'
        ],
      },
    ]);
  }, [tests, loading]);

  const updateOptions = (newOptions: SubMenuOption[]) => {
    setOptions(newOptions);
  };

  const addOption = (option: SubMenuOption) => {
    setOptions([...options, option]);
  };

  const removeOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const updateOption = (index: number, option: SubMenuOption) => {
    const newOptions = [...options];
    newOptions[index] = option;
    setOptions(newOptions);
  };

  const addSubItem = (optionIndex: number, item: string) => {
    const newOptions = [...options];
    if (!newOptions[optionIndex].items) {
      newOptions[optionIndex].items = [];
    }
    newOptions[optionIndex].items?.push(item);
    setOptions(newOptions);
  };

  const removeSubItem = (optionIndex: number, itemIndex: number) => {
    const newOptions = [...options];
    if (newOptions[optionIndex].items) {
      newOptions[optionIndex].items = newOptions[optionIndex].items!.filter(
        (_, i) => i !== itemIndex
      );
      setOptions(newOptions);
    }
  };

  const updateSubItem = (optionIndex: number, itemIndex: number, newText: string) => {
    const newOptions = [...options];
    if (newOptions[optionIndex].items && newOptions[optionIndex].items![itemIndex]) {
      newOptions[optionIndex].items![itemIndex] = newText;
      setOptions(newOptions);
    }
  };

  return (
    <SubHeaderContext.Provider
      value={{
        options,
        updateOptions,
        addOption,
        removeOption,
        updateOption,
        addSubItem,
        removeSubItem,
        updateSubItem,
      }}
    >
      {children}
    </SubHeaderContext.Provider>
  );
};

export const useSubHeader = () => {
  const context = useContext(SubHeaderContext);
  if (context === undefined) {
    throw new Error('useSubHeader must be used within a SubHeaderProvider');
  }
  return context;
};
