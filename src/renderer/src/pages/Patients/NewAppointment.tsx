import BackButton from '@renderer/components/BackButton'
import { createSignal, createResource, For, JSX } from 'solid-js'

function NewAppointment(): JSX.Element {
  // In a real app, you would fetch these from your database
  const fetchPatients = async (): Promise<
    { id: string; firstName: string; lastName: string }[]
  > => {
    // Mock data for example
    return [
      { id: '1', firstName: 'John', lastName: 'Doe' },
      { id: '2', firstName: 'Jane', lastName: 'Smith' }
    ]
  }

  const [patients] = createResource(fetchPatients)

  const handleCreateAppointment = (appointment): void => {
    // In a real app, you would save to a database
    console.log('Appointment created:', appointment)
    // Redirect or show confirmation
  }

  return (
    <div class="max-w-4xl mx-auto">
      {/* TODO: make better layout for Backbutton */}
      <BackButton to="/" label="Back to Dashboard" />
      <h2 class="text-2xl font-bold my-6"> New Appointment</h2>
      <AppointmentForm patients={patients()} onSubmit={handleCreateAppointment} />
    </div>
  )
}

export default NewAppointment

// components/AppointmentForm.jsx

function AppointmentForm(props): JSX.Element {
  const [form, setForm] = createSignal({
    patientId: '',
    date: '',
    time: '',
    duration: '30',
    type: '',
    notes: ''
  })

  const handleSubmit = (e): void => {
    e.preventDefault()
    props.onSubmit({
      ...form(),
      id: Date.now().toString() // Simple ID generation
    })

    // Reset form
    setForm({
      patientId: '',
      date: '',
      time: '',
      duration: '30',
      type: '',
      notes: ''
    })
  }

  // WARN:
  const handleChange =
    (field) =>
      (e): void => {
        setForm({
          ...form(),
          [field]: e.target.value
        })
      }

  return (
    <form onSubmit={handleSubmit} class="bg-white shadow-md rounded p-6">
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block mb-1">Patient</label>
          <select
            value={form().patientId}
            onInput={handleChange('patientId')}
            required
            class="w-full p-2 border rounded"
          >
            <option value="">Select Patient</option>
            {
              <For each={props.patients}>
                {(patient) => (
                  <option value={patient.id}>
                    {patient.firstName} {patient.lastName}
                  </option>
                )}
              </For>
            }
          </select>
        </div>

        <div>
          <label class="block mb-1">Type</label>
          <select
            value={form().type}
            onInput={handleChange('type')}
            required
            class="w-full p-2 border rounded"
          >
            <option value="">Select Type</option>
            <option value="check-up">Regular Check-up</option>
            <option value="cleaning">Cleaning</option>
            <option value="filling">Filling</option>
            <option value="root-canal">Root Canal</option>
            <option value="extraction">Extraction</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label class="block mb-1">Date</label>
          <input
            type="date"
            value={form().date}
            onInput={handleChange('date')}
            required
            class="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label class="block mb-1">Time</label>
          <input
            type="time"
            value={form().time}
            onInput={handleChange('time')}
            required
            class="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label class="block mb-1">Duration (minutes)</label>
          <select
            value={form().duration}
            onInput={handleChange('duration')}
            required
            class="w-full p-2 border rounded"
          >
            <option value="15">15 min</option>
            <option value="30">30 min</option>
            <option value="45">45 min</option>
            <option value="60">60 min</option>
            <option value="90">90 min</option>
            <option value="120">120 min</option>
          </select>
        </div>
      </div>

      <div class="mt-4">
        <label class="block mb-1">Notes</label>
        <textarea
          value={form().notes}
          onInput={handleChange('notes')}
          class="w-full p-2 border rounded"
          rows="3"
        />
      </div>

      <div class="mt-6">
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Schedule Appointment
        </button>
      </div>
    </form>
  )
}
