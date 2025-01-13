import React, { createContext, useContext, useState, useEffect } from 'react';
import { sendAdminNotification } from '../utils/emailService';

export interface Appointment {
  id: string;
  doctorId: string;
  patientName: string;
  contactNumber: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  isRead: boolean;
}

interface AppointmentContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id' | 'status' | 'createdAt' | 'isRead'>) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  getAppointmentsByDoctorId: (doctorId: string) => Appointment[];
  markAppointmentAsRead: (id: string) => void;
  getUnreadAppointmentsCount: () => number;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      try {
        setAppointments(JSON.parse(savedAppointments));
      } catch (error) {
        console.error('Error parsing appointments from localStorage:', error);
        setAppointments([]);
      }
    }
  }, []);

  const saveAppointments = (newAppointments: Appointment[]) => {
    localStorage.setItem('appointments', JSON.stringify(newAppointments));
    setAppointments(newAppointments);
  };

  const addAppointment = (appointmentData: Omit<Appointment, 'id' | 'status' | 'createdAt' | 'isRead'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    const updatedAppointments = [...appointments, newAppointment];
    saveAppointments(updatedAppointments);

    // Send email notification
    sendAdminNotification({
      subject: 'New Appointment Request',
      message: 'A new appointment request has been received.',
      details: {
        'Patient Name': appointmentData.patientName,
        'Contact Number': appointmentData.contactNumber,
        'Reason': appointmentData.reason,
        'Doctor ID': appointmentData.doctorId,
        'Status': 'Pending',
        'Created At': new Date().toLocaleString(),
      },
    }).catch(error => {
      console.error('Failed to send email notification:', error);
    });
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === id ? { ...appointment, status } : appointment
    );
    saveAppointments(updatedAppointments);
  };

  const markAppointmentAsRead = (id: string) => {
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === id ? { ...appointment, isRead: true } : appointment
    );
    saveAppointments(updatedAppointments);
  };

  const getAppointmentsByDoctorId = (doctorId: string) => {
    return appointments.filter(appointment => appointment.doctorId === doctorId);
  };

  const getUnreadAppointmentsCount = () => {
    return appointments.filter(appointment => !appointment.isRead).length;
  };

  const value = {
    appointments,
    addAppointment,
    updateAppointmentStatus,
    getAppointmentsByDoctorId,
    markAppointmentAsRead,
    getUnreadAppointmentsCount,
  };

  return <AppointmentContext.Provider value={value}>{children}</AppointmentContext.Provider>;
};

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  return context;
};
