import { type JSX, useState } from 'react'
import { Sidebar } from '../components/sidebar'
import { Topbar } from '../components/topbar'
import { Panel } from '../components/panel'
import { BrandsScreen } from '../../../brands/infraestructure'
import { ModelsPage } from '../../../models/infraestructure'

export default function DashboardPage(): JSX.Element {
  const [active, setActive] = useState('dashboard')

  return (
    <div className="flex min-h-screen gap-2.5 bg-[#f7f3ec] p-2.5">
      <Sidebar activeId={active} onSelect={setActive} />
      <div className="flex min-w-0 flex-1 flex-col gap-2.5">
        <Topbar activeId={active} onNavigate={setActive} />
        <main className="px-6 pt-5 pb-8">
          {renderScreen(active, setActive)}
        </main>
      </div>
    </div>
  )
}

function renderScreen(active: string, navigate: (id: string) => void): JSX.Element {
  switch (active) {
    case 'brands':
      return <BrandsScreen onNavigate={navigate} />
    case 'models':
      return <ModelsPage />
    default:
      return <Panel />
  }
}
