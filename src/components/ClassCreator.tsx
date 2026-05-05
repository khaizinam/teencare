'use client'

import { useState } from 'react'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function ClassCreator() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        alert('Class created!')
        window.location.reload()
        e.currentTarget.reset()
      } else {
        const err = await res.json()
        alert('Error: ' + err.error)
      }
    } catch {
      alert('Failed to connect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mb-8 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Class</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase">Class Name</label>
          <input name="name" required className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm shadow-sm text-gray-900 bg-white" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase">Subject</label>
          <input name="subject" required className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm shadow-sm text-gray-900 bg-white" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase">Day</label>
          <select name="dayOfWeek" required className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm shadow-sm text-gray-900 bg-white">
            {DAYS.map((day, i) => <option key={day} value={i}>{day}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase">Slot (e.g. 08:00-10:00)</label>
          <input name="timeSlot" placeholder="08:00-10:00" required className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm shadow-sm text-gray-900 bg-white" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase">Teacher</label>
          <input name="teacherName" required className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm shadow-sm text-gray-900 bg-white" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase">Max Seats</label>
          <input name="maxStudents" type="number" defaultValue={20} required className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-sm shadow-sm text-gray-900 bg-white" />
        </div>
        <button type="submit" disabled={loading} className="lg:col-span-6 bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400">
          {loading ? 'Creating...' : 'Create Class'}
        </button>
      </form>
    </div>
  )
}
