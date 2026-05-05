'use client'

import { useState, useEffect } from 'react'

interface Parent {
  id: string;
  name: string;
  phone: string;
  email: string;
  students?: Student[];
}

interface Student {
  id: string;
  name: string;
  dob: string;
  gender: string;
  currentGrade: number;
  parent?: Parent;
}

export default function UserList() {
  const [parents, setParents] = useState<Parent[]>([])
  const [students, setStudents] = useState<Student[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/parents').then(r => r.json()),
      fetch('/api/students').then(r => r.json())
    ]).then(([pData, sData]) => {
      if (Array.isArray(pData)) setParents(pData)
      if (Array.isArray(sData)) setStudents(sData)
    }).catch(console.error)
  }, [])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl mx-auto p-4 mb-8">
      {/* Parents List */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-indigo-50">
        <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center justify-between">
          <span>Parents Directory</span>
          <span className="text-sm bg-indigo-100 text-indigo-800 py-1 px-3 rounded-full">{parents.length} Total</span>
        </h2>
        <div className="max-h-64 overflow-y-auto pr-2 space-y-3">
          {parents.map(p => (
            <div key={p.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-800">{p.name}</p>
                <p className="text-xs text-gray-500">{p.phone} • {p.email}</p>
              </div>
              <div className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                {p.students?.length || 0} Kids
              </div>
            </div>
          ))}
          {parents.length === 0 && <p className="text-gray-400 text-sm italic">No parents found.</p>}
        </div>
      </div>

      {/* Students List */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-indigo-50">
        <h2 className="text-xl font-bold text-indigo-900 mb-4 flex items-center justify-between">
          <span>Students Directory</span>
          <span className="text-sm bg-blue-100 text-blue-800 py-1 px-3 rounded-full">{students.length} Total</span>
        </h2>
        <div className="max-h-64 overflow-y-auto pr-2 space-y-3">
          {students.map(s => (
            <div key={s.id} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <p className="font-bold text-gray-800">{s.name}</p>
                <span className="text-[10px] uppercase font-bold text-gray-500 bg-gray-200 px-2 py-0.5 rounded">{s.gender}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Grade {s.currentGrade} • Born: {new Date(s.dob).toLocaleDateString()}</p>
              <p className="text-xs text-indigo-600 mt-1 pt-1 border-t border-gray-200">Parent: {s.parent?.name || 'Unknown'}</p>
            </div>
          ))}
          {students.length === 0 && <p className="text-gray-400 text-sm italic">No students found.</p>}
        </div>
      </div>
    </div>
  )
}
