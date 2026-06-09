import { type JSX } from 'react'
import { Outlet } from 'react-router'
import { Sidebar } from '../components/sidebar'
import { Topbar } from '../components/topbar'

export function DashboardLayout(): JSX.Element {
  return (
    <div className="flex min-h-screen gap-2.5 bg-bg-app p-2.5">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <Topbar />
        <main className="px-6 pt-5 pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
