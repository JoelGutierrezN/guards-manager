import { expect, test } from '@playwright/test'
import { E2eConfig } from '../support/config'

test.use({ storageState: { cookies: [], origins: [] } })

const DEMO_EMAIL = 'test@example.com'

test('@fase-6 solicitar el enlace de recuperación desde el login', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: '¿Olvidaste tu contraseña?' }).click()

  await expect(page).toHaveURL(`${E2eConfig.webBaseUrl}/forgot-password`)
  await expect(page.getByRole('heading', { name: 'Recuperar contraseña' })).toBeVisible()

  await page.getByLabel('Correo').fill(DEMO_EMAIL)
  await page.getByRole('button', { name: 'Enviar enlace' }).click()

  await expect(page.getByRole('heading', { name: 'Revisa tu correo' })).toBeVisible()

  await page.getByRole('link', { name: 'Volver a iniciar sesión' }).click()
  await expect(page).toHaveURL(`${E2eConfig.webBaseUrl}/`)
})
