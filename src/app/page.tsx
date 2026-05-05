import Link from 'next/link'
import WeeklySchedule from '@/components/WeeklySchedule'

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[80vh] p-8">
      <div className="w-full max-w-4xl text-center space-y-6">
        <h1 className="text-5xl font-extrabold text-indigo-900 mb-4">Welcome to TeenUp LMS</h1>
        <p className="text-xl text-indigo-600 font-medium">
          Manage your students, parents, and weekly classes from the sidebar.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <Link href="/parents" className="bg-white p-8 rounded-2xl shadow-sm border border-indigo-100 hover:shadow-lg hover:border-indigo-300 transition-all flex flex-col items-center">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4">P</div>
            <h2 className="text-xl font-bold text-gray-800">Parents</h2>
            <p className="text-gray-500 mt-2 text-sm text-center">Manage parent profiles and contact information.</p>
          </Link>

          <Link href="/students" className="bg-white p-8 rounded-2xl shadow-sm border border-blue-100 hover:shadow-lg hover:border-blue-300 transition-all flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4">S</div>
            <h2 className="text-xl font-bold text-gray-800">Students</h2>
            <p className="text-gray-500 mt-2 text-sm text-center">Enroll students and link them to their parents.</p>
          </Link>

          <Link href="/classes" className="bg-white p-8 rounded-2xl shadow-sm border border-purple-100 hover:shadow-lg hover:border-purple-300 transition-all flex flex-col items-center">
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4">C</div>
            <h2 className="text-xl font-bold text-gray-800">Classes</h2>
            <p className="text-gray-500 mt-2 text-sm text-center">Create classes, view weekly schedules and manage seats.</p>
          </Link>
        </div>
      </div>
      
      <div className="w-full max-w-6xl mt-12">
        <WeeklySchedule />
      </div>
    </main>
  )
}
