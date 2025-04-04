import { contextBridge, ipcRenderer } from "electron";

// Define the shape of our database API
interface DatabaseApi {
  // Patients
  getPatients: () => Promise<any[]>;
  getPatientById: (id: number) => Promise<any>;
  createPatient: (data: any) => Promise<any>;
  updatePatient: (id: number, data: any) => Promise<any>;
  deletePatient: (id: number) => Promise<boolean>;
  getPatientWithAppointments: (id: number) => Promise<any>;
  getPatientWithTreatments: (id: number) => Promise<any>;
  getPatientWithBalance: (id: number) => Promise<any>;
  searchPatients: (term: string) => Promise<any[]>;

  // Dentists
  getDentists: () => Promise<any[]>;
  getDentistById: (id: number) => Promise<any>;
  createDentist: (data: any) => Promise<any>;
  updateDentist: (id: number, data: any) => Promise<any>;
  deleteDentist: (id: number) => Promise<boolean>;
  getDentistSchedule: (id: number, date: string) => Promise<any[]>;

  // Appointments
  getAppointments: () => Promise<any[]>;
  getAppointmentById: (id: number) => Promise<any>;
  createAppointment: (data: any) => Promise<any>;
  updateAppointment: (id: number, data: any) => Promise<any>;
  deleteAppointment: (id: number) => Promise<boolean>;
  getAppointmentsByDateRange: (startDate: string, endDate: string) => Promise<any[]>;
  checkAppointmentConflicts: (dentistId: number, date: string, startTime: string, endTime: string, excludeId?: number) => Promise<boolean>;

  // Treatment Procedures
  getProcedures: () => Promise<any[]>;
  getProcedureById: (id: number) => Promise<any>;
  createProcedure: (data: any) => Promise<any>;
  updateProcedure: (id: number, data: any) => Promise<any>;
  deleteProcedure: (id: number) => Promise<boolean>;
  getProceduresByCategory: (category: string) => Promise<any[]>;

  // Treatments
  getTreatments: () => Promise<any[]>;
  getTreatmentById: (id: number) => Promise<any>;
  createTreatment: (data: any) => Promise<any>;
  updateTreatment: (id: number, data: any) => Promise<any>;
  deleteTreatment: (id: number) => Promise<boolean>;
  getTreatmentsByPatient: (patientId: number) => Promise<any[]>;
  getTreatmentsByStatus: (status: string) => Promise<any[]>;

  // Payments
  getPayments: () => Promise<any[]>;
  getPaymentById: (id: number) => Promise<any>;
  createPayment: (data: any) => Promise<any>;
  updatePayment: (id: number, data: any) => Promise<any>;
  deletePayment: (id: number) => Promise<boolean>;
  getPaymentsByDateRange: (startDate: string, endDate: string) => Promise<any[]>;
  getPaymentsByPatient: (patientId: number) => Promise<any[]>;

  // Auth
  createUser: (userData: any) => Promise<any>;
  getUsers: () => Promise<any[]>;
}

