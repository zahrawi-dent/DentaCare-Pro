// import { createSignal, createEffect, JSX, For } from 'solid-js'
// import { A } from '@solidjs/router'
// import { Patient } from '../types/dental-api'
//
// export default function PatientsList(): JSX.Element {
//   const [searchTerm, setSearchTerm] = createSignal('')
//   const [patients, setPatients] = createSignal<Patient[]>([])
//   const [filteredPatients, setFilteredPatients] = createSignal<Patient[]>([])
//
//   // Fetch data on component initialization
//   createEffect(() => {
//     async function fetchData(): Promise<void> {
//       try {
//         // setLoading(true)
//
//         // Access the API exposed through the preload script
//         const fetchedPatients = await window.dentalApi.getPatients()
//         // const fetchedDentists = await window.dentalApi.getDentists()
//
//         setPatients(fetchedPatients)
//         // setDentists(fetchedDentists)
//         // setError(null)
//       } catch (err) {
//         console.error('Error fetching data:', err)
//         // setError('Failed to fetch data. See console for details.')
//       } finally {
//         // setLoading(false)
//       }
//     }
//
//     fetchData()
//   })
//
//   createEffect(() => {
//     const term = searchTerm().toLowerCase()
//     if (term === '') {
//       setFilteredPatients(patients())
//     } else {
//       setFilteredPatients(
//         patients().filter(
//           (patient) =>
//             patient.firstName.toLowerCase().includes(term) ||
//             patient.email?.toLowerCase().includes(term) ||
//             patient.phone.includes(term)
//         )
//       )
//     }
//   })
//
//   return (
//     <div>
//       <div class="flex justify-between items-center mb-6">
//         <h1 class="text-2xl font-semibold text-gray-900">Patients</h1>
//         {/* TODO: register-patient backButton go back to patients instead of dashboard  */}
//         <A
//           href="/register-patient"
//           class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
//         >
//           Register New Patient
//         </A>
//       </div>
//
//       {/* Search and Filter */}
//       <div class="mb-6">
//         <div class="relative rounded-md shadow-sm">
//           <input
//             type="text"
//             placeholder="Search patients..."
//             value={searchTerm()}
//             onInput={(e) => setSearchTerm(e.target.value)}
//             class="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
//           />
//           <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//             <svg
//               class="h-5 w-5 text-gray-400"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 stroke-linecap="round"
//                 stroke-linejoin="round"
//                 stroke-width="2"
//                 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//               />
//             </svg>
//           </div>
//         </div>
//       </div>
//
//       {/* Patient List */}
//       <div class="bg-white shadow overflow-hidden rounded-md">
//         <ul class="divide-y divide-gray-200">
//           <For each={filteredPatients()}>
//             {(patient) => (
//               <li>
//                 <A href={`/patients/${patient.id}`} class="block hover:bg-gray-50">
//                   <div class="px-6 py-4 flex items-center">
//                     <div class="min-w-0 flex-1 flex items-center">
//                       <div class="flex-shrink-0">
//                         <div class="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
//                           {patient.firstName
//                             .split(' ')
//                             .map((n) => n[0])
//                             .join('')}
//                         </div>
//                       </div>
//                       <div class="min-w-0 flex-1 px-4">
//                         <div>
//                           <p class="text-sm font-medium text-indigo-600 truncate">
//                             {patient.firstName}
//                           </p>
//                           <p class="mt-1 flex items-center text-sm text-gray-500">
//                             <span class="truncate">{patient.email}</span>
//                           </p>
//                         </div>
//                       </div>
//                       <div class="hidden md:block">
//                         <div>
//                           <p class="text-sm text-gray-900">{patient.phone}</p>
//                           <p class="mt-1 text-sm text-gray-500">
//                             Last Visit: {new Date(patient.updatedAt).toLocaleDateString()}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                     <div>
//                       <svg
//                         class="h-5 w-5 text-gray-400"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           stroke-linecap="round"
//                           stroke-linejoin="round"
//                           stroke-width="2"
//                           d="M9 5l7 7-7 7"
//                         />
//                       </svg>
//                     </div>
//                   </div>
//                 </A>
//               </li>
//             )}
//           </For>
//         </ul>
//       </div>
//     </div>
//   )
// }
// import { createSignal, createEffect, JSX, For, Show } from 'solid-js'
// import { A } from '@solidjs/router'
// import { Patient } from '../types/dental-api'
//
// export default function PatientsList(): JSX.Element {
//   const [patients, setPatients] = createSignal<Patient[]>([])
//   const [isSearchOpen, setIsSearchOpen] = createSignal(false)
//   const [searchTerm, setSearchTerm] = createSignal('')
//   const [searchResults, setSearchResults] = createSignal<Patient[]>([])
//   const [isSearching, setIsSearching] = createSignal(false)
//
//   // Fetch initial patient data
//   createEffect(() => {
//     async function fetchData(): Promise<void> {
//       try {
//         const fetchedPatients = await window.dentalApi.getPatients()
//         setPatients(fetchedPatients)
//       } catch (err) {
//         console.error('Error fetching data:', err)
//       }
//     }
//
//     fetchData()
//   })
//
//   // Handle search with debounce
//   let searchTimeout: number | undefined
//
//   const handleSearch = async (value: string) => {
//     setSearchTerm(value)
//
//     // Clear previous timeout
//     if (searchTimeout) {
//       clearTimeout(searchTimeout)
//     }
//
//     // Don't search if empty
//     if (!value.trim()) {
//       setSearchResults([])
//       setIsSearching(false)
//       return
//     }
//
//     setIsSearching(true)
//
//     // Debounce search to prevent excessive API calls
//     searchTimeout = window.setTimeout(async () => {
//       try {
//         const results = await window.dentalApi.search(value)
//         setSearchResults(results)
//       } catch (error) {
//         console.error('Search failed:', error)
//         setSearchResults([])
//       } finally {
//         setIsSearching(false)
//       }
//     }, 300)
//   }
//
//   // Handle keyboard shortcut to open search
//   createEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       // Open search with Ctrl+K or Cmd+K
//       if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
//         e.preventDefault()
//         setIsSearchOpen(true)
//       }
//
//       // Close with Escape
//       if (e.key === 'Escape' && isSearchOpen()) {
//         setIsSearchOpen(false)
//       }
//     }
//
//     window.addEventListener('keydown', handleKeyDown)
//     return () => {
//       window.removeEventListener('keydown', handleKeyDown)
//     }
//   })
//
//   // Focus search input when opened
//   let searchInputRef: HTMLInputElement | undefined
//
//   createEffect(() => {
//     if (isSearchOpen() && searchInputRef) {
//       setTimeout(() => {
//         searchInputRef?.focus()
//       }, 100)
//     }
//   })
//
//   const closeSearch = () => {
//     setIsSearchOpen(false)
//     setSearchTerm('')
//     setSearchResults([])
//   }
//
//   return (
//     <div>
//       <div class="flex justify-between items-center mb-6">
//         <h1 class="text-2xl font-semibold text-gray-900">Patients</h1>
//
//         <div class="flex space-x-4">
//           {/* Search button */}
//           <button
//             onClick={() => setIsSearchOpen(true)}
//             class="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
//           >
//             <svg
//               class="h-5 w-5 text-gray-400 mr-2"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 stroke-linecap="round"
//                 stroke-linejoin="round"
//                 stroke-width="2"
//                 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//               />
//             </svg>
//             Search
//             <span class="ml-2 text-xs text-gray-400">Ctrl+K</span>
//           </button>
//
//           <A
//             href="/register-patient"
//             class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
//           >
//             Register New Patient
//           </A>
//         </div>
//       </div>
//
//       {/* Patient List */}
//       <div class="bg-white shadow overflow-hidden rounded-md">
//         <ul class="divide-y divide-gray-200">
//           <For each={patients()}>
//             {(patient) => (
//               <li>
//                 <A href={`/patients/${patient.id}`} class="block hover:bg-gray-50">
//                   <div class="px-6 py-4 flex items-center">
//                     <div class="min-w-0 flex-1 flex items-center">
//                       <div class="flex-shrink-0">
//                         <div class="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
//                           {patient.firstName?.[0]?.toUpperCase() || ''}
//                           {patient.lastName?.[0]?.toUpperCase() || ''}
//                         </div>
//                       </div>
//                       <div class="min-w-0 flex-1 px-4">
//                         <div>
//                           <p class="text-sm font-medium text-indigo-600 truncate">
//                             {patient.firstName} {patient.lastName}
//                           </p>
//                           <p class="mt-1 flex items-center text-sm text-gray-500">
//                             <span class="truncate">{patient.email}</span>
//                           </p>
//                         </div>
//                       </div>
//                       <div class="hidden md:block">
//                         <div>
//                           <p class="text-sm text-gray-900">{patient.phone}</p>
//                           <p class="mt-1 text-sm text-gray-500">
//                             Last Visit:{' '}
//                             {patient.updatedAt
//                               ? new Date(patient.updatedAt).toLocaleDateString()
//                               : 'Never'}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                     <div>
//                       <svg
//                         class="h-5 w-5 text-gray-400"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           stroke-linecap="round"
//                           stroke-linejoin="round"
//                           stroke-width="2"
//                           d="M9 5l7 7-7 7"
//                         />
//                       </svg>
//                     </div>
//                   </div>
//                 </A>
//               </li>
//             )}
//           </For>
//         </ul>
//       </div>
//
//       {/* Search Overlay */}
//       <Show when={isSearchOpen()}>
//         <div
//           class="fixed inset-0 bg-gray-600 bg-opacity-75 backdrop-blur-sm z-40 transition-opacity"
//           onClick={closeSearch}
//         />
//
//         <div class="fixed inset-x-0 top-0 z-50 mx-auto max-w-2xl mt-16 px-4">
//           <div class="bg-white rounded-lg shadow-2xl overflow-hidden">
//             {/* Search Input */}
//             <div class="relative">
//               <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <svg
//                   class="h-5 w-5 text-gray-400"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     stroke-linecap="round"
//                     stroke-linejoin="round"
//                     stroke-width="2"
//                     d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                   />
//                 </svg>
//               </div>
//               <input
//                 ref={searchInputRef}
//                 type="text"
//                 placeholder="Search patients by name, phone or email..."
//                 value={searchTerm()}
//                 onInput={(e) => handleSearch(e.target.value)}
//                 class="block w-full pl-10 pr-12 py-4 border-0 text-gray-900 placeholder-gray-500 focus:outline-none"
//               />
//               {/* Keyboard shortcut display */}
//               <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
//                 <kbd class="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-400 bg-gray-100 rounded">
//                   Esc
//                 </kbd>
//               </div>
//             </div>
//
//             {/* Divider */}
//             <div class="border-t border-gray-200" />
//
//             {/* Results area */}
//             <div class="max-h-96 overflow-y-auto">
//               <Show when={isSearching()}>
//                 <div class="py-12 text-center">
//                   <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500" />
//                   <p class="mt-2 text-sm text-gray-500">Searching...</p>
//                 </div>
//               </Show>
//
//               <Show when={!isSearching() && searchTerm().trim() && searchResults().length === 0}>
//                 <div class="py-12 text-center">
//                   <svg
//                     class="mx-auto h-12 w-12 text-gray-400"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     aria-hidden="true"
//                   >
//                     <path
//                       stroke-linecap="round"
//                       stroke-linejoin="round"
//                       stroke-width="2"
//                       d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                     />
//                   </svg>
//                   <p class="mt-2 text-sm text-gray-500">No results found for "{searchTerm()}"</p>
//                 </div>
//               </Show>
//
//               <ul class="divide-y divide-gray-200">
//                 <For each={searchResults()}>
//                   {(patient) => (
//                     <li>
//                       <A
//                         href={`/patients/${patient.id}`}
//                         class="block hover:bg-gray-50"
//                         onClick={closeSearch}
//                       >
//                         <div class="px-6 py-4 flex items-center">
//                           <div class="min-w-0 flex-1 flex items-center">
//                             <div class="flex-shrink-0">
//                               <div class="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
//                                 {patient.firstName?.[0]?.toUpperCase() || ''}
//                                 {patient.lastName?.[0]?.toUpperCase() || ''}
//                               </div>
//                             </div>
//                             <div class="min-w-0 flex-1 px-4">
//                               <div>
//                                 <p class="text-sm font-medium text-indigo-600 truncate">
//                                   {patient.firstName} {patient.lastName}
//                                 </p>
//                                 <p class="mt-1 flex items-center text-sm text-gray-500">
//                                   <span class="truncate">{patient.email}</span>
//                                 </p>
//                               </div>
//                             </div>
//                             <div>
//                               <p class="text-sm text-gray-500">{patient.phone}</p>
//                             </div>
//                           </div>
//                         </div>
//                       </A>
//                     </li>
//                   )}
//                 </For>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </Show>
//     </div>
//   )
// }

