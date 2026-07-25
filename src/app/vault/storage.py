import json
from typing import Dict, List
from vault import SovereignVault


class VaultStorageManager:
    """
    Interface for persisting encrypted Sovereign Vault snapshots to local storage/VFS.
    """
    def __init__(self, storage_path: str = "sovereign_vault.json"):
        self.storage_path = storage_path

    def save_snapshot(self, vault: SovereignVault) -> bool:
        """Exports encrypted snapshot from vault and writes to JSON."""
        try:
            snapshot_data = vault.export_snapshot()
            with open(self.storage_path, "w", encoding="utf-8") as f:
                json.dump(snapshot_data, f, indent=2)
            return True
        except Exception as e:
            print(f"[Storage Error] Failed to save vault snapshot: {e}")
            return False

    def load_snapshot(self, vault: SovereignVault) -> bool:
        """Reads JSON encrypted snapshot and imports into vault."""
        try:
            with open(self.storage_path, "r", encoding="utf-8") as f:
                snapshot_data: Dict[str, List[str]] = json.load(f)
            vault.import_snapshot(snapshot_data)
            return True
        except FileNotFoundError:
            print(f"[Storage Warning] Snapshot file '{self.storage_path}' not found. Initializing empty vault.")
            return False
        except Exception as e:
            print(f"[Storage Error] Failed to load vault snapshot: {e}")
            return False