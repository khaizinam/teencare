'use client'

import { useState, useEffect } from 'react'

interface StudentData {
  id: string;
  name: string;
  dob: string;
  gender: string;
  currentGrade: number;
  parent?: { name: string; phone: string };
}

interface ParentData {
  id: string;
  name: string;
  phone: string;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentData[]>([])
  const [parents, setParents] = useState<ParentData[]>([])
  const [classes, setClasses] = useState<any[]>([])
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null)
  const [classId, setClassId] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    try {
      const [sRes, pRes, cRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/parents'),
        fetch('/api/classes')
      ])
      if (sRes.ok) setStudents(await sRes.json())
      if (pRes.ok) setParents(await pRes.json())
      if (cRes.ok) setClasses(await cRes.json())
    } catch {
      console.error('Failed to fetch data')
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      if (res.ok) {
        alert('Student created!')
        fetchData()
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

  const handleEnroll = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedStudent || !classId) return
    setLoading(true)

    try {
      const res = await fetch(`/api/classes/${classId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: selectedStudent.id, scheduledDate }),
      })
      if (res.ok) {
        alert('Enrolled successfully!')
        setSelectedStudent(null)
        setClassId('')
        setScheduledDate('')
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
        <h1 className="text-3xl font-extrabold text-indigo-900">Students Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="bg-white p-6 rounded-2xl shadow-md border border-indigo-50 h-fit">
          <h2 className="text-xl font-bold text-indigo-900 mb-4">Create Student</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="block text-sm font-medium text-gray-700">Select Parent</label>
              <select name="parentId" required className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm text-gray-900 bg-white">
                <option value="" disabled selected>-- Choose a parent --</option>
                {parents.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.phone})</option>
                ))}
              </select>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400">
              {loading ? 'Creating...' : 'Create Student'}
            </button>
          </form>
        </div>

        {/* Directory */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-indigo-50">
          <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center justify-between">
            <span>Students Directory</span>
            <span className="text-sm bg-blue-100 text-blue-800 py-1 px-3 rounded-full">{students.length} Total</span>
          </h2>
          <div className="overflow-y-auto max-h-[700px] space-y-3">
            {students.map(s => (
              <div key={s.id} className={`p-4 rounded-lg border flex flex-col justify-between transition-all ${selectedStudent?.id === s.id ? 'bg-indigo-50 border-indigo-200 shadow-md' : 'bg-gray-50 border-gray-100 hover:shadow-sm'}`}>
                <div 
                  className="flex justify-between items-start mb-2 cursor-pointer group" 
                  onClick={() => setSelectedStudent(selectedStudent?.id === s.id ? null : s)}
                >
                  <p className="font-bold text-gray-800 text-lg group-hover:text-indigo-600 transition-colors">
                    {s.name} {selectedStudent?.id !== s.id && <span className="text-xs text-indigo-500 font-normal ml-2 opacity-0 group-hover:opacity-100">Click to enroll</span>}
                  </p>
                  <span className="text-xs uppercase font-bold text-gray-600 bg-gray-200 px-2 py-1 rounded">{s.gender}</span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-200 pt-2 mt-1">
                  <p className="text-sm text-gray-600">Grade {s.currentGrade} • Born: {new Date(s.dob).toLocaleDateString()}</p>
                  <p className="text-sm font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                    Parent: {s.parent?.name || 'Unknown'}
                  </p>
                </div>

                {selectedStudent?.id === s.id && (
                  <form onSubmit={handleEnroll} className="mt-4 p-4 bg-white border border-indigo-100 rounded-md shadow-inner flex flex-col gap-3 animate-in fade-in slide-in-from-top-2">
                    <h4 className="font-bold text-indigo-900 text-sm">Enroll {s.name} in Class</h4>
                    <select 
                      value={classId} 
                      onChange={e => setClassId(e.target.value)} 
                      required 
                      className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-900 bg-white"
                    >
                      <option value="" disabled>-- Select Class --</option>
                      {classes.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.subject})</option>
                      ))}
                    </select>
                    <input 
                      type="date" 
                      value={scheduledDate} 
                      onChange={e => setScheduledDate(e.target.value)} 
                      required 
                      className="w-full border border-gray-300 rounded-md p-2 text-sm text-gray-900 bg-white" 
                    />
                    <div className="flex gap-2 mt-1">
                      <button type="submit" disabled={loading} className="flex-1 bg-indigo-600 text-white font-bold py-2 px-3 rounded-md text-sm hover:bg-indigo-700 disabled:bg-gray-400">
                        {loading ? 'Processing...' : 'Confirm Enrollment'}
                      </button>
                      <button type="button" onClick={() => setSelectedStudent(null)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-2 px-3 rounded-md text-sm hover:bg-gray-200 border border-gray-200">
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ))}
            {students.length === 0 && <p className="text-gray-400 italic">No students found.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