import { createSignal, createEffect, JSX, For, Show, onCleanup } from 'solid-js'
import { A, useNavigate } from '@solidjs/router'
import { Patient } from '../types/dental-api'

export default function PatientsList(): JSX.Element {
  const [patients, setPatients] = createSignal<Patient[]>([])
  const [isSearchOpen, setIsSearchOpen] = createSignal(false)
  const [searchTerm, setSearchTerm] = createSignal('')
  const [searchResults, setSearchResults] = createSignal<Patient[]>([])
  const [isSearching, setIsSearching] = createSignal(false)
  const [selectedIndex, setSelectedIndex] = createSignal(-1)
  const navigate = useNavigate()

  // Fetch initial patient data - replace with your original PatientsList logic
  // but keep this component otherwise as is
  createEffect(() => {
    async function fetchData(): Promise<void> {
      try {
        // Your original fetch logic here
        // This shouldn't use search() - it should use your original
        // getPatients() call just like in your original component
        const fetchedPatients = await window.dentalApi.getPatients()
        setPatients(fetchedPatients)
      } catch (err) {
        console.error('Error fetching data:', err)
      }
    }

    fetchData()
  })

  // Handle search with debounce
  let searchTimeout: number | undefined

  const handleSearch = async (value: string) => {
    setSearchTerm(value)
    setSelectedIndex(-1) // Reset selection when search term changes

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    // Don't search if empty
    if (!value.trim()) {
      setSearchResults([])
      setIsSearching(false)
      return
    }

    setIsSearching(true)

    // Debounce search to prevent excessive API calls
    searchTimeout = window.setTimeout(async () => {
      try {
        // Only use the search API for searching
        const results = await window.dentalApi.searchPatients(value)
        setSearchResults(results)

        // Auto-select first result if available
        if (results.length > 0) {
          setSelectedIndex(0)
        }
      } catch (error) {
        console.error('Search failed:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }, 300)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    const results = searchResults()

    // No need to check isSearchOpen() here as this handler is only active when the input exists/is focused
    if (results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % results.length)
        // Add logic to scroll the selected item into view if needed
        break

      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1))
        // Add logic to scroll the selected item into view if needed
        break

      case 'Enter':
        e.preventDefault()
        const selected = selectedIndex()
        if (selected >= 0 && selected < results.length) {
          const patient = results[selected]
          navigateToPatient(String(patient.id))
        }
        break
    }
  }

  // Global keyboard shortcut handling
  createEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Open search with Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true) // Open the search
      }
      // --- START: Added Escape Handling ---
      // Close search with Escape *if it's open*
      else if (isSearchOpen() && e.key === 'Escape') {
        e.preventDefault()
        closeSearch() // Close the search
      }
      // --- END: Added Escape Handling ---
    }

    window.addEventListener('keydown', handleGlobalKeyDown)

    onCleanup(() => {
      window.removeEventListener('keydown', handleGlobalKeyDown)
      // Clear timeout on component cleanup
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    })
  })

  // Focus search input when opened
  let searchInputRef: HTMLInputElement | undefined

  createEffect(() => {
    if (isSearchOpen() && searchInputRef) {
      setTimeout(() => {
        searchInputRef?.focus()
      }, 100)
    }
  })

  // Function to navigate to patient page
  const navigateToPatient = (patientId: string) => {
    closeSearch()
    navigate(`/patients/${patientId}`)
  }

  const closeSearch = () => {
    setIsSearchOpen(false)
    setSearchTerm('')
    setSearchResults([])
    setSelectedIndex(-1)
  }

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-semibold text-gray-900">Patients</h1>

        <div class="flex space-x-4">
          {/* Search button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            class="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg
              class="h-5 w-5 text-gray-400 mr-2"
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
            Search
            <span class="ml-2 text-xs text-gray-400">Ctrl+K</span>
          </button>

          <A
            href="/register-patient"
            class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Register New Patient
          </A>
        </div>
      </div>

      {/* Patient List */}
      <div class="bg-white shadow overflow-hidden rounded-md">
        <ul class="divide-y divide-gray-200">
          <For each={patients()}>
            {(patient) => (
              <li>
                <A href={`/patients/${patient.id}`} class="block hover:bg-gray-50">
                  <div class="px-6 py-4 flex items-center">
                    <div class="min-w-0 flex-1 flex items-center">
                      <div class="flex-shrink-0">
                        <div class="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                          {patient.firstName?.[0]?.toUpperCase() || ''}
                          {patient.lastName?.[0]?.toUpperCase() || ''}
                        </div>
                      </div>
                      <div class="min-w-0 flex-1 px-4">
                        <div>
                          <p class="text-sm font-medium text-indigo-600 truncate">
                            {patient.firstName} {patient.lastName}
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
                            Last Visit:{' '}
                            {patient.updatedAt
                              ? new Date(patient.updatedAt).toLocaleDateString()
                              : 'Never'}
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

      {/* Search Overlay - Transparent with backdrop blur */}
      <Show when={isSearchOpen()}>
        <div
          class="fixed inset-0 backdrop-blur-sm z-40 transition-opacity"
          onClick={closeSearch}
          style={{ 'background-color': 'rgba(0, 0, 0, 0.3)' }}
        />

        <div class="fixed inset-x-0 top-0 z-50 mx-auto max-w-2xl mt-16 px-4">
          <div class="bg-white rounded-lg shadow-2xl overflow-hidden">
            {/* Search Input */}
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search patients by name, phone or email..."
                value={searchTerm()}
                onInput={(e) => handleSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                class="block w-full pl-10 pr-12 py-4 border-0 text-gray-900 placeholder-gray-500 focus:outline-none"
              />
              {/* Keyboard shortcut display */}
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <div class="text-xs text-gray-400 flex gap-2">
                  <kbd class="inline-flex items-center px-2 py-1 font-medium bg-gray-100 rounded">
                    ↑↓
                  </kbd>
                  <kbd class="inline-flex items-center px-2 py-1 font-medium bg-gray-100 rounded">
                    Enter
                  </kbd>
                  <kbd class="inline-flex items-center px-2 py-1 font-medium bg-gray-100 rounded">
                    Esc
                  </kbd>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div class="border-t border-gray-200" />

            {/* Results area */}
            <div class="max-h-96 overflow-y-auto">
              <Show when={isSearching()}>
                <div class="py-12 text-center">
                  <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500" />
                  <p class="mt-2 text-sm text-gray-500">Searching...</p>
                </div>
              </Show>

              <Show when={!isSearching() && searchTerm().trim() && searchResults().length === 0}>
                <div class="py-12 text-center">
                  <svg
                    class="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p class="mt-2 text-sm text-gray-500">No results found for "{searchTerm()}"</p>
                </div>
              </Show>

              <ul class="divide-y divide-gray-200">
                <For each={searchResults()}>
                  {(patient, index) => (
                    <li>
                      <div
                        class={`block hover:bg-gray-50 cursor-pointer ${index() === selectedIndex() ? 'bg-indigo-50' : ''}`}
                        onClick={() => navigateToPatient(patient.id)}
                      >
                        <div class="px-6 py-4 flex items-center">
                          <div class="min-w-0 flex-1 flex items-center">
                            <div class="flex-shrink-0">
                              <div class="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                                {patient.firstName?.[0]?.toUpperCase() || ''}
                                {patient.lastName?.[0]?.toUpperCase() || ''}
                              </div>
                            </div>
                            <div class="min-w-0 flex-1 px-4">
                              <div>
                                <p
                                  class={`text-sm font-medium ${index() === selectedIndex() ? 'text-indigo-700' : 'text-indigo-600'} truncate`}
                                >
                                  {patient.firstName} {patient.lastName}
                                </p>
                                <p class="mt-1 flex items-center text-sm text-gray-500">
                                  <span class="truncate">{patient.email}</span>
                                </p>
                              </div>
                            </div>
                            <div>
                              <p class="text-sm text-gray-500">{patient.phone}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  )}
                </For>
              </ul>
            </div>
          </div>
        </div>
      </Show>
    </div>
  )
}
