import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { useParams } from 'react-router'
import { FileDownloadHelper } from '../../shared/infraestructure/helpers/file-download.helper'
import type { Employee } from '../domain/employee.entity'
import type { EmployeeFileTab } from '../domain/employee-file-tab.model'
import { employeeFileReducer } from '../application/employee-file.reducer'
import { INITIAL_EMPLOYEE_FILE_STATE } from '../application/employee-file-state.model'
import { EmployeeFilePresenter } from '../application/employee-file-presenter.helper'
import { EmployeeFileSelectionHelper } from '../application/employee-file-selection.helper'
import { EmployeeFileTabsHelper } from '../application/employee-file-tabs.helper'
import { EmployeeFileMapper } from '../infrastructure/mappers/employee-file.mapper'
import { EmployeeFileErrorHelper } from '../infrastructure/helpers/employee-file-error.helper'
import { employeeFileRepository } from '../infrastructure/repositories/employee-file.repository'
import { useEmployeeEdit } from './use-employee-edit.hook'

const EMPTY_HERO = { heroEyebrow: '', heroTitle: '', heroItalic: '', heroLede: '' }

export function useEmployeeFile() {
  const { employeeId } = useParams<{ employeeId: string }>()
  const [state, dispatch] = useReducer(employeeFileReducer, INITIAL_EMPLOYEE_FILE_STATE)

  const load = useCallback(async (targetEmployeeId: string) => {
    dispatch({ type: 'LOAD_START' })
    try {
      const file = await employeeFileRepository.find(targetEmployeeId)
      dispatch({ type: 'LOAD_SUCCESS', file })
    } catch (error) {
      dispatch({ type: 'LOAD_ERROR', error: EmployeeFileErrorHelper.messageFrom(error) })
    }
  }, [])

  useEffect(() => {
    if (employeeId == null) {
      dispatch({ type: 'LOAD_ERROR', error: EmployeeFileErrorHelper.notFoundMessage() })
      return
    }
    void load(employeeId)
  }, [employeeId, load])

  const reload = useCallback(() => {
    if (employeeId == null) return
    void load(employeeId)
  }, [employeeId, load])

  const setTab = useCallback((tab: EmployeeFileTab) => dispatch({ type: 'SET_TAB', tab }), [])
  const toggleItem = useCallback((itemId: string) => dispatch({ type: 'TOGGLE_ITEM', itemId }), [])
  const toggleAllItems = useCallback(() => dispatch({ type: 'TOGGLE_ALL' }), [])
  const clearSelection = useCallback(() => dispatch({ type: 'CLEAR_SELECTION' }), [])

  const downloadPdf = useCallback(async (): Promise<string> => {
    if (employeeId == null) return EmployeeFileErrorHelper.notFoundMessage()
    dispatch({ type: 'PDF_START' })
    try {
      const file = await employeeFileRepository.downloadPdf(employeeId)
      FileDownloadHelper.save(file)
      return `Expediente descargado: ${file.filename}`
    } catch (error) {
      return await EmployeeFileErrorHelper.downloadMessageFrom(error)
    } finally {
      dispatch({ type: 'PDF_DONE' })
    }
  }, [employeeId])

  const handleEmployeeSaved = useCallback(
    (employee: Employee) => dispatch({ type: 'EMPLOYEE_UPDATED', employee }),
    [],
  )

  const { modalOpen, modalKey, editingEmployee, saving, formError, openEdit, closeModal, save } =
    useEmployeeEdit(handleEmployeeSaved)

  const { file, selectedItemIds } = state

  const openEditModal = useCallback(() => {
    if (file === null) return
    openEdit(EmployeeFileMapper.toEmployee(file))
  }, [file, openEdit])

  const tabItems = useMemo(() => EmployeeFileTabsHelper.toTabItems(file), [file])

  const heroTexts = useMemo(() => {
    if (file === null) return EMPTY_HERO
    const { name, identifier, hireDate, roleName } = file.employee
    return {
      heroEyebrow: EmployeeFilePresenter.heroEyebrow(identifier),
      heroTitle: EmployeeFilePresenter.heroTitle(name),
      heroItalic: EmployeeFilePresenter.firstName(name),
      heroLede: EmployeeFilePresenter.heroLede(hireDate, roleName),
    }
  }, [file])

  const activeItemsCount = file?.activeItems.length ?? 0
  const selectionCount = selectedItemIds.size
  const allSelected = EmployeeFileSelectionHelper.isAllSelected(selectedItemIds, activeItemsCount)
  const someSelected = EmployeeFileSelectionHelper.isSomeSelected(selectedItemIds, activeItemsCount)

  return {
    state,
    reload,
    setTab,
    toggleItem,
    toggleAllItems,
    clearSelection,
    downloadPdf,
    tabItems,
    selectionCount,
    allSelected,
    someSelected,
    heroEyebrow: heroTexts.heroEyebrow,
    heroTitle: heroTexts.heroTitle,
    heroItalic: heroTexts.heroItalic,
    heroLede: heroTexts.heroLede,
    modalOpen,
    modalKey,
    editingEmployee,
    saving,
    formError,
    openEdit: openEditModal,
    closeModal,
    saveEmployee: save,
  }
}
