import BackButton from '@renderer/components/BackButton'
import { JSX } from 'solid-js'

import { Patient } from '@shared/types'
import { useNavigate } from '@solidjs/router'
import PatientForm from './PatientForm'

// TODO: when submitting form, go to the patient details page
// check if patient already exists
export default function RegisterPatient(): JSX.Element {
  const navigate = useNavigate()
  // argument is Patient type without id, createdAt and updatedAt
  const handleRegister = async (patient: Patient, onError: (error: any) => void): void => {
    // window.dentalApi.createPatient(patient)
    // go to patient details
    try {
      // Your existing code to save to SQLite
      await window.dentalApi.createPatient(patient)
      // Handle success
    } catch (error) {
      // Pass the error back to the form for handling
      onError(error)
      return
    }

    navigate(`/patients/${patient.id}`)
  }

  return (
    // TODO: Make this components layout
    <div class="max-w-4xl mx-auto">
      {/* TODO: make better layout for Backbutton */}
      <BackButton to="/" label="Back to Dashboard" />
      <h2 class="text-2xl font-bold my-6">Register Patient</h2>
      <PatientForm onSubmit={handleRegister} />
    </div>
  )
}
