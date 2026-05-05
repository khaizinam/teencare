'use client'

import { useState, useEffect } from 'react'

interface ParentData {
  id: string;
  name: string;
  phone: string;
  email: string;
  students?: any[];
}

export default function ParentsPage() {
  const [parents, setParents] = useState<ParentData[]>([])
  const [loading, setLoading] = useState(false)

  const fetchParents = async () => {
    try {
      const res = await fetch('/api/parents')
      if (res.ok) {
        const data = await res.json()
        setParents(data)
      }
    } catch {
      console.error('Failed to fetch parents')
    }
  }

  useEffect(() => {
    fetchParents()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      if (res.ok) {
        alert('Parent created!')
        fetchParents()
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
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-indigo-900">Parents Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-indigo-50 h-fit">
          <h2 className="text-xl font-bold text-indigo-900 mb-4">Create Parent</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input name="name" required className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm text-gray-900 bg-white focus:ring-indigo-500 focus:border-indigo-500" />
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

        {/* Directory */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-indigo-50">
          <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center justify-between">
            <span>Parents Directory</span>
            <span className="text-sm bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full">{parents.length} Total</span>
          </h2>
          <div className="overflow-y-auto max-h-[600px] space-y-3">
            {parents.map(p => (
              <div key={p.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center hover:shadow-sm transition-all">
                <div>
                  <p className="font-bold text-gray-800 text-lg">{p.name}</p>
                  <p className="text-sm text-gray-500">{p.phone} • {p.email}</p>
                </div>
                <div className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md">
                  {p.students?.length || 0} Kids
                </div>
              </div>
            ))}
            {parents.length === 0 && <p className="text-gray-400 italic">No parents found.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
