import { createSignal, createEffect, JSX, For } from 'solid-js'
import { A } from '@solidjs/router'
import { Patient } from '../types/dental-api'

export default function PatientsList(): JSX.Element {
  const [searchTerm, setSearchTerm] = createSignal('')
  const [patients, setPatients] = createSignal<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = createSignal<Patient[]>([])

  // Fetch data on component initialization
  createEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        // setLoading(true)

        // Access the API exposed through the preload script
        const fetchedPatients = await window.dentalApi.getPatients()
        // const fetchedDentists = await window.dentalApi.getDentists()

        setPatients(fetchedPatients)
        // setDentists(fetchedDentists)
        // setError(null)
      } catch (err) {
        console.error('Error fetching data:', err)
        // setError('Failed to fetch data. See console for details.')
      } finally {
        // setLoading(false)
      }
    }

    fetchData()
  })

  createEffect(() => {
    const term = searchTerm().toLowerCase()
    if (term === '') {
      setFilteredPatients(patients())
    } else {
      setFilteredPatients(
        patients().filter(
          (patient) =>
            patient.firstName.toLowerCase().includes(term) ||
            patient.email?.toLowerCase().includes(term) ||
            patient.phone.includes(term)
        )
      )
    }
  })

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-900">Patients</h1>
        {/* TODO: register-patient backButton go back to patients instead of dashboard  */}
        <A
          href="/register-patient"
          class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Register New Patient
        </A>
      </div>

      {/* Search and Filter */}
      <div class="mb-6">
        <div class="relative rounded-md shadow-sm">
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm()}
            onInput={(e) => setSearchTerm(e.target.value)}
            class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
          />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg
              class="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Patient List */}
      <div class="bg-white shadow overflow-hidden rounded-md">
        <ul class="divide-y divide-gray-200">
          <For each={filteredPatients()}>
            {(patient) => (
              <li>
                <A href={`/patients/${patient.id}`} class="block hover:bg-gray-50">
                  <div class="px-6 py-4 flex items-center">
                    <div class="min-w-0 flex-1 flex items-center">
                      <div class="flex-shrink-0">
                        <div class="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                          {patient.firstName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                      </div>
                      <div class="min-w-0 flex-1 px-4">
                        <div>
                          <p class="text-sm font-medium text-indigo-600 truncate">
                            {patient.firstName}
                          </p>
                          <p class="mt-1 flex items-center text-sm text-gray-500">
                            <span class="truncate">{patient.email}</span>
                          </p>
                        </div>
                      </div>
                      <div class="hidden md:block">
                        <div>
                          <p class="text-sm text-gray-900">{patient.phone}</p>
                          <p class="mt-1 text-sm text-gray-500">
                            Last Visit: {new Date(patient.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <svg
                        class="h-5 w-5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </A>
              </li>
            )}
          </For>
        </ul>
      </div>
    </div>
  )
}
