import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

type Gender = 'male' | 'female' | 'other';

interface PatientFormData {
  name: string;
  mobile: string;
  email: string;
  address: string;
  gender: Gender | '';
  age: string;
  bloodGroup: string;
  alternateContact: string;
}

interface UsePatientFormProps {
  requiredFields?: (keyof PatientFormData)[];
}

export const usePatientForm = ({ requiredFields = [] }: UsePatientFormProps = {}) => {
  const { userProfile, updateProfile } = useAuth();
  const [formData, setFormData] = useState<PatientFormData>({
    name: '',
    mobile: userProfile?.mobile || '',
    email: '',
    address: '',
    gender: '',
    age: '',
    bloodGroup: '',
    alternateContact: '',
  });
  const [missingFields, setMissingFields] = useState<(keyof PatientFormData)[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form with user profile data
  useEffect(() => {
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        name: userProfile.name || prev.name,
        mobile: userProfile.mobile || prev.mobile,
        email: userProfile.email || prev.email,
        address: userProfile.address || prev.address,
        gender: userProfile.gender || prev.gender,
        age: userProfile.age?.toString() || prev.age,
        bloodGroup: userProfile.bloodGroup || prev.bloodGroup,
        alternateContact: userProfile.alternateContact || prev.alternateContact,
      }));
    }
  }, [userProfile]);

  const handleChange = (field: keyof PatientFormData) => (
    e: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    const value = e.target.value;

    // Handle mobile number input
    if (field === 'mobile' || field === 'alternateContact') {
      // Only allow digits and limit to 10 characters
      const sanitizedValue = (value as string).replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({
        ...prev,
        [field]: sanitizedValue,
      }));
      
      // Validate mobile number format
      if (sanitizedValue.length > 0 && sanitizedValue.length !== 10) {
        setErrors(prev => ({
          ...prev,
          [field]: `${field === 'mobile' ? 'Mobile number' : 'Alternate contact'} must be 10 digits`,
        }));
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
      
      // Clear error for this field if it exists
      if (errors[field]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }

    // Update missing fields
    if (requiredFields.includes(field) && value) {
      setMissingFields(prev => prev.filter(f => f !== field));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const newMissingFields: (keyof PatientFormData)[] = [];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        newMissingFields.push(field);
      }
    });

    // Validate mobile number format
    if (formData.mobile && !/^[0-9]{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }

    // Validate alternate contact if provided
    if (formData.alternateContact && !/^[0-9]{10}$/.test(formData.alternateContact)) {
      newErrors.alternateContact = 'Alternate contact must be 10 digits';
    }

    setErrors(newErrors);
    setMissingFields(newMissingFields);
    return Object.keys(newErrors).length === 0;
  };

  const saveProfile = async () => {
    if (!validateForm()) {
      return false;
    }

    const updatedProfile = {
      name: formData.name,
      mobile: formData.mobile,
      email: formData.email || undefined,
      address: formData.address,
      gender: formData.gender || undefined,
      age: formData.age ? parseInt(formData.age) : undefined,
      bloodGroup: formData.bloodGroup || undefined,
      alternateContact: formData.alternateContact || undefined,
    };

    await updateProfile(updatedProfile);
    return true;
  };

  const isComplete = missingFields.length === 0;

  return {
    formData,
    handleChange,
    saveProfile,
    missingFields,
    isComplete,
    errors,
  };
};

export default usePatientForm;
