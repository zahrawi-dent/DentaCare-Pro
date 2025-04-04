export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}
export interface Patient {
  id: number;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
  address?: string;
  dob?: string;
  sex?: string;
}

export interface Appointment {
  id: number;
  patientName: string;
  procedure: string;
  time: string;
  doctor?: string;
  status?: string;
}

export interface Treatment {
  id: number;
  date: string;
  procedure: string;
  notes: string;
  doctor: string;
}
export interface Invoice {
  id: number;
  date: string;
  amount: number;
  status: string;
  description: string;
}
