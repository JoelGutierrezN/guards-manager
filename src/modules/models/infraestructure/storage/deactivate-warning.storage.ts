import { StorageService } from '../../../shared/infraestructure/storage/local.storage'
import { PERSIST_UX_WARNINGS } from '../../../shared/infraestructure/config/ux.config'

const KEY = 'models_deactivate_warning_seen'

export class DeactivateWarningStorage {
  static hasSeen(): boolean {
    if (!PERSIST_UX_WARNINGS) return false
    return StorageService.get<boolean>(KEY) === true
  }

  static markSeen(): void {
    if (!PERSIST_UX_WARNINGS) return
    StorageService.set(KEY, true)
  }
}
