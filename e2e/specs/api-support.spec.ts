import { expect, test } from '@playwright/test'
import { ApiClient } from '../support/api'
import { UniqueName } from '../support/unique-name'

test('@fase-0 los helpers de API crean entidades con nombres únicos por corrida', async () => {
  const api = await ApiClient.login()
  const runId = UniqueName.runId()

  try {
    const brand = await api.createBrand()
    const productModel = await api.createProductModel(brand.id)
    const product = await api.createProduct({
      brandId: brand.id,
      productModelId: productModel.id,
    })
    const role = await api.firstRole()
    const employee = await api.createEmployee({ roleId: role.id })

    expect(brand.name).toContain(runId)
    expect(productModel.name).toContain(runId)
    expect(product.name).toContain(runId)
    expect(employee.name).toContain(runId)
    expect(employee.identifier).toMatch(/^ETT-\d+$/)
  } finally {
    await api.dispose()
  }
})
