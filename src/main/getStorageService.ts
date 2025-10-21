import { ElectronStoreClient } from "./electronStoreClient";
import { StorageService } from "./storageService";

// Here define strategy which storage this app use.
const storageService = new StorageService(ElectronStoreClient);

/**
 * Return StorageService instance.
 *
 * this instance already bound with storage.
 */
export function getStorageService() {
  return storageService;
}
