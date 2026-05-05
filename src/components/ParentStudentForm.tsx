'use client'

import { useState } from 'react'

export default function ParentStudentForm() {
  const [parentId, setParentId] = useState('')
  const [loading, setLoading] = useState(false)

  const handleParentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const res = await fetch('/api/parents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (res.ok) {
        alert('Parent created! ID: ' + result.id)
        setParentId(result.id)
      } else {
        alert('Error: ' + result.error)
      }
    } catch {
      alert('Failed to connect')
    } finally {
      setLoading(false)
    }
  }

  const handleStudentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (res.ok) {
        alert('Student created! ID: ' + result.id)
      } else {
        alert('Error: ' + result.error)
      }
    } catch {
      alert('Failed to connect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl mx-auto p-4">
      {/* Parent Form */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-indigo-50">
        <h2 className="text-xl font-bold text-indigo-900 mb-4">Create Parent</h2>
        <form onSubmit={handleParentSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input name="name" required className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input name="phone" required className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm text-gray-900 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input name="email" type="email" required className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm text-gray-900 bg-white" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400">
            {loading ? 'Creating...' : 'Create Parent'}
          </button>
        </form>
      </div>

      {/* Student Form */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-indigo-50">
        <h2 className="text-xl font-bold text-indigo-900 mb-4">Create Student</h2>
        <form onSubmit={handleStudentSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input name="name" required className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm text-gray-900 bg-white" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">DOB</label>
              <input name="dob" type="date" required className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm text-gray-900 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select name="gender" required className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm text-gray-900 bg-white">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Grade</label>
            <input name="currentGrade" type="number" required className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm text-gray-900 bg-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Parent ID</label>
            <input name="parentId" defaultValue={parentId} required className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm text-gray-900 bg-white" placeholder="Paste Parent ID here" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
            {loading ? 'Creating...' : 'Create Student'}
          </button>
        </form>
      </div>
    </div>
  )
}
