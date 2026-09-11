import { type JSX } from 'react'
import { PlusSignIcon } from '@hugeicons/core-free-icons'
import { Button, PageHero, useToasts } from '../../../shared/infraestructure/components/ui'
import { useNavigationToast } from '../../../shared/hooks/use-navigation-toast.hook'
import type { CreateUserInput, UpdateUserInput } from '../../domain/user-input.model'
import { useUsers } from '../../hooks/use-users.hook'
import { useUserDelete } from '../../hooks/use-user-delete.hook'
import { UsersTable } from '../components/users-table.component'
import { UserFormModal } from '../components/user-form-modal.component'
import { UserDeleteDialog } from '../components/user-delete-dialog.component'

export const UsersPage = (): JSX.Element => {
  const {
    state,
    reloadList,
    setPage,
    setQuery,
    clearQuery,
    openCreate,
    openEdit,
    saveUser,
    editingUser,
    modalKey,
    modalOpen,
    closeModal,
  } = useUsers()
  const [addToast, ToastHost] = useToasts()

  useNavigationToast(addToast)

  const userDelete = useUserDelete({
    onDeleted: (target) => {
      reloadList()
      addToast(`Usuario "${target.name}" eliminado`, 'success')
    },
  })

  const handleSave = async (input: CreateUserInput | UpdateUserInput): Promise<void> => {
    const message = await saveUser(input)
    if (message != null) addToast(message)
  }

  return (
    <div>
      <PageHero
        eyebrow="Cuenta · Usuarios"
        title="Usuarios del sistema"
        italic="sistema"
        lede="Alta, edición y baja de las cuentas que acceden a Guards."
        actions={
          <Button variant="primary" icon={PlusSignIcon} size="md" onClick={openCreate}>
            Nuevo usuario
          </Button>
        }
      />

      <UsersTable
        rows={state.rows}
        status={state.status}
        query={state.query}
        page={state.page}
        lastPage={state.lastPage}
        total={state.total}
        onQueryChange={setQuery}
        onSetPage={setPage}
        onReload={reloadList}
        onClearQuery={clearQuery}
        onEdit={openEdit}
        onDelete={userDelete.openConfirm}
      />

      <UserFormModal
        key={modalKey}
        open={modalOpen}
        editUser={editingUser}
        saving={state.saving}
        formError={state.formError}
        onClose={closeModal}
        onSave={(input) => void handleSave(input)}
      />

      <UserDeleteDialog
        target={userDelete.target}
        loading={userDelete.loading}
        errorMessage={userDelete.errorMessage}
        onConfirm={() => void userDelete.confirm()}
        onClose={userDelete.closeConfirm}
      />

      {ToastHost}
    </div>
  )
}
