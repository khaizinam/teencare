'use client'

import { useState, useEffect } from 'react'

interface StudentData {
  id: string;
  name: string;
  dob: string;
  gender: string;
  currentGrade: number;
  parent?: { name: string; phone: string };
  subscriptions?: any[];
  registrations?: any[];
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
  
  // Enroll Form State
  const [classId, setClassId] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  
  // Subscription Form State
  const [subPackage, setSubPackage] = useState('')
  const [subSessions, setSubSessions] = useState(10)
  const [subEndDate, setSubEndDate] = useState('')
  
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

  // Create Student
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

  // Enroll in Class
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
        fetchData()
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

  // Add Subscription
  const handleAddSubscription = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStudent) return
    setLoading(true)

    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          packageName: subPackage,
          totalSessions: subSessions,
          endDate: subEndDate
        })
      })
      if (res.ok) {
        alert('Subscription added!')
        fetchData()
        setSubPackage('')
        setSubEndDate('')
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

  // Cancel Registration
  const handleCancelRegistration = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this class?')) return
    setLoading(true)
    try {
      const res = await fetch(`/api/registrations/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (res.ok) {
        alert(data.refunded ? 'Cancelled & 1 session refunded.' : 'Cancelled (no refund as < 24h).')
        fetchData()
      } else {
        alert('Error: ' + data.error)
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

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
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
              <select name="parentId" required className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm text-gray-900 bg-white" defaultValue="">
                <option value="" disabled>-- Choose a parent --</option>
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
        <div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-indigo-50">
          <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center justify-between">
            <span>Students Directory</span>
            <span className="text-sm bg-blue-100 text-blue-800 py-1 px-3 rounded-full">{students.length} Total</span>
          </h2>
          <div className="overflow-y-auto max-h-[800px] space-y-4">
            {students.map(s => {
              const isSelected = selectedStudent?.id === s.id;
              
              // Get active subscription
              const activeSub = s.subscriptions?.find(sub => {
                const endDate = new Date(sub.endDate);
                endDate.setHours(23, 59, 59, 999);
                return endDate >= new Date() && sub.usedSessions < sub.totalSessions;
              })

              return (
                <div key={s.id} className={`p-4 rounded-lg border flex flex-col justify-between transition-all ${isSelected ? 'bg-indigo-50 border-indigo-300 shadow-md' : 'bg-gray-50 border-gray-200 hover:shadow-sm'}`}>
                  
                  {/* Card Header */}
                  <div 
                    className="flex justify-between items-start mb-2 cursor-pointer group" 
                    onClick={() => setSelectedStudent(isSelected ? null : s)}
                  >
                    <div>
                      <p className="font-bold text-gray-800 text-xl group-hover:text-indigo-600 transition-colors">
                        {s.name} 
                        {!isSelected && <span className="text-xs text-indigo-500 font-normal ml-2 opacity-0 group-hover:opacity-100">Click for options</span>}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs uppercase font-bold text-gray-600 bg-gray-200 px-2 py-0.5 rounded">{s.gender}</span>
                        <span className="text-xs text-gray-500">Grade {s.currentGrade}</span>
                        {activeSub ? (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">
                            Active Pack ({activeSub.usedSessions}/{activeSub.totalSessions})
                          </span>
                        ) : (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-bold">No Active Pack</span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                      Parent: {s.parent?.name || 'Unknown'}
                    </p>
                  </div>

                  {/* Expanded Content */}
                  {isSelected && (
                    <div className="mt-4 pt-4 border-t border-indigo-200 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2">
                      
                      {/* Left Col: Actions */}
                      <div className="space-y-6">
                        
                        {/* Add Subscription Form */}
                        <form onSubmit={handleAddSubscription} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                          <h4 className="font-bold text-gray-800 text-sm mb-3">Add Subscription Pack</h4>
                          <div className="space-y-2">
                            <input placeholder="Pack Name (e.g. Summer Pack)" value={subPackage} onChange={e=>setSubPackage(e.target.value)} required className="w-full border border-gray-300 rounded p-2 text-sm bg-white text-gray-900" />
                            <div className="flex gap-2">
                              <input type="number" placeholder="Sessions" value={subSessions} onChange={e=>setSubSessions(Number(e.target.value))} required className="w-1/3 border border-gray-300 rounded p-2 text-sm bg-white text-gray-900" />
                              <input type="date" value={subEndDate} onChange={e=>setSubEndDate(e.target.value)} required className="w-2/3 border border-gray-300 rounded p-2 text-sm bg-white text-gray-900" />
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-green-600 text-white font-bold py-1.5 rounded text-sm hover:bg-green-700 disabled:opacity-50">
                              Buy Package
                            </button>
                          </div>
                        </form>

                        {/* Enroll Form */}
                        <form onSubmit={handleEnroll} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                          <h4 className="font-bold text-gray-800 text-sm mb-3">Enroll in Class</h4>
                          <div className="space-y-2">
                            <select value={classId} onChange={e => setClassId(e.target.value)} required className="w-full border border-gray-300 rounded p-2 text-sm bg-white text-gray-900">
                              <option value="" disabled>-- Select Class --</option>
                              {classes.map(c => (
                                <option key={c.id} value={c.id}>{c.name} ({c.subject})</option>
                              ))}
                            </select>
                            <input type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} min={new Date().toISOString().split('T')[0]} required className="w-full border border-gray-300 rounded p-2 text-sm bg-white text-gray-900" />
                            <button type="submit" disabled={loading || !activeSub} className="w-full bg-indigo-600 text-white font-bold py-1.5 rounded text-sm hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                              Confirm Enrollment
                            </button>
                            {!activeSub && <p className="text-xs text-red-500 text-center mt-1">Requires an active package.</p>}
                          </div>
                        </form>

                      </div>

                      {/* Right Col: Registration History */}
                      <div className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
                        <h4 className="font-bold text-gray-800 text-sm mb-3">Registration History</h4>
                        <div className="space-y-2 overflow-y-auto max-h-[350px] pr-1">
                          {s.registrations?.map(reg => {
                            const isPast = new Date(reg.scheduledDate) < new Date()
                            return (
                              <div key={reg.id} className={`p-2 rounded border text-sm flex flex-col ${isPast ? 'bg-gray-100 border-gray-200' : 'bg-blue-50 border-blue-200'}`}>
                                <div className="flex justify-between items-start">
                                  <strong className="text-gray-900">{reg.class?.name}</strong>
                                  {!isPast && (
                                    <button 
                                      onClick={() => handleCancelRegistration(reg.id)}
                                      className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded hover:bg-red-200 font-bold"
                                    >
                                      Cancel
                                    </button>
                                  )}
                                </div>
                                <span className="text-xs text-gray-600 mt-1">
                                  {new Date(reg.scheduledDate).toLocaleDateString()} at {reg.class?.timeSlot}
                                </span>
                              </div>
                            )
                          })}
                          {(!s.registrations || s.registrations.length === 0) && (
                            <p className="text-xs text-gray-400 italic text-center py-4">No classes registered.</p>
                          )}
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              )
            })}
            {students.length === 0 && <p className="text-gray-400 italic">No students found.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
