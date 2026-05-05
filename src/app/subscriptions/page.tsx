'use client'

import { useState, useEffect } from 'react'

interface Subscription {
  id: string;
  packageName: string;
  totalSessions: number;
  usedSessions: number;
  endDate: string;
  student: {
    name: string;
  };
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)

  const fetchSubscriptions = async () => {
    try {
      const res = await fetch('/api/subscriptions')
      if (res.ok) {
        setSubscriptions(await res.json())
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const handleUseSession = async (id: string) => {
    try {
      const res = await fetch(`/api/subscriptions/${id}/use`, {
        method: 'PATCH',
      })
      if (res.ok) {
        fetchSubscriptions()
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to use session')
      }
    } catch (error) {
      alert('Failed to connect to API')
    }
  }

  if (loading) {
    return <div className="p-8">Loading subscriptions...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-extrabold text-indigo-900 mb-8">Subscriptions Management</h1>

      <div className="bg-white rounded-2xl shadow-md border border-indigo-50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-indigo-50 text-indigo-900 uppercase text-sm font-bold">
              <th className="p-4">Student</th>
              <th className="p-4">Package</th>
              <th className="p-4">Progress</th>
              <th className="p-4">End Date</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subscriptions.map((sub) => {
              const isExpired = new Date(sub.endDate) < new Date(new Date().setHours(0,0,0,0))
              const isFull = sub.usedSessions >= sub.totalSessions
              const isActive = !isExpired && !isFull

              return (
                <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-800">{sub.student.name}</td>
                  <td className="p-4 text-gray-600">{sub.packageName}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 min-w-[100px]">
                        <div 
                          className={`h-2 rounded-full ${isFull ? 'bg-red-500' : 'bg-indigo-600'}`}
                          style={{ width: `${(sub.usedSessions / sub.totalSessions) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-700">
                        {sub.usedSessions}/{sub.totalSessions}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-sm font-medium ${isExpired ? 'text-red-600' : 'text-gray-600'}`}>
                      {new Date(sub.endDate).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleUseSession(sub.id)}
                      disabled={!isActive}
                      className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                        isActive 
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm' 
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isFull ? 'Completed' : isExpired ? 'Expired' : 'Mark Session Used'}
                    </button>
                  </td>
                </tr>
              )
            })}
            {subscriptions.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400 italic">
                  No subscriptions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
