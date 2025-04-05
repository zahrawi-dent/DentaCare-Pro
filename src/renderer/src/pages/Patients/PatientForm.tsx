import { createMemo, createSignal, JSX } from 'solid-js'

export default function PatientForm(
  props
  //                      : {
  //   // onSubmit: (patient: Patient) => void
  //   patient?: Patient
  // }
): JSX.Element {
  const initialData = props.patient || {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    email: '',
    address: '',
    medicalHistory: '',
    insuranceProvider: '',
    allergies: '',
    notes: ''
  }

  const [form, setForm] = createSignal({ ...initialData })
  const isEditMode = createMemo(() => !!props.patient)

  const handleSubmit = (e): void => {
    e.preventDefault()
    const formData = form()

    // If in edit mode, use the existing ID, otherwise generate a new one
    const patientData = isEditMode() ? formData : { ...formData, id: Date.now().toString() }

    props.onSubmit(patientData)
  }

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
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block mb-1">First Name</label>
          <input
            type="text"
            value={form().firstName}
            onInput={handleChange('firstName')}
            required
            class="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label class="block mb-1">Last Name</label>
          <input
            type="text"
            value={form().lastName}
            onInput={handleChange('lastName')}
            required
            class="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label class="block mb-1">Date of Birth</label>
          <input
            type="date"
            value={form().dateOfBirth}
            onInput={handleChange('dateOfBirth')}
            required
            class="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label class="block mb-1">Gender</label>
          <select
            value={form().gender}
            onInput={handleChange('gender')}
            required
            class="w-full p-2 border rounded"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label class="block mb-1">Phone</label>
          <input
            type="tel"
            value={form().phone}
            onInput={handleChange('phone')}
            required
            class="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label class="block mb-1">Email</label>
          <input
            type="email"
            value={form().email}
            onInput={handleChange('email')}
            class="w-full p-2 border rounded"
          />
        </div>
      </div>

      <div class="mt-4">
        <label class="block mb-1">Address</label>
        <textarea
          value={form().address}
          onInput={handleChange('address')}
          class="w-full p-2 border rounded"
          rows="2"
        />
      </div>

      <div class="mt-4">
        <label class="block mb-1">Medical History</label>
        <textarea
          value={form().medicalHistory}
          onInput={handleChange('medicalHistory')}
          class="w-full p-2 border rounded"
          rows="3"
        />
      </div>

      <div class="mt-4">
        <label class="block mb-1">Insurance Provider</label>
        <input
          type="text"
          value={form().insuranceProvider}
          onInput={handleChange('insuranceProvider')}
          class="w-full p-2 border rounded"
        />
      </div>

      <div class="mt-4">
        <label class="block mb-1">Allergies</label>
        <textarea
          value={form().allergies}
          onInput={handleChange('allergies')}
          class="w-full p-2 border rounded"
          rows="2"
        />
      </div>

      <div class="mt-4">
        <label class="block mb-1">Notes</label>
        <textarea
          value={form().notes}
          onInput={handleChange('notes')}
          class="w-full p-2 border rounded"
          rows="2"
        />
      </div>

      <div class="mt-6">
        <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {isEditMode() ? 'Update Patient' : 'Register Patient'}
        </button>
      </div>
    </form>
  )
}
