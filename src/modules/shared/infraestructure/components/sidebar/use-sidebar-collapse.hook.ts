import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'etts-sidebar-collapsed'

export function useSidebarCollapse() {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(STORAGE_KEY) === '1')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0')
  }, [collapsed])

  const toggle = useCallback(() => setCollapsed((c) => !c), [])

  return { collapsed, toggle }
}
