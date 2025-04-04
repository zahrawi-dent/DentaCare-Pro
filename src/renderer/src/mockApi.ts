import { Patient, Appointment, Invoice } from "./types.ts";


export const mockApi = {
  getPatients: async (): Promise<Patient[]> => {
    // In a real app, this would be an API call
    return [
      { id: 1, name: 'John Doe', email: '8oK8Q@example.com', phone: '123-456-7890', lastVisit: '2023-01-01' },
      { id: 2, name: 'Jane Smith', email: '9EY5r@example.com', phone: '987-654-3210', lastVisit: '2023-02-01' },
      { id: 3, name: 'Bob Johnson', email: 't7o0j@example.com', phone: '555-555-5555', lastVisit: '2023-03-01' }
    ]
  },
  getPatient: async (id: number): Promise<Patient> => {
    // In a real app, this would be an API call
    return {
      id: id,
      name: `Patient ${id}`,
      email: `patient${id}@example.com`,
      phone: `555-5555${id}`,
      lastVisit: '2023-01-01',
      address: `123 Main St, City ${id}, State ${id}`,
    };
  },
  getPatientAppointments: async (id: number): Promise<Appointment[]> => {
    // In a real app, this would be an API call
    return [
      { id: 1, patientName: 'John Doe', procedure: 'Root Canal', time: new Date().toISOString() },
      { id: 2, patientName: 'Jane Smith', procedure: 'Tooth Extraction', time: new Date().toISOString() }
    ];
  },
  getAllAppointments: async (): Promise<Appointment[]> => {
    // In a real app, this would be an API call
    return [
      { id: 1, patientName: 'John Doe', procedure: 'Root Canal', time: new Date().toISOString() },
      { id: 2, patientName: 'Jane Smith', procedure: 'Tooth Extraction', time: new Date().toISOString() }
    ];
  },
  getAllInvoices: async (): Promise<Invoice[]> => {
    return [
      { id: 1, date: '2023-01-01', amount: 100, status: 'Paid', description: 'Root Canal' },
      { id: 2, date: '2023-02-01', amount: 150, status: 'Pending', description: 'Tooth Extraction' }
    ]

  }
}

