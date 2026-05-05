'use client'

import { useState, useEffect } from 'react'
import ClassCreator from '@/components/ClassCreator'

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

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassData[]>([])

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/classes')
      if (res.ok) setClasses(await res.json())
    } catch {
      console.error('Failed to fetch classes')
    }
  }

  useEffect(() => {
    fetchClasses()
  }, [])

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-indigo-900">Classes Management</h1>
      </div>
      
      <div className="space-y-8">
        <ClassCreator />
        
        <div className="bg-white p-6 rounded-2xl shadow-md border border-indigo-50 max-w-6xl mx-auto">
          <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center justify-between">
            <span>All Classes</span>
            <span className="text-sm bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full">{classes.length} Total</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-sm text-gray-500 uppercase tracking-wider">
                  <th className="p-3 font-medium">Class Name</th>
                  <th className="p-3 font-medium">Subject</th>
                  <th className="p-3 font-medium">Schedule</th>
                  <th className="p-3 font-medium">Teacher</th>
                  <th className="p-3 font-medium">Enrolled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {classes.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-bold text-gray-800">{c.name}</td>
                    <td className="p-3 text-gray-600">{c.subject}</td>
                    <td className="p-3">
                      <span className="font-semibold text-indigo-600">{DAYS[c.dayOfWeek]}</span>
                      <br />
                      <span className="text-xs text-gray-500">{c.timeSlot}</span>
                    </td>
                    <td className="p-3 text-gray-600">{c.teacherName}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2 max-w-[60px]">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full" 
                            style={{ width: `${(c._count.registrations / c.maxStudents) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-semibold text-gray-700">
                          {c._count.registrations}/{c.maxStudents}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
                {classes.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-400 italic">No classes found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
