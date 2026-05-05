'use client'

import { useState, useEffect, useCallback } from 'react'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

interface ClassData {
  id: string;
  name: string;
  subject: string;
  dayOfWeek: number;
  timeSlot: string;
  teacherName: string;
  maxStudents: number;
  _count: { registrations: number };
}

export default function WeeklySchedule() {
  const [classes, setClasses] = useState<ClassData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [studentId, setStudentId] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')

  const fetchClasses = useCallback(async (mounted = true) => {
    try {
      const res = await fetch('/api/classes')
      const data = await res.json()
      if (mounted) {
        setClasses(data)
        setLoading(false)
      }
    } catch {
      if (mounted) setLoading(false)
    }
  }, [])

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      await fetchClasses(mounted)
    }
    init()
    return () => { mounted = false }
  }, [fetchClasses])

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClass) return

    try {
      const res = await fetch(`/api/classes/${selectedClass}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, scheduledDate }),
      })
      const result = await res.json()
      if (res.ok) {
        alert('Registration successful!')
        fetchClasses()
        setSelectedClass(null)
      } else {
        alert('Error: ' + result.error)
      }
    } catch {
      alert('Failed to register')
    }
  }

  if (loading) return <div>Loading schedule...</div>

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-indigo-900 mb-6">Weekly Class Schedule</h2>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {DAYS.map((day, index) => (
          <div key={day} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 min-h-[300px]">
            <h3 className="font-bold text-indigo-700 border-b pb-2 mb-3">{day}</h3>
            <div className="space-y-3">
              {classes.filter(c => c.dayOfWeek === index).map(c => (
                <div 
                  key={c.id} 
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedClass === c.id ? 'border-indigo-500 bg-indigo-50 shadow-inner' : 'border-gray-200 hover:border-indigo-300 bg-gray-50'}`}
                  onClick={() => setSelectedClass(c.id)}
                >
                  <div className="text-sm font-bold text-gray-800">{c.name}</div>
                  <div className="text-xs text-indigo-600">{c.timeSlot}</div>
                  <div className="text-[10px] text-gray-500 mt-1">Teacher: {c.teacherName}</div>
                  <div className="text-[10px] font-semibold mt-1">
                    Seats: {c._count.registrations}/{c.maxStudents}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedClass && (
        <div className="mt-8 bg-indigo-900 text-white p-6 rounded-2xl shadow-xl animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-xl font-bold mb-4">Register for {classes.find(c => c.id === selectedClass)?.name}</h3>
          <form onSubmit={handleRegister} className="flex flex-col md:flex-row gap-4">
            <input 
              placeholder="Student ID" 
              value={studentId} 
              onChange={e => setStudentId(e.target.value)} 
              required 
              className="bg-white/10 border border-white/20 rounded-md p-2 flex-1 text-white placeholder-white/50" 
            />
            <input 
              type="date" 
              value={scheduledDate} 
              onChange={e => setScheduledDate(e.target.value)} 
              required 
              className="bg-white/10 border border-white/20 rounded-md p-2 text-white" 
            />
            <button type="submit" className="bg-white text-indigo-900 font-bold py-2 px-6 rounded-md hover:bg-indigo-100 transition-colors">
              Confirm Registration
            </button>
            <button type="button" onClick={() => setSelectedClass(null)} className="text-white/70 hover:text-white underline text-sm">
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
