import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { isDev } from './util.js'
import { getPreloadPath } from './pathResolver.js'
import { applyDbMigrations, db, dentalOps } from './db/index.js'
import { users } from './db/schema.js'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'

async function createWindow() {
  const mainWin = new BrowserWindow({
    webPreferences: {
      // your existing preferences
      contextIsolation: true,
      webSecurity: true,
      preload: getPreloadPath()
      // other preferences...
    },
    width: 800,
    height: 600
  })

  // Add this handler to ensure all navigation stays within the app
  mainWin.webContents.on('will-navigate', (event, url) => {
    const parsedUrl = new URL(url)
    if (parsedUrl.origin !== 'file://') {
      event.preventDefault()
      mainWin.loadFile(path.join(app.getAppPath(), 'dist-solid', 'index.html'))
    }
  })
  // Set CSP headers
  mainWin.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self';"
        ]
      }
    })
  })

  path.join(app.getAppPath(), 'dist-electron', 'preload.js')

  if (isDev()) {
    mainWin.loadURL('http://localhost:5123')
  } else {
    mainWin.loadFile(path.join(app.getAppPath(), 'dist-solid', 'index.html'))
  }
}

// Run migrations on app start

app.whenReady().then(() => {
  try {
    // Optional: Run migrations at startup
    // migrate(db, { migrationsFolder: './drizzle' });
    applyDbMigrations()

    setupIpcHandlers()
    createWindow()
  } catch (error) {
    console.error('Database migration failed:', error)
  }
})

