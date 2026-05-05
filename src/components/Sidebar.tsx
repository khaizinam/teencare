'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()
  
  const navs = [
    { name: 'Dashboard', path: '/' },
    { name: 'Parents', path: '/parents' },
    { name: 'Students', path: '/students' },
    { name: 'Classes', path: '/classes' },
  ]

  return (
    <div className="w-64 bg-indigo-900 text-white min-h-screen flex flex-col p-6 shadow-xl shrink-0">
      <h2 className="text-2xl font-bold mb-8 text-center border-b border-indigo-700 pb-4">TeenUp LMS</h2>
      <nav className="flex flex-col gap-2">
        {navs.map(nav => (
          <Link 
            key={nav.path} 
            href={nav.path}
            className={`p-3 rounded-lg font-medium transition-all ${pathname === nav.path ? 'bg-indigo-600 text-white shadow-md' : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'}`}
          >
            {nav.name}
          </Link>
        ))}
      </nav>
    </div>
  )
}
