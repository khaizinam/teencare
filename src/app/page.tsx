import ParentStudentForm from '@/components/ParentStudentForm'
import WeeklySchedule from '@/components/WeeklySchedule'
import ClassCreator from '@/components/ClassCreator'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <div className="w-full max-w-6xl mb-12">
        <h1 className="text-4xl font-extrabold text-indigo-900 mb-2 text-center">TeenUp Mini LMS</h1>
        <p className="text-indigo-600 font-medium text-center">Product Builder Test - Implementation Dashboard</p>
      </div>

      <div className="space-y-12 w-full max-w-7xl mx-auto">
        <section id="onboarding">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
            <h2 className="text-2xl font-bold text-gray-800">Onboarding</h2>
          </div>
          <ParentStudentForm />
        </section>

        <section id="schedule">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
            <h2 className="text-2xl font-bold text-gray-800">Class Management</h2>
          </div>
          <ClassCreator />
          <WeeklySchedule />
        </section>

        <section id="docs" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-6xl mx-auto w-full">
          <h2 className="text-xl font-bold text-indigo-900 mb-4">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
              <h3 className="font-bold text-gray-700">Database</h3>
              <p className="text-gray-600">PostgreSQL with Prisma. Validations for overlaps and sessions handled in transactions.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-gray-700">API Layer</h3>
              <p className="text-gray-600">RESTful Next.js Route Handlers with structured error handling and JSON responses.</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-gray-700">CI/CD</h3>
              <p className="text-gray-600">Dockerized environment. Run <code>docker-compose up</code> to spin up DB and Web app.</p>
            </div>
          </div>
        </section>
      </div>
      
      <footer className="mt-20 py-8 border-t border-gray-200 w-full max-w-6xl text-center text-gray-400 text-sm">
        TeenUp Product Builder Test © 2026
      </footer>
    </main>
  )
}