// Setup all IPC handlers for database operations
function setupIpcHandlers() {
  // ===== PATIENT OPERATIONS =====
  ipcMain.handle('db:patients:getAll', async () => {
    try {
      return await dentalOps.patients.getAll()
    } catch (error) {
      console.error('IPC Error - getPatients:', error)
      throw error
    }
  })

  ipcMain.handle('db:patients:getById', async (_, id) => {
    try {
      return await dentalOps.patients.getById(id)
    } catch (error) {
      console.error(`IPC Error - getPatientById (${id}):`, error)
      throw error
    }
  })

  ipcMain.handle('db:patients:create', async (_, patientData) => {
    try {
      return await dentalOps.patients.create(patientData)
    } catch (error) {
      console.error('IPC Error - createPatient:', error)
      throw error
    }
  })

  ipcMain.handle('db:patients:update', async (_, id, patientData) => {
    try {
      return await dentalOps.patients.update(id, patientData)
    } catch (error) {
      console.error(`IPC Error - updatePatient (${id}):`, error)
      throw error
    }
  })

  ipcMain.handle('db:patients:delete', async (_, id) => {
    try {
      return await dentalOps.patients.delete(id)
    } catch (error) {
      console.error(`IPC Error - deletePatient (${id}):`, error)
      throw error
    }
  })

  ipcMain.handle('db:patients:getWithAppointments', async (_, id) => {
    try {
      return await dentalOps.patients.getWithAppointments(id)
    } catch (error) {
      console.error(`IPC Error - getPatientWithAppointments (${id}):`, error)
      throw error
    }
  })

  ipcMain.handle('db:patients:getWithTreatments', async (_, id) => {
    try {
      return await dentalOps.patients.getWithTreatments(id)
    } catch (error) {
      console.error(`IPC Error - getPatientWithTreatments (${id}):`, error)
      throw error
    }
  })

  ipcMain.handle('db:patients:getWithBalance', async (_, id) => {
    try {
      return await dentalOps.patients.getWithBalance(id)
    } catch (error) {
      console.error(`IPC Error - getPatientWithBalance (${id}):`, error)
      throw error
    }
  })

  ipcMain.handle('db:patients:search', async (_, searchTerm) => {
    try {
      return await dentalOps.patients.search(searchTerm)
    } catch (error) {
      console.error(`IPC Error - searchPatients (${searchTerm}):`, error)
      throw error
    }
  })

  // ===== DENTIST OPERATIONS =====
  ipcMain.handle('db:dentists:getAll', async () => {
    try {
      return await dentalOps.dentists.getAll()
    } catch (error) {
      console.error('IPC Error - getDentists:', error)
      throw error
    }
  })

  ipcMain.handle('db:dentists:getById', async (_, id) => {
    try {
      return await dentalOps.dentists.getById(id)
    } catch (error) {
      console.error(`IPC Error - getDentistById (${id}):`, error)
      throw error
    }
  })

  ipcMain.handle('db:dentists:create', async (_, dentistData) => {
    try {
      return await dentalOps.dentists.create(dentistData)
    } catch (error) {
      console.error('IPC Error - createDentist:', error)
      throw error
    }
  })

  ipcMain.handle('db:dentists:update', async (_, id, dentistData) => {
    try {
      return await dentalOps.dentists.update(id, dentistData)
    } catch (error) {
      console.error(`IPC Error - updateDentist (${id}):`, error)
      throw error
    }
  })

  ipcMain.handle('db:dentists:delete', async (_, id) => {
    try {
      return await dentalOps.dentists.delete(id)
    } catch (error) {
      console.error(`IPC Error - deleteDentist (${id}):`, error)
      throw error
    }
  })

  ipcMain.handle('db:dentists:getSchedule', async (_, id, date) => {
    try {
      return await dentalOps.dentists.getSchedule(id, date)
    } catch (error) {
      console.error(`IPC Error - getDentistSchedule (${id}, ${date}):`, error)
      throw error
    }
  })

  // ===== APPOINTMENT OPERATIONS =====
  ipcMain.handle('db:appointments:getAll', async () => {
    try {
      return await dentalOps.appointments.getAll()
    } catch (error) {
      console.error('IPC Error - getAppointments:', error)
      throw error
    }
  })

  ipcMain.handle('db:appointments:getById', async (_, id) => {
    try {
      return await dentalOps.appointments.getById(id)
    } catch (error) {
      console.error(`IPC Error - getAppointmentById (${id}):`, error)
      throw error
    }
  })

  ipcMain.handle('db:appointments:create', async (_, appointmentData) => {
    try {
      return await dentalOps.appointments.create(appointmentData)
    } catch (error) {
      console.error('IPC Error - createAppointment:', error)
      throw error
    }
  })

  ipcMain.handle('db:appointments:update', async (_, id, appointmentData) => {
    try {
      return await dentalOps.appointments.update(id, appointmentData)
    } catch (error) {
      console.error(`IPC Error - updateAppointment (${id}):`, error)
      throw error
    }
  })

  ipcMain.handle('db:appointments:delete', async (_, id) => {
    try {
      return await dentalOps.appointments.delete(id)
    } catch (error) {
      console.error(`IPC Error - deleteAppointment (${id}):`, error)
      throw error
    }
  })

  ipcMain.handle('db:appointments:getByDateRange', async (_, startDate, endDate) => {
    try {
      return await dentalOps.appointments.getByDateRange(startDate, endDate)
    } catch (error) {
      console.error(`IPC Error - getAppointmentsByDateRange (${startDate} to ${endDate}):`, error)
      throw error
    }
  })

  ipcMain.handle(
    'db:appointments:checkConflicts',
    async (_, dentistId, date, startTime, endTime, excludeId) => {
      try {
        return await dentalOps.appointments.checkConflicts(
          dentistId,
          date,
          startTime,
          endTime,
          excludeId
        )
      } catch (error) {
        console.error(`IPC Error - checkAppointmentConflicts:`, error)
        throw error
      }
    }
  )

  // ===== TREATMENT PROCEDURE OPERATIONS =====
  ipcMain.handle('db:procedures:getAll', async () => {
    try {
      return await dentalOps.procedures.getAll()
    } catch (error) {
      console.error('IPC Error - getProcedures:', error)
      throw error
    }
  })

  ipcMain.handle('db:procedures:getById', async (_, id) => {
    try {
      return await dentalOps.procedures.getById(id)
    } catch (error) {
      console.error(`IPC Error - getProcedureById (${id}):`, error)
      throw error
    }
  })

  ipcMain.handle('db:procedures:create', async (_, procedureData) => {
    try {
      return await dentalOps.procedures.create(procedureData)
    } catch (error) {
      console.error('IPC Error - createProcedure:', error)
      throw error
    }
  })

  ipcMain.handle('db:procedures:update', async (_, id, procedureData) => {
    try {
      return await dentalOps.procedures.update(id, procedureData)
    } catch (error) {
      console.error(`IPC Error - updateProcedure (${id}):`, error)
      throw error
    }
  })

  ipcMain.handle('db:procedures:delete', async (_, id) => {
    try {
      return await dentalOps.procedures.delete(id)
    } catch (error) {
      console.error(`IPC Error - deleteProcedure (${id}):`, error)
      throw error
    }
  })

  ipcMain.handle('db:procedures:getByCategory', async (_, category) => {
    try {
      return await dentalOps.procedures.getByCategory(category)
    } catch (error) {
      console.error(`IPC Error - getProceduresByCategory (${category}):`, error)
      throw error
    }
  })

  // ===== TREATMENT OPERATIONS =====
  ipcMain.handle('db:treatments:getAll', async () => {
    try {
      return await dentalOps.treatments.getAll()
    } catch (error) {
      console.error('IPC Error - getTreatments:', error)
      throw error
    }
  })

  ipcMain.handle('db:treatments:getById', async (_, id) => {
    try {
      return await dentalOps.treatments.getById(id)
    } catch (error) {
      console.error(`IPC Error - getTreatmentById (${id}):`, error)
      throw error
    }
  })

  ipcMain.handle('db:treatments:create', async (_, treatmentData) => {
    try {
      return await dentalOps.treatments.create(treatmentData)
    } catch (error) {
      console.error('IPC Error - createTreatment:', error)
      throw error
    }
  })

  ipcMain.handle('db:treatments:update', async (_, id, treatmentData) => {
    try {
      return await dentalOps.treatments.update(id, treatmentData)
    } catch (error) {
      console.error(`IPC Error - updateTreatment (${id}):`, error)
      throw error
    }
  })

  ipcMain.handle('db:treatments:delete', async (_, id) => {
    try {
      return await dentalOps.treatments.delete(id)
    } catch (error) {
      console.error(`IPC Error - deleteTreatment (${id}):`, error)
      throw error
    }
  })

  ipcMain.handle('db:treatments:getByPatient', async (_, patientId) => {
    try {
      return await dentalOps.treatments.getByPatient(patientId)
    } catch (error) {
      console.error(`IPC Error - getTreatmentsByPatient (${patientId}):`, error)
      throw error
    }
  })

  ipcMain.handle('db:treatments:getByStatus', async (_, status) => {
    try {
      return await dentalOps.treatments.getByStatus(status)
    } catch (error) {
      console.error(`IPC Error - getTreatmentsByStatus (${status}):`, error)
      throw error
    }
  })

  // ===== PAYMENT OPERATIONS =====
  ipcMain.handle('db:payments:getAll', async () => {
    try {
      return await dentalOps.payments.getAll()
    } catch (error) {
      console.error('IPC Error - getPayments:', error)
      throw error
    }
  })

  ipcMain.handle('db:payments:getById', async (_, id) => {
    try {
      return await dentalOps.payments.getById(id)
    } catch (error) {
      console.error(`IPC Error - getPaymentById (${id}):`, error)
      throw error
    }
  })

  ipcMain.handle('db:payments:create', async (_, paymentData) => {
    try {
      return await dentalOps.payments.create(paymentData)
    } catch (error) {
      console.error('IPC Error - createPayment:', error)
      throw error
    }
  })

  ipcMain.handle('db:payments:update', async (_, id, paymentData) => {
    try {
      return await dentalOps.payments.update(id, paymentData)
    } catch (error) {
      console.error(`IPC Error - updatePayment (${id}):`, error)
      throw error
    }
  })

  ipcMain.handle('db:payments:delete', async (_, id) => {
    try {
      return await dentalOps.payments.delete(id)
    } catch (error) {
      console.error(`IPC Error - deletePayment (${id}):`, error)
      throw error
    }
  })

  ipcMain.handle('db:payments:getByDateRange', async (_, startDate, endDate) => {
    try {
      return await dentalOps.payments.getByDateRange(startDate, endDate)
    } catch (error) {
      console.error(`IPC Error - getPaymentsByDateRange (${startDate} to ${endDate}):`, error)
      throw error
    }
  })

  ipcMain.handle('db:payments:getByPatient', async (_, patientId) => {
    try {
      return await dentalOps.payments.getByPatient(patientId)
    } catch (error) {
      console.error(`IPC Error - getPaymentsByPatient (${patientId}):`, error)
      throw error
    }
  })

  // Legacy auth handlers (keep for backward compatibility)
  ipcMain.handle('create-user', async (event, userData) => {
    try {
      const result = await db.insert(users).values(userData).returning()
      return result
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  })

  ipcMain.handle('get-users', async () => {
    try {
      return await db.select().from(users)
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  })
}

// quitting the app when no windows are open on non-macOS platforms
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
