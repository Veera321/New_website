import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  experience: string;
  about: string;
  availability: {
    days: string[];
    time: string;
  };
  consultationFee: number;
  image: string;
}

interface DoctorContextType {
  doctors: Doctor[];
  addDoctor: (doctor: Omit<Doctor, 'id'>) => void;
  updateDoctor: (id: string, doctor: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  getDoctorById: (id: string) => Doctor | undefined;
}

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

export const DoctorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    const savedDoctors = localStorage.getItem('doctors');
    if (savedDoctors) {
      try {
        setDoctors(JSON.parse(savedDoctors));
      } catch (error) {
        console.error('Error parsing doctors from localStorage:', error);
        // Initialize with some sample doctors if parsing fails
        const initialDoctors: Doctor[] = [
          {
            id: '1',
            name: 'Dr. John Smith',
            specialty: 'Cardiologist',
            qualification: 'MD, DM Cardiology',
            experience: '15 years',
            about: 'Experienced cardiologist specializing in heart diseases and preventive care.',
            availability: {
              days: ['Monday', 'Wednesday', 'Friday'],
              time: '9:00 AM - 5:00 PM'
            },
            consultationFee: 1000,
            image: '/doctors/doctor1.jpg'
          },
          {
            id: '2',
            name: 'Dr. Sarah Johnson',
            specialty: 'Pediatrician',
            qualification: 'MD Pediatrics',
            experience: '10 years',
            about: 'Dedicated pediatrician with expertise in child healthcare and development.',
            availability: {
              days: ['Tuesday', 'Thursday', 'Saturday'],
              time: '10:00 AM - 6:00 PM'
            },
            consultationFee: 800,
            image: '/doctors/doctor2.jpg'
          }
        ];
        setDoctors(initialDoctors);
        localStorage.setItem('doctors', JSON.stringify(initialDoctors));
      }
    } else {
      // Initialize with sample doctors if no data exists
      const initialDoctors: Doctor[] = [
        {
          id: '1',
          name: 'Dr. John Smith',
          specialty: 'Cardiologist',
          qualification: 'MD, DM Cardiology',
          experience: '15 years',
          about: 'Experienced cardiologist specializing in heart diseases and preventive care.',
          availability: {
            days: ['Monday', 'Wednesday', 'Friday'],
            time: '9:00 AM - 5:00 PM'
          },
          consultationFee: 1000,
          image: '/doctors/doctor1.jpg'
        },
        {
          id: '2',
          name: 'Dr. Sarah Johnson',
          specialty: 'Pediatrician',
          qualification: 'MD Pediatrics',
          experience: '10 years',
          about: 'Dedicated pediatrician with expertise in child healthcare and development.',
          availability: {
            days: ['Tuesday', 'Thursday', 'Saturday'],
            time: '10:00 AM - 6:00 PM'
          },
          consultationFee: 800,
          image: '/doctors/doctor2.jpg'
        }
      ];
      setDoctors(initialDoctors);
      localStorage.setItem('doctors', JSON.stringify(initialDoctors));
    }
  }, []);

  const saveDoctors = (newDoctors: Doctor[]) => {
    localStorage.setItem('doctors', JSON.stringify(newDoctors));
    setDoctors(newDoctors);
  };

  const addDoctor = (doctorData: Omit<Doctor, 'id'>) => {
    const newDoctor: Doctor = {
      ...doctorData,
      id: Date.now().toString(),
    };
    const updatedDoctors = [...doctors, newDoctor];
    saveDoctors(updatedDoctors);
  };

  const updateDoctor = (id: string, doctorData: Partial<Doctor>) => {
    const updatedDoctors = doctors.map(doctor =>
      doctor.id === id ? { ...doctor, ...doctorData } : doctor
    );
    saveDoctors(updatedDoctors);
  };

  const deleteDoctor = (id: string) => {
    const updatedDoctors = doctors.filter(doctor => doctor.id !== id);
    saveDoctors(updatedDoctors);
  };

  const getDoctorById = (id: string) => {
    return doctors.find(doctor => doctor.id === id);
  };

  const value = {
    doctors,
    addDoctor,
    updateDoctor,
    deleteDoctor,
    getDoctorById,
  };

  return <DoctorContext.Provider value={value}>{children}</DoctorContext.Provider>;
};

export const useDoctor = () => {
  const context = useContext(DoctorContext);
  if (context === undefined) {
    throw new Error('useDoctor must be used within a DoctorProvider');
  }
  return context;
};
