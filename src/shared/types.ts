// TODO: change gender to sex
export interface Patient {
  id: number
  firstName: string
  lastName: string
  // TODO: use age(integer) instead?
  dateOfBirth: string
  gender: string
  phone: string
  email: string | null
  address: string | null
  insuranceProvider: string | null
  insuranceNumber: string | null
  medicalHistory: string | null
  allergies: string | null
  notes: string | null
  createdAt: number | Date // SQLite's unixepoch() returns seconds
  updatedAt: number | Date // SQLite's unixepoch() returns seconds
}

export interface Dentist {
  id: number
  firstName: string
  lastName: string
  specialization: string | null
  phone: string
  email: string
  licenseNumber: string
  notes: string | null
  createdAt: number | Date // SQLite's unixepoch() returns seconds
  updatedAt: number | Date // SQLite's unixepoch() returns seconds
}

export interface Appointment {
  id: number
  patientId: number
  dentistId: number
  appointmentDate: string
  startTime: string
  endTime: string
  status: string
  type: string
  notes: string | null
  createdAt: number | Date // SQLite's unixepoch() returns seconds
  updatedAt: number | Date // SQLite's unixepoch() returns seconds
}

export interface TreatmentProcedure {
  id: number
  code: string
  name: string
  description: string | null
  defaultCost: number
  category: string
  duration: number
  createdAt: number | Date // SQLite's unixepoch() returns seconds
  updatedAt: number | Date // SQLite's unixepoch() returns seconds
}

export interface Treatment {
  id: number
  patientId: number
  dentistId: number
  procedureId: number
  appointmentId: number | null
  treatmentDate: string
  cost: number
  tooth: string | null
  notes: string | null
  status: string
  createdAt: number | Date // SQLite's unixepoch() returns seconds
  updatedAt: number | Date // SQLite's unixepoch() returns seconds
}

export interface Payment {
  id: number
  patientId: number
  amount: number
  paymentDate: string
  paymentMethod: string
  relatedTreatmentIds: string | null
  notes: string | null
  receiptNumber: string | null
  insuranceClaim: string | null
  createdAt: number | Date // SQLite's unixepoch() returns seconds
  updatedAt: number | Date // SQLite's unixepoch() returns seconds
}

export interface InventoryItem {
  id: number
  name: string
  description: string | null
  category: string
  quantity: number
  unit: string
  minQuantity: number
  costPerUnit: number
  supplier: string | null
  lastOrderDate: string | null
  expiryDate: string | null
  location: string | null
  notes: string | null
  createdAt: number | Date // SQLite's unixepoch() returns seconds
  updatedAt: number | Date // SQLite's unixepoch() returns seconds
}

export interface DentalChart {
  id: number
  patientId: number
  chartDate: string
  chartData: string
  notes: string | null
  createdAt: number | Date // SQLite's unixepoch() returns seconds
  updatedAt: number | Date // SQLite's unixepoch() returns seconds
}

export interface Document {
  id: number
  patientId: number
  fileName: string
  filePath: string
  fileType: string
  description: string | null
  uploadDate: string
  createdAt: number | Date // SQLite's unixepoch() returns seconds
  updatedAt: number | Date // SQLite's unixepoch() returns seconds
}

export interface User {
  id: number
  username: string
  passwordHash: string
  role: string
  dentistId: number | null
  firstName: string
  lastName: string
  email: string | null
  lastLogin: number | null | Date // SQLite's unixepoch() returns seconds
  active: boolean | number
  createdAt: number | Date // SQLite's unixepoch() returns seconds
  updatedAt: number | Date // SQLite's unixepoch() returns seconds
}

export interface Invoice {
  id: number
  date: string
  amount: number
  status: string
  description: string
}
