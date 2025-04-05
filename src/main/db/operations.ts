// db/operations.ts
import { eq, and, like, or, gte, lte, desc, asc, sql } from 'drizzle-orm'
import { DrizzleDb } from './types'
import {
  patients,
  dentists,
  appointments,
  treatmentProcedures,
  treatments,
  payments,
  Dentist,
  Appointment,
  TreatmentProcedure,
  Treatment,
  Payment
} from './schema'

import { Patient } from '@shared/types'

// inventoryItems,
// dentalCharts,
// documents,
// users,
// InventoryItem,
// DentalChart,
// Document,
// User

/**
 * TIMESTAMP HANDLING NOTES:
 *
 * - In the database schema, timestamps are stored as integers using SQLite's unixepoch() function,
 *   which returns Unix timestamps in seconds.
 *
 * - TypeScript interfaces define timestamp fields as number | Date to handle both raw timestamps
 *   and Date objects.
 *
 * - When creating records, we rely on the default values in the schema (sql`(unixepoch())`)
 *   to set createdAt and updatedAt.
 *
 * - When updating records, we explicitly update the updatedAt field with sql`(unixepoch())`
 *   and exclude any createdAt/updatedAt values from the input data.
 */

// Type definitions for data returns
export interface PatientWithRelations extends Patient {
  appointments?: AppointmentWithRelations[]
  treatments?: TreatmentWithRelations[]
  payments?: Payment[]
  balance?: {
    totalCost: number
    totalPaid: number
    balance: number
  }
}

export interface DentistWithRelations extends Dentist {
  appointments?: AppointmentWithRelations[]
}

export interface AppointmentWithRelations extends Appointment {
  patient?: {
    id: number
    firstName: string
    lastName: string
    phone?: string
  }
  dentist?: {
    id: number
    firstName: string
    lastName: string
  }
}

export interface TreatmentWithRelations extends Treatment {
  patient?: {
    id: number
    firstName: string
    lastName: string
  }
  dentist?: {
    id: number
    firstName: string
    lastName: string
  }
  procedure?: {
    id: number
    name: string
    code: string
  }
}

export class DentalOperations {
  private db: DrizzleDb

  constructor(db: DrizzleDb) {
    this.db = db
  }

