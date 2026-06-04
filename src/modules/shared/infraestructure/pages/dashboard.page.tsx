import { useState } from 'react'
import { Sidebar } from '../components/sidebar'
import { Topbar } from '../components/topbar'
import { Panel } from '../components/panel'

export default function DashboardPage() {
  const [active, setActive] = useState('dashboard')

  return (
    <div className="flex min-h-screen gap-2.5 bg-[#f7f3ec] p-2.5">
      <Sidebar activeId={active} onSelect={setActive} />
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <Topbar activeId={active} onNavigate={setActive} />
        <main className="px-6 pt-5 pb-8">
          <Panel />
        </main>
      </div>
    </div>
  )
}
