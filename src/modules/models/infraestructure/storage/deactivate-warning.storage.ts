import { StorageService } from '../../../shared/infraestructure/storage/local.storage'

const KEY = 'models_deactivate_warning_seen'

export class DeactivateWarningStorage {
  static hasSeen(): boolean {
    return StorageService.get<boolean>(KEY) === true
  }

  static markSeen(): void {
    StorageService.set(KEY, true)
  }
}
