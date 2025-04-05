import { createSignal, onMount, For, JSX } from 'solid-js'
import { A, useNavigate, useParams } from '@solidjs/router'
import { mockApi } from '../mockApi'
import { Appointment, Invoice, Patient, Treatment } from '@shared/types'
import DeletePatientDialog from '@renderer/pages/Patients/DeletePatientDialog'

export default function PatientDetails(): JSX.Element {
  const params = useParams()
  const navigate = useNavigate()
  const [patient, setPatient] = createSignal<Patient | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = createSignal(false)

  const [activeTab, setActiveTab] = createSignal('profile')
  // TODO: Replace with real data
  const [appointments, setAppointments] = createSignal<Appointment[]>([])
  // TODO: Replace with real data
  const [treatments, setTreatments] = createSignal<Treatment[]>([])
  // TODO: Replace with real data
  const [invoices, setInvoices] = createSignal<Invoice[]>([])

  const handleDeletePatient = async (): Promise<void> => {
    try {
      await window.dentalApi.deletePatient(parseInt(params.id))
      // Navigate back to patients list after deletion
      navigate('/patients')
    } catch (error) {
      console.error('Error deleting patient', error)
      // Handle error - show a notification or message
    }
  }

  onMount(async () => {
    try {
      const patientData: Patient | undefined = await window.dentalApi.getPatientById(
        parseInt(params.id)
      )
      if (!patientData) {
        throw new Error('Patient not found')
      }
      setPatient(patientData)

      // In a real app, these would be separate API calls
      setAppointments(await mockApi.getPatientAppointments(parseInt(params.id)))

      setTreatments([
        {
          id: 1,
          date: '2023-11-05',
          procedure: 'Cleaning',
          notes: 'Regular cleaning, no issues',
          doctor: 'Dr. Jones'
        },
        {
          id: 2,
          date: '2023-08-15',
          procedure: 'Filling',
          notes: 'Small cavity in lower right molar',
          doctor: 'Dr. Smith'
        },
        {
          id: 3,
          date: '2023-05-22',
          procedure: 'Check-up',
          notes: 'All looks good, recommended flossing more regularly',
          doctor: 'Dr. Jones'
        }
      ])
      setInvoices([
        {
          id: 101,
          date: '2023-11-05',
          amount: 120,
          status: 'Paid',
          description: 'Regular cleaning'
        },
        {
          id: 102,
          date: '2023-08-15',
          amount: 350,
          status: 'Paid',
          description: 'Filling procedure'
        },
        { id: 103, date: '2023-05-22', amount: 75, status: 'Paid', description: 'Regular check-up' }
      ])
    } catch (error) {
      console.error('Error fetching patient data', error)
    }
  })

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'treatments', label: 'Treatment History' },
    { id: 'billing', label: 'Billing' }
  ]

  return (
    <div>
      {patient() ? (
        <>
          {/* Patient Header */}
          {/* Patient Header */}
          <div class="bg-white shadow rounded-lg p-6 mb-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-xl text-indigo-800 font-bold">
                  {patient()?.firstName[0]}
                  {patient()?.lastName[0]}
                </div>
              </div>
              <div class="ml-6">
                <h1 class="text-2xl font-bold text-gray-900">
                  {patient()?.firstName} {patient()?.lastName}
                </h1>
                <div class="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                  <div class="mt-2 flex items-center text-sm text-gray-500">
                    <svg
                      class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    {patient()?.email}
                  </div>
                  <div class="mt-2 flex items-center text-sm text-gray-500">
                    <svg
                      class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    {patient()?.phone}
                  </div>
                </div>
              </div>
              <div class="ml-auto flex">
                <A
                  href={`/edit-patient/${params.id}`}
                  class="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Edit Patient
                </A>
                <button
                  onClick={() => setDeleteDialogOpen(true)}
                  class="mr-3 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                >
                  Delete Patient
                </button>
                <A
                  href="/new-appointment"
                  class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  New Appointment
                </A>
              </div>
            </div>
          </div>

          {/* Delete Patient Confirmation Dialog */}
          <DeletePatientDialog
            isOpen={deleteDialogOpen()}
            onClose={() => setDeleteDialogOpen(false)}
            onConfirm={handleDeletePatient}
            patientName={`${patient()?.firstName} ${patient()?.lastName}`}
          />

          {/* Tabs */}
          <div class="mb-6">
            <div class="border-b border-gray-200">
              <nav class="-mb-px flex space-x-8">
                <For each={tabs}>
                  {(tab) => (
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      class={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab() === tab.id
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                    >
                      {tab.label}
                    </button>
                  )}
                </For>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div class="bg-white shadow rounded-lg p-6">
            {/* Profile Tab */}
            {activeTab() === 'profile' && (
              <div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                    <div class="space-y-4">
                      <div>
                        <p class="text-sm font-medium text-gray-500">Full Name</p>
                        <p class="mt-1 text-sm text-gray-900">
                          {patient()?.firstName} {patient()?.lastName}
                        </p>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-500">Date of Birth</p>
                        <p class="mt-1 text-sm text-gray-900">
                          {new Date(patient()!.dateOfBirth!).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-500">Gender</p>
                        <p class="mt-1 text-sm text-gray-900">{patient()?.gender}</p>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-500">Phone</p>
                        <p class="mt-1 text-sm text-gray-900">{patient()?.phone}</p>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-500">Email</p>
                        <p class="mt-1 text-sm text-gray-900">{patient()?.email}</p>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-500">Address</p>
                        <p class="mt-1 text-sm text-gray-900">{patient()?.address}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Medical Information</h3>
                    <div class="space-y-4">
                      <div>
                        <p class="text-sm font-medium text-gray-500">Insurance Provider</p>
                        {/* <p class="mt-1 text-sm text-gray-900">{patient().insurance || 'None'}</p> */}
                        <p class="mt-1 text-sm text-gray-900">{patient()?.insuranceProvider}</p>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-500">Allergies</p>
                        {/* <p class="mt-1 text-sm text-gray-900">{patient().allergies || 'None reported'}</p> */}
                        <p class="mt-1 text-sm text-gray-900">{patient()?.allergies}</p>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-500">Medical History</p>
                        {/* <p class="mt-1 text-sm text-gray-900">{patient().medicalConditions || 'None reported'}</p> */}
                        <p class="mt-1 text-sm text-gray-900">{patient()?.medicalHistory}</p>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-500">Notes</p>
                        {/* <p class="mt-1 text-sm text-gray-900">{patient().notes || 'No additional notes'}</p> */}
                        <p class="mt-1 text-sm text-gray-900">{patient()?.notes}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab() === 'appointments' && (
              <div>
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-medium text-gray-900">Upcoming Appointments</h3>
                  <button class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    Schedule New
                  </button>
                </div>

                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date & Time
                        </th>
                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Type
                        </th>
                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Doctor
                        </th>
                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th scope="col" class="relative px-6 py-3">
                          <span class="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <For each={appointments()}>
                        {(appointment) => (
                          <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(appointment.time).toLocaleString()}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {appointment.procedure}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {appointment.doctor}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                              <span
                                class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${appointment.status === 'Confirmed'
                                    ? 'bg-green-100 text-green-800'
                                    : appointment.status === 'Pending'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                              >
                                {appointment.status}
                              </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button class="text-indigo-600 hover:text-indigo-900 mr-3">
                                Edit
                              </button>
                              <button class="text-red-600 hover:text-red-900">Cancel</button>
                            </td>
                          </tr>
                        )}
                      </For>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Treatments Tab */}
            {activeTab() === 'treatments' && (
              <div>
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-medium text-gray-900">Treatment History</h3>
                  <button class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    Add Treatment
                  </button>
                </div>

                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Procedure
                        </th>
                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Doctor
                        </th>
                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Notes
                        </th>
                        <th scope="col" class="relative px-6 py-3">
                          <span class="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <For each={treatments()}>
                        {(treatment) => (
                          <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(treatment.date).toLocaleDateString()}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {treatment.procedure}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {treatment.doctor}
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-900">{treatment.notes}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button class="text-indigo-600 hover:text-indigo-900">
                                View Details
                              </button>
                            </td>
                          </tr>
                        )}
                      </For>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab() === 'billing' && (
              <div>
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-medium text-gray-900">Billing History</h3>
                  <button class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                    Create Invoice
                  </button>
                </div>

                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Invoice #
                        </th>
                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Description
                        </th>
                        <th scope="col" class="relative px-6 py-3">
                          <span class="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <For each={invoices()}>
                        {(invoice) => (
                          <tr>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              #{invoice.id}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(invoice.date).toLocaleDateString()}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ${invoice.amount.toFixed(2)}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                              <span
                                class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${invoice.status === 'Paid'
                                    ? 'bg-green-100 text-green-800'
                                    : invoice.status === 'Pending'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                              >
                                {invoice.status}
                              </span>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-900">{invoice.description}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button class="text-indigo-600 hover:text-indigo-900 mr-3">
                                View
                              </button>
                              <button class="text-indigo-600 hover:text-indigo-900">Print</button>
                            </td>
                          </tr>
                        )}
                      </For>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div class="flex justify-center items-center h-64">
          <div class="text-center">
            <p class="text-gray-500">Loading patient data...</p>
          </div>
        </div>
      )}
    </div>
  )
}
