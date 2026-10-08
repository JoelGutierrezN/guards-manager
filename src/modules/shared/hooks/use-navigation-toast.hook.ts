import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { NavigationToastHelper } from '../application/navigation-toast.helper'
import type { ToastTone } from '../infraestructure/components/ui'

/** Muestra una sola vez el mensaje que dejó la pantalla anterior en el estado de navegación
 *  y lo borra del historial para que no reaparezca al volver atrás. */
export function useNavigationToast(addToast: (message: string, tone?: ToastTone) => void): void {
  const location = useLocation()
  const navigate = useNavigate()
  const message = NavigationToastHelper.messageFrom(location.state)
  const shownRef = useRef(false)

  useEffect(() => {
    if (message === null || shownRef.current) return
    shownRef.current = true
    addToast(message, 'success')
    void navigate(`${location.pathname}${location.search}`, { replace: true, state: null })
  }, [message, addToast, navigate, location.pathname, location.search])
}
