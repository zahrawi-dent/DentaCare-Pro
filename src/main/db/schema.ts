// db/schema.ts
import { relations, sql } from 'drizzle-orm'
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'

// Define TypeScript interfaces for each table with null handling
export interface Patient {
  id: number
  firstName: string
  lastName: string
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

// Patients table
// TODO: add last visit?
export const patients = sqliteTable('patients', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  dateOfBirth: text('date_of_birth').notNull(),
  gender: text('gender').notNull(),
  phone: text('phone').notNull(),
  email: text('email'),
  address: text('address'),
  insuranceProvider: text('insurance_provider'),
  insuranceNumber: text('insurance_number'),
  medicalHistory: text('medical_history'),
  allergies: text('allergies'),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
})

// Dentists table
export const dentists = sqliteTable('dentists', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  specialization: text('specialization'),
  phone: text('phone').notNull(),
  email: text('email').notNull(),
  licenseNumber: text('license_number').notNull(),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
})

// Appointments table
export const appointments = sqliteTable('appointments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  patientId: integer('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  dentistId: integer('dentist_id')
    .notNull()
    .references(() => dentists.id, { onDelete: 'cascade' }),
  appointmentDate: text('appointment_date').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time').notNull(),
  status: text('status').notNull().default('scheduled'), // scheduled, completed, cancelled, no-show
  type: text('type').notNull(), // general, emergency, follow-up, etc.
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
})

// Treatment procedures table
export const treatmentProcedures = sqliteTable('treatment_procedures', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  code: text('code').notNull().unique(),
  name: text('name').notNull(),
  description: text('description'),
  defaultCost: real('default_cost').notNull(),
  category: text('category').notNull(), // preventive, restorative, surgical, etc.
  duration: integer('duration').notNull(), // estimated duration in minutes
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
})

// Treatments table (actual treatments performed on patients)
export const treatments = sqliteTable('treatments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  patientId: integer('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  dentistId: integer('dentist_id')
    .notNull()
    .references(() => dentists.id, { onDelete: 'cascade' }),
  procedureId: integer('procedure_id')
    .notNull()
    .references(() => treatmentProcedures.id),
  appointmentId: integer('appointment_id').references(() => appointments.id),
  treatmentDate: text('treatment_date').notNull(),
  cost: real('cost').notNull(),
  tooth: text('tooth'), // tooth number or range
  notes: text('notes'),
  status: text('status').notNull().default('planned'), // planned, in-progress, completed
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
})

// Payments table
export const payments = sqliteTable('payments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  patientId: integer('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  amount: real('amount').notNull(),
  paymentDate: text('payment_date').notNull(),
  paymentMethod: text('payment_method').notNull(), // cash, credit card, insurance, etc.
  relatedTreatmentIds: text('related_treatment_ids'), // comma-separated IDs
  notes: text('notes'),
  receiptNumber: text('receipt_number'),
  insuranceClaim: text('insurance_claim'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
})

// Inventory items table
export const inventoryItems = sqliteTable('inventory_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  category: text('category').notNull(),
  quantity: integer('quantity').notNull().default(0),
  unit: text('unit').notNull(),
  minQuantity: integer('min_quantity').notNull().default(5),
  costPerUnit: real('cost_per_unit').notNull(),
  supplier: text('supplier'),
  lastOrderDate: text('last_order_date'),
  expiryDate: text('expiry_date'),
  location: text('location'),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
})

// Dental chart data table (for storing dental charts)
export const dentalCharts = sqliteTable('dental_charts', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  patientId: integer('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  chartDate: text('chart_date').notNull(),
  chartData: text('chart_data').notNull(), // JSON string with tooth status
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
})

// Documents table (for patient files like X-rays, prescriptions)
export const documents = sqliteTable('documents', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  patientId: integer('patient_id')
    .notNull()
    .references(() => patients.id, { onDelete: 'cascade' }),
  fileName: text('file_name').notNull(),
  filePath: text('file_path').notNull(),
  fileType: text('file_type').notNull(), // x-ray, prescription, etc.
  description: text('description'),
  uploadDate: text('upload_date').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
})

// Users table (for app login)
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull(), // admin, dentist, reception, etc.
  dentistId: integer('dentist_id').references(() => dentists.id), // If user is a dentist
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').unique(),
  lastLogin: integer('last_login', { mode: 'timestamp' }),
  active: integer('active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`)
})

// Define relations
export const patientsRelations = relations(patients, ({ many }) => ({
  appointments: many(appointments),
  treatments: many(treatments),
  payments: many(payments)
}))

export const dentistsRelations = relations(dentists, ({ many }) => ({
  appointments: many(appointments),
  treatments: many(treatments)
}))

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  patient: one(patients, {
    fields: [appointments.patientId],
    references: [patients.id]
  }),
  dentist: one(dentists, {
    fields: [appointments.dentistId],
    references: [dentists.id]
  })
}))

export const treatmentsRelations = relations(treatments, ({ one }) => ({
  patient: one(patients, {
    fields: [treatments.patientId],
    references: [patients.id]
  }),
  dentist: one(dentists, {
    fields: [treatments.dentistId],
    references: [dentists.id]
  }),
  procedure: one(treatmentProcedures, {
    fields: [treatments.procedureId],
    references: [treatmentProcedures.id]
  }),
  appointment: one(appointments, {
    fields: [treatments.appointmentId],
    references: [appointments.id]
  })
}))

export const paymentsRelations = relations(payments, ({ one }) => ({
  patient: one(patients, {
    fields: [payments.patientId],
    references: [patients.id]
  })
}))

export const dentalChartsRelations = relations(dentalCharts, ({ one }) => ({
  patient: one(patients, {
    fields: [dentalCharts.patientId],
    references: [patients.id]
  })
}))

export const documentsRelations = relations(documents, ({ one }) => ({
  patient: one(patients, {
    fields: [documents.patientId],
    references: [patients.id]
  })
}))

export const usersRelations = relations(users, ({ one }) => ({
  dentist: one(dentists, {
    fields: [users.dentistId],
    references: [dentists.id]
  })
}))