  // ===== PATIENT OPERATIONS =====
  patients = {
    create: async (
      patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<Patient> => {
      try {
        const result = await this.db
          .insert(patients)
          .values({
            ...patientData
          })
          .returning()
        return result[0]
      } catch (error) {
        console.error('Error creating patient:', error)
        throw error
      }
    },

    getAll: async (): Promise<Patient[]> => {
      try {
        return await this.db.select().from(patients).orderBy(asc(patients.lastName))
      } catch (error) {
        console.error('Error fetching patients:', error)
        throw error
      }
    },

    getById: async (id: number): Promise<Patient | undefined> => {
      try {
        const result = await this.db.select().from(patients).where(eq(patients.id, id))
        return result[0]
      } catch (error) {
        console.error(`Error fetching patient with ID ${id}:`, error)
        throw error
      }
    },

    search: async (searchTerm: string): Promise<Patient[]> => {
      try {
        const searchPattern = `%${searchTerm}%`
        return await this.db
          .select()
          .from(patients)
          .where(
            or(
              like(patients.firstName, searchPattern),
              like(patients.lastName, searchPattern),
              like(patients.phone, searchPattern),
              like(patients.email, searchPattern)
            )
          )
      } catch (error) {
        console.error('Error searching patients:', error)
        throw error
      }
    },

    update: async (id: number, patientData: Partial<Patient>): Promise<Patient | undefined> => {
      try {
        // Omit createdAt from patientData to avoid type conflicts
        const { createdAt, updatedAt, ...dataToUpdate } = patientData

        const result = await this.db
          .update(patients)
          .set({
            ...dataToUpdate,
            updatedAt: sql`(unixepoch())`
          })
          .where(eq(patients.id, id))
          .returning()
        return result[0]
      } catch (error) {
        console.error(`Error updating patient with ID ${id}:`, error)
        throw error
      }
    },

    delete: async (id: number): Promise<boolean> => {
      try {
        await this.db.delete(patients).where(eq(patients.id, id))
        return true
      } catch (error) {
        console.error(`Error deleting patient with ID ${id}:`, error)
        throw error
      }
    },

    getWithAppointments: async (patientId: number): Promise<PatientWithRelations | undefined> => {
      try {
        const patientResult = await this.db
          .select()
          .from(patients)
          .where(eq(patients.id, patientId))
        if (!patientResult[0]) return undefined

        const patient = patientResult[0]

        const appointmentsResult = await this.db
          .select({
            appointment: appointments,
            dentist: {
              id: dentists.id,
              firstName: dentists.firstName,
              lastName: dentists.lastName
            }
          })
          .from(appointments)
          .innerJoin(dentists, eq(appointments.dentistId, dentists.id))
          .where(eq(appointments.patientId, patientId))
          .orderBy(desc(appointments.appointmentDate), asc(appointments.startTime))

        const formattedAppointments = appointmentsResult.map((row) => ({
          ...row.appointment,
          dentist: row.dentist
        }))

        return {
          ...patient,
          appointments: formattedAppointments
        }
      } catch (error) {
        console.error(`Error fetching patient with appointments for ID ${patientId}:`, error)
        throw error
      }
    },

    getWithTreatments: async (patientId: number): Promise<PatientWithRelations | undefined> => {
      try {
        const patientResult = await this.db
          .select()
          .from(patients)
          .where(eq(patients.id, patientId))
        if (!patientResult[0]) return undefined

        const patient = patientResult[0]

        const treatmentsResult = await this.db
          .select({
            treatment: treatments,
            procedure: {
              id: treatmentProcedures.id,
              name: treatmentProcedures.name,
              code: treatmentProcedures.code
            },
            dentist: {
              id: dentists.id,
              firstName: dentists.firstName,
              lastName: dentists.lastName
            }
          })
          .from(treatments)
          .innerJoin(treatmentProcedures, eq(treatments.procedureId, treatmentProcedures.id))
          .innerJoin(dentists, eq(treatments.dentistId, dentists.id))
          .where(eq(treatments.patientId, patientId))
          .orderBy(desc(treatments.treatmentDate))

        const formattedTreatments = treatmentsResult.map((row) => ({
          ...row.treatment,
          procedure: row.procedure,
          dentist: row.dentist
        }))

        return {
          ...patient,
          treatments: formattedTreatments
        }
      } catch (error) {
        console.error(`Error fetching patient with treatments for ID ${patientId}:`, error)
        throw error
      }
    },

    getWithBalance: async (patientId: number): Promise<PatientWithRelations | undefined> => {
      try {
        const patientResult = await this.db
          .select()
          .from(patients)
          .where(eq(patients.id, patientId))
        if (!patientResult[0]) return undefined

        const patient = patientResult[0]

        // Get sum of all treatments
        const treatmentsResult = await this.db
          .select({
            totalCost: sql<number>`SUM(${treatments.cost})`
          })
          .from(treatments)
          .where(eq(treatments.patientId, patientId))

        // Get sum of all payments
        const paymentsResult = await this.db
          .select({
            totalPaid: sql<number>`SUM(${payments.amount})`
          })
          .from(payments)
          .where(eq(payments.patientId, patientId))

        const totalCost = treatmentsResult[0].totalCost || 0
        const totalPaid = paymentsResult[0].totalPaid || 0

        return {
          ...patient,
          balance: {
            totalCost,
            totalPaid,
            balance: totalCost - totalPaid
          }
        }
      } catch (error) {
        console.error(`Error calculating balance for patient with ID ${patientId}:`, error)
        throw error
      }
    },

    getPayments: async (patientId: number): Promise<Payment[]> => {
      try {
        return await this.db
          .select()
          .from(payments)
          .where(eq(payments.patientId, patientId))
          .orderBy(desc(payments.paymentDate))
      } catch (error) {
        console.error(`Error fetching payments for patient with ID ${patientId}:`, error)
        throw error
      }
    }
  }

  // ===== DENTIST OPERATIONS =====
  dentists = {
    create: async (
      dentistData: Omit<Dentist, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<Dentist> => {
      try {
        const result = await this.db
          .insert(dentists)
          .values({
            ...dentistData
          })
          .returning()
        return result[0]
      } catch (error) {
        console.error('Error creating dentist:', error)
        throw error
      }
    },

    getAll: async (): Promise<Dentist[]> => {
      try {
        return await this.db.select().from(dentists).orderBy(asc(dentists.lastName))
      } catch (error) {
        console.error('Error fetching dentists:', error)
        throw error
      }
    },

    getById: async (id: number): Promise<Dentist | undefined> => {
      try {
        const result = await this.db.select().from(dentists).where(eq(dentists.id, id))
        return result[0]
      } catch (error) {
        console.error(`Error fetching dentist with ID ${id}:`, error)
        throw error
      }
    },

    update: async (id: number, dentistData: Partial<Dentist>): Promise<Dentist | undefined> => {
      try {
        // Omit createdAt from dentistData to avoid type conflicts
        const { createdAt, updatedAt, ...dataToUpdate } = dentistData

        const result = await this.db
          .update(dentists)
          .set({
            ...dataToUpdate,
            updatedAt: sql`(unixepoch())`
          })
          .where(eq(dentists.id, id))
          .returning()
        return result[0]
      } catch (error) {
        console.error(`Error updating dentist with ID ${id}:`, error)
        throw error
      }
    },

    delete: async (id: number): Promise<boolean> => {
      try {
        await this.db.delete(dentists).where(eq(dentists.id, id))
        return true
      } catch (error) {
        console.error(`Error deleting dentist with ID ${id}:`, error)
        throw error
      }
    },

    getSchedule: async (dentistId: number, date: string): Promise<AppointmentWithRelations[]> => {
      try {
        const result = await this.db
          .select({
            appointment: appointments,
            patient: {
              id: patients.id,
              firstName: patients.firstName,
              lastName: patients.lastName,
              phone: patients.phone
            }
          })
          .from(appointments)
          .innerJoin(patients, eq(appointments.patientId, patients.id))
          .where(and(eq(appointments.dentistId, dentistId), eq(appointments.appointmentDate, date)))
          .orderBy(asc(appointments.startTime))

        return result.map((row) => ({
          ...row.appointment,
          patient: row.patient
        }))
      } catch (error) {
        console.error(`Error fetching schedule for dentist with ID ${dentistId}:`, error)
        throw error
      }
    }
  }

  // ===== APPOINTMENT OPERATIONS =====
  appointments = {
    create: async (
      appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<Appointment> => {
      try {
        const result = await this.db
          .insert(appointments)
          .values({
            ...appointmentData
          })
          .returning()
        return result[0]
      } catch (error) {
        console.error('Error creating appointment:', error)
        throw error
      }
    },

    getAll: async (): Promise<AppointmentWithRelations[]> => {
      try {
        const result = await this.db
          .select({
            appointment: appointments,
            patient: {
              id: patients.id,
              firstName: patients.firstName,
              lastName: patients.lastName
            },
            dentist: {
              id: dentists.id,
              firstName: dentists.firstName,
              lastName: dentists.lastName
            }
          })
          .from(appointments)
          .innerJoin(patients, eq(appointments.patientId, patients.id))
          .innerJoin(dentists, eq(appointments.dentistId, dentists.id))
          .orderBy(desc(appointments.appointmentDate), asc(appointments.startTime))

        return result.map((row) => ({
          ...row.appointment,
          patient: row.patient,
          dentist: row.dentist
        }))
      } catch (error) {
        console.error('Error fetching appointments:', error)
        throw error
      }
    },

    getById: async (id: number): Promise<AppointmentWithRelations | undefined> => {
      try {
        const result = await this.db
          .select({
            appointment: appointments,
            patient: {
              id: patients.id,
              firstName: patients.firstName,
              lastName: patients.lastName,
              phone: patients.phone
            },
            dentist: {
              id: dentists.id,
              firstName: dentists.firstName,
              lastName: dentists.lastName
            }
          })
          .from(appointments)
          .innerJoin(patients, eq(appointments.patientId, patients.id))
          .innerJoin(dentists, eq(appointments.dentistId, dentists.id))
          .where(eq(appointments.id, id))

        if (!result[0]) return undefined

        return {
          ...result[0].appointment,
          patient: result[0].patient,
          dentist: result[0].dentist
        }
      } catch (error) {
        console.error(`Error fetching appointment with ID ${id}:`, error)
        throw error
      }
    },

    update: async (
      id: number,
      appointmentData: Partial<Appointment>
    ): Promise<Appointment | undefined> => {
      try {
        // Omit createdAt from appointmentData to avoid type conflicts
        const { createdAt, updatedAt, ...dataToUpdate } = appointmentData

        const result = await this.db
          .update(appointments)
          .set({
            ...dataToUpdate,
            updatedAt: sql`(unixepoch())`
          })
          .where(eq(appointments.id, id))
          .returning()
        return result[0]
      } catch (error) {
        console.error(`Error updating appointment with ID ${id}:`, error)
        throw error
      }
    },

    delete: async (id: number): Promise<boolean> => {
      try {
        await this.db.delete(appointments).where(eq(appointments.id, id))
        return true
      } catch (error) {
        console.error(`Error deleting appointment with ID ${id}:`, error)
        throw error
      }
    },

    getByDateRange: async (
      startDate: string,
      endDate: string
    ): Promise<AppointmentWithRelations[]> => {
      try {
        const result = await this.db
          .select({
            appointment: appointments,
            patient: {
              id: patients.id,
              firstName: patients.firstName,
              lastName: patients.lastName
            },
            dentist: {
              id: dentists.id,
              firstName: dentists.firstName,
              lastName: dentists.lastName
            }
          })
          .from(appointments)
          .innerJoin(patients, eq(appointments.patientId, patients.id))
          .innerJoin(dentists, eq(appointments.dentistId, dentists.id))
          .where(
            and(
              gte(appointments.appointmentDate, startDate),
              lte(appointments.appointmentDate, endDate)
            )
          )
          .orderBy(asc(appointments.appointmentDate), asc(appointments.startTime))

        return result.map((row) => ({
          ...row.appointment,
          patient: row.patient,
          dentist: row.dentist
        }))
      } catch (error) {
        console.error(
          `Error fetching appointments for date range ${startDate} to ${endDate}:`,
          error
        )
        throw error
      }
    },

    checkConflicts: async (
      dentistId: number,
      date: string,
      startTime: string,
      endTime: string,
      excludeAppointmentId?: number
    ): Promise<boolean> => {
      try {
        let query = this.db
          .select()
          .from(appointments)
          .where(
            and(
              eq(appointments.dentistId, dentistId),
              eq(appointments.appointmentDate, date),
              or(
                and(lte(appointments.startTime, startTime), gte(appointments.endTime, startTime)),
                and(lte(appointments.startTime, endTime), gte(appointments.endTime, endTime)),
                and(gte(appointments.startTime, startTime), lte(appointments.endTime, endTime))
              )
            )
          )

        // Exclude the current appointment if updating
        if (excludeAppointmentId) {
          // Use and() to combine conditions instead of calling .where() again
          query = this.db
            .select()
            .from(appointments)
            .where(
              and(
                eq(appointments.dentistId, dentistId),
                eq(appointments.appointmentDate, date),
                or(
                  and(lte(appointments.startTime, startTime), gte(appointments.endTime, startTime)),
                  and(lte(appointments.startTime, endTime), gte(appointments.endTime, endTime)),
                  and(gte(appointments.startTime, startTime), lte(appointments.endTime, endTime))
                ),
                sql`${appointments.id} != ${excludeAppointmentId}`
              )
            )
        }

        const conflicts = await query
        return conflicts.length > 0
      } catch (error) {
        console.error('Error checking appointment conflicts:', error)
        throw error
      }
    }
  }

  // ===== TREATMENT PROCEDURES OPERATIONS =====
  procedures = {
    create: async (
      procedureData: Omit<TreatmentProcedure, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<TreatmentProcedure> => {
      try {
        const result = await this.db
          .insert(treatmentProcedures)
          .values({
            ...procedureData
          })
          .returning()
        return result[0]
      } catch (error) {
        console.error('Error creating procedure:', error)
        throw error
      }
    },

    getAll: async (): Promise<TreatmentProcedure[]> => {
      try {
        return await this.db
          .select()
          .from(treatmentProcedures)
          .orderBy(asc(treatmentProcedures.code))
      } catch (error) {
        console.error('Error fetching procedures:', error)
        throw error
      }
    },

    getByCategory: async (category: string): Promise<TreatmentProcedure[]> => {
      try {
        return await this.db
          .select()
          .from(treatmentProcedures)
          .where(eq(treatmentProcedures.category, category))
          .orderBy(asc(treatmentProcedures.code))
      } catch (error) {
        console.error(`Error fetching procedures for category ${category}:`, error)
        throw error
      }
    },

    getById: async (id: number): Promise<TreatmentProcedure | undefined> => {
      try {
        const result = await this.db
          .select()
          .from(treatmentProcedures)
          .where(eq(treatmentProcedures.id, id))
        return result[0]
      } catch (error) {
        console.error(`Error fetching procedure with ID ${id}:`, error)
        throw error
      }
    },

    update: async (
      id: number,
      procedureData: Partial<TreatmentProcedure>
    ): Promise<TreatmentProcedure | undefined> => {
      try {
        // Omit createdAt from procedureData to avoid type conflicts
        const { createdAt, updatedAt, ...dataToUpdate } = procedureData

        const result = await this.db
          .update(treatmentProcedures)
          .set({
            ...dataToUpdate,
            updatedAt: sql`(unixepoch())`
          })
          .where(eq(treatmentProcedures.id, id))
          .returning()
        return result[0]
      } catch (error) {
        console.error(`Error updating procedure with ID ${id}:`, error)
        throw error
      }
    },

    delete: async (id: number): Promise<boolean> => {
      try {
        await this.db.delete(treatmentProcedures).where(eq(treatmentProcedures.id, id))
        return true
      } catch (error) {
        console.error(`Error deleting procedure with ID ${id}:`, error)
        throw error
      }
    }
  }

  // ===== TREATMENTS OPERATIONS =====
  treatments = {
    create: async (
      treatmentData: Omit<Treatment, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<Treatment> => {
      try {
        const result = await this.db
          .insert(treatments)
          .values({
            ...treatmentData
          })
          .returning()
        return result[0]
      } catch (error) {
        console.error('Error creating treatment:', error)
        throw error
      }
    },

    getAll: async (): Promise<TreatmentWithRelations[]> => {
      try {
        const result = await this.db
          .select({
            treatment: treatments,
            patient: {
              id: patients.id,
              firstName: patients.firstName,
              lastName: patients.lastName
            },
            dentist: {
              id: dentists.id,
              firstName: dentists.firstName,
              lastName: dentists.lastName
            },
            procedure: {
              id: treatmentProcedures.id,
              name: treatmentProcedures.name,
              code: treatmentProcedures.code
            }
          })
          .from(treatments)
          .innerJoin(patients, eq(treatments.patientId, patients.id))
          .innerJoin(dentists, eq(treatments.dentistId, dentists.id))
          .innerJoin(treatmentProcedures, eq(treatments.procedureId, treatmentProcedures.id))
          .orderBy(desc(treatments.treatmentDate))

        return result.map((row) => ({
          ...row.treatment,
          patient: row.patient,
          dentist: row.dentist,
          procedure: row.procedure
        }))
      } catch (error) {
        console.error('Error fetching treatments:', error)
        throw error
      }
    },

    getById: async (id: number): Promise<TreatmentWithRelations | undefined> => {
      try {
        const result = await this.db
          .select({
            treatment: treatments,
            patient: {
              id: patients.id,
              firstName: patients.firstName,
              lastName: patients.lastName
            },
            dentist: {
              id: dentists.id,
              firstName: dentists.firstName,
              lastName: dentists.lastName
            },
            procedure: {
              id: treatmentProcedures.id,
              name: treatmentProcedures.name,
              code: treatmentProcedures.code
            }
          })
          .from(treatments)
          .innerJoin(patients, eq(treatments.patientId, patients.id))
          .innerJoin(dentists, eq(treatments.dentistId, dentists.id))
          .innerJoin(treatmentProcedures, eq(treatments.procedureId, treatmentProcedures.id))
          .where(eq(treatments.id, id))

        if (!result[0]) return undefined

        return {
          ...result[0].treatment,
          patient: result[0].patient,
          dentist: result[0].dentist,
          procedure: result[0].procedure
        }
      } catch (error) {
        console.error(`Error fetching treatment with ID ${id}:`, error)
        throw error
      }
    },

    update: async (
      id: number,
      treatmentData: Partial<Treatment>
    ): Promise<Treatment | undefined> => {
      try {
        // Omit createdAt from treatmentData to avoid type conflicts
        const { createdAt, updatedAt, ...dataToUpdate } = treatmentData

        const result = await this.db
          .update(treatments)
          .set({
            ...dataToUpdate,
            updatedAt: sql`(unixepoch())`
          })
          .where(eq(treatments.id, id))
          .returning()
        return result[0]
      } catch (error) {
        console.error(`Error updating treatment with ID ${id}:`, error)
        throw error
      }
    },

    delete: async (id: number): Promise<boolean> => {
      try {
        await this.db.delete(treatments).where(eq(treatments.id, id))
        return true
      } catch (error) {
        console.error(`Error deleting treatment with ID ${id}:`, error)
        throw error
      }
    },

    getByPatient: async (patientId: number): Promise<TreatmentWithRelations[]> => {
      try {
        const result = await this.db
          .select({
            treatment: treatments,
            procedure: {
              id: treatmentProcedures.id,
              name: treatmentProcedures.name,
              code: treatmentProcedures.code
            },
            dentist: {
              id: dentists.id,
              firstName: dentists.firstName,
              lastName: dentists.lastName
            }
          })
          .from(treatments)
          .innerJoin(treatmentProcedures, eq(treatments.procedureId, treatmentProcedures.id))
          .innerJoin(dentists, eq(treatments.dentistId, dentists.id))
          .where(eq(treatments.patientId, patientId))
          .orderBy(desc(treatments.treatmentDate))

        return result.map((row) => ({
          ...row.treatment,
          procedure: row.procedure,
          dentist: row.dentist
        }))
      } catch (error) {
        console.error(`Error fetching treatments for patient with ID ${patientId}:`, error)
        throw error
      }
    },

    getByStatus: async (status: string): Promise<TreatmentWithRelations[]> => {
      try {
        const result = await this.db
          .select({
            treatment: treatments,
            patient: {
              id: patients.id,
              firstName: patients.firstName,
              lastName: patients.lastName
            },
            dentist: {
              id: dentists.id,
              firstName: dentists.firstName,
              lastName: dentists.lastName
            },
            procedure: {
              id: treatmentProcedures.id,
              name: treatmentProcedures.name,
              code: treatmentProcedures.code
            }
          })
          .from(treatments)
          .innerJoin(patients, eq(treatments.patientId, patients.id))
          .innerJoin(dentists, eq(treatments.dentistId, dentists.id))
          .innerJoin(treatmentProcedures, eq(treatments.procedureId, treatmentProcedures.id))
          .where(eq(treatments.status, status))
          .orderBy(desc(treatments.treatmentDate))

        return result.map((row) => ({
          ...row.treatment,
          patient: row.patient,
          dentist: row.dentist,
          procedure: row.procedure
        }))
      } catch (error) {
        console.error(`Error fetching treatments with status ${status}:`, error)
        throw error
      }
    }
  }

  // ===== PAYMENTS OPERATIONS =====
  payments = {
    create: async (
      paymentData: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>
    ): Promise<Payment> => {
      try {
        const result = await this.db
          .insert(payments)
          .values({
            ...paymentData
          })
          .returning()
        return result[0]
      } catch (error) {
        console.error('Error creating payment:', error)
        throw error
      }
    },

    getAll: async (): Promise<Payment[]> => {
      try {
        return await this.db.select().from(payments).orderBy(desc(payments.paymentDate))
      } catch (error) {
        console.error('Error fetching payments:', error)
        throw error
      }
    },

    getById: async (id: number): Promise<Payment | undefined> => {
      try {
        const result = await this.db.select().from(payments).where(eq(payments.id, id))
        return result[0]
      } catch (error) {
        console.error(`Error fetching payment with ID ${id}:`, error)
        throw error
      }
    },

    update: async (id: number, paymentData: Partial<Payment>): Promise<Payment | undefined> => {
      try {
        // Omit createdAt from paymentData to avoid type conflicts
        const { createdAt, updatedAt, ...dataToUpdate } = paymentData

        const result = await this.db
          .update(payments)
          .set({
            ...dataToUpdate,
            updatedAt: sql`(unixepoch())`
          })
          .where(eq(payments.id, id))
          .returning()
        return result[0]
      } catch (error) {
        console.error(`Error updating payment with ID ${id}:`, error)
        throw error
      }
    },

    delete: async (id: number): Promise<boolean> => {
      try {
        await this.db.delete(payments).where(eq(payments.id, id))
        return true
      } catch (error) {
        console.error(`Error deleting payment with ID ${id}:`, error)
        throw error
      }
    },

    getByDateRange: async (startDate: string, endDate: string): Promise<Payment[]> => {
      try {
        return await this.db
          .select()
          .from(payments)
          .where(and(gte(payments.paymentDate, startDate), lte(payments.paymentDate, endDate)))
          .orderBy(desc(payments.paymentDate))
      } catch (error) {
        console.error(`Error fetching payments for date range ${startDate} to ${endDate}:`, error)
        throw error
      }
    },

    getByPatient: async (patientId: number): Promise<Payment[]> => {
      try {
        return await this.db
          .select()
          .from(payments)
          .where(eq(payments.patientId, patientId))
          .orderBy(desc(payments.paymentDate))
      } catch (error) {
        console.error(`Error fetching payments for patient with ID ${patientId}:`, error)
        throw error
      }
    }
  }
}