// Expose the database API to the renderer process
contextBridge.exposeInMainWorld('dentalApi', {
  // Patients
  getPatients: () => ipcRenderer.invoke('db:patients:getAll'),
  getPatientById: (id: number) => ipcRenderer.invoke('db:patients:getById', id),
  createPatient: (data: any) => ipcRenderer.invoke('db:patients:create', data),
  updatePatient: (id: number, data: any) => ipcRenderer.invoke('db:patients:update', id, data),
  deletePatient: (id: number) => ipcRenderer.invoke('db:patients:delete', id),
  getPatientWithAppointments: (id: number) => ipcRenderer.invoke('db:patients:getWithAppointments', id),
  getPatientWithTreatments: (id: number) => ipcRenderer.invoke('db:patients:getWithTreatments', id),
  getPatientWithBalance: (id: number) => ipcRenderer.invoke('db:patients:getWithBalance', id),
  searchPatients: (term: string) => ipcRenderer.invoke('db:patients:search', term),

  // Dentists
  getDentists: () => ipcRenderer.invoke('db:dentists:getAll'),
  getDentistById: (id: number) => ipcRenderer.invoke('db:dentists:getById', id),
  createDentist: (data: any) => ipcRenderer.invoke('db:dentists:create', data),
  updateDentist: (id: number, data: any) => ipcRenderer.invoke('db:dentists:update', id, data),
  deleteDentist: (id: number) => ipcRenderer.invoke('db:dentists:delete', id),
  getDentistSchedule: (id: number, date: string) => ipcRenderer.invoke('db:dentists:getSchedule', id, date),

  // Appointments
  getAppointments: () => ipcRenderer.invoke('db:appointments:getAll'),
  getAppointmentById: (id: number) => ipcRenderer.invoke('db:appointments:getById', id),
  createAppointment: (data: any) => ipcRenderer.invoke('db:appointments:create', data),
  updateAppointment: (id: number, data: any) => ipcRenderer.invoke('db:appointments:update', id, data),
  deleteAppointment: (id: number) => ipcRenderer.invoke('db:appointments:delete', id),
  getAppointmentsByDateRange: (startDate: string, endDate: string) =>
    ipcRenderer.invoke('db:appointments:getByDateRange', startDate, endDate),
  checkAppointmentConflicts: (dentistId: number, date: string, startTime: string, endTime: string, excludeId?: number) =>
    ipcRenderer.invoke('db:appointments:checkConflicts', dentistId, date, startTime, endTime, excludeId),

  // Treatment Procedures
  getProcedures: () => ipcRenderer.invoke('db:procedures:getAll'),
  getProcedureById: (id: number) => ipcRenderer.invoke('db:procedures:getById', id),
  createProcedure: (data: any) => ipcRenderer.invoke('db:procedures:create', data),
  updateProcedure: (id: number, data: any) => ipcRenderer.invoke('db:procedures:update', id, data),
  deleteProcedure: (id: number) => ipcRenderer.invoke('db:procedures:delete', id),
  getProceduresByCategory: (category: string) => ipcRenderer.invoke('db:procedures:getByCategory', category),

  // Treatments
  getTreatments: () => ipcRenderer.invoke('db:treatments:getAll'),
  getTreatmentById: (id: number) => ipcRenderer.invoke('db:treatments:getById', id),
  createTreatment: (data: any) => ipcRenderer.invoke('db:treatments:create', data),
  updateTreatment: (id: number, data: any) => ipcRenderer.invoke('db:treatments:update', id, data),
  deleteTreatment: (id: number) => ipcRenderer.invoke('db:treatments:delete', id),
  getTreatmentsByPatient: (patientId: number) => ipcRenderer.invoke('db:treatments:getByPatient', patientId),
  getTreatmentsByStatus: (status: string) => ipcRenderer.invoke('db:treatments:getByStatus', status),

  // Payments
  getPayments: () => ipcRenderer.invoke('db:payments:getAll'),
  getPaymentById: (id: number) => ipcRenderer.invoke('db:payments:getById', id),
  createPayment: (data: any) => ipcRenderer.invoke('db:payments:create', data),
  updatePayment: (id: number, data: any) => ipcRenderer.invoke('db:payments:update', id, data),
  deletePayment: (id: number) => ipcRenderer.invoke('db:payments:delete', id),
  getPaymentsByDateRange: (startDate: string, endDate: string) =>
    ipcRenderer.invoke('db:payments:getByDateRange', startDate, endDate),
  getPaymentsByPatient: (patientId: number) => ipcRenderer.invoke('db:payments:getByPatient', patientId),

  // Auth (existing functions from main.ts)
  createUser: (userData: any) => ipcRenderer.invoke('create-user', userData),
  getUsers: () => ipcRenderer.invoke('get-users')
} as DatabaseApi);

// Add type definitions for use in the renderer process
declare global {
  interface Window {
    dentalApi: DatabaseApi;
  }
}


