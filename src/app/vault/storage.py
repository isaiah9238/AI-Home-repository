import hashlib
import json
import logging
import os
import shutil
from typing import Dict, List, Optional
from filelock import FileLock, Timeout

# 2. Configure standard logging
logger = logging.getLogger("VaultStorageManager")
logger.setLevel(logging.INFO)

if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter(
        "[%(asctime)s] [%(levelname)s] [VaultStorageManager]: %(message)s"
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)


class StorageSecurityError(Exception):
    """Raised for path traversal, hash mismatch, or integrity violations."""
    pass


class VaultStorageManager:
    """
    Handles secure, atomic, and concurrency-safe persistence of encrypted
    Sovereign Vault snapshots to disk or local VFS.
    """

    def __init__(
        self, 
        storage_path: str = "sovereign_vault.json", 
        allowed_dir: Optional[str] = None,
        max_backups: int = 3
    ):
        """
        :param storage_path: File path for the vault snapshot JSON.
        :param allowed_dir: Directory boundary for path sanitization (defaults to current working directory).
        :param max_backups: Number of rolling historical backups to maintain.
        """
        # 3. Path Sanitization and Validation
        base_dir = os.path.abspath(allowed_dir or os.getcwd())
        resolved_target = os.path.abspath(storage_path)

        if not resolved_target.startswith(base_dir):
            raise StorageSecurityError(
                f"Path traversal detected: '{storage_path}' resolves outside allowed directory '{base_dir}'."
            )

        self.storage_path = resolved_target
        self.lock_path = f"{self.storage_path}.lock"
        self.max_backups = max_backups

    def _compute_hash(self, payload_data: Dict[str, List[str]]) -> str:
        """4. Computes a deterministic SHA-256 hash of the snapshot payload."""
        serialized = json.dumps(payload_data, sort_keys=True).encode("utf-8")
        return hashlib.sha256(serialized).hexdigest()

    def _rotate_backups(self) -> None:
        """7. Maintains a rolling history of snapshot backups."""
        if not os.path.exists(self.storage_path) or self.max_backups <= 0:
            return

        for i in range(self.max_backups - 1, 0, -1):
            src = f"{self.storage_path}.bak.{i}"
            dst = f"{self.storage_path}.bak.{i + 1}"
            if os.path.exists(src):
                shutil.move(src, dst)

        first_backup = f"{self.storage_path}.bak.1"
        shutil.copy2(self.storage_path, first_backup)
        logger.info(f"Rotated snapshot backup -> {first_backup}")

    def save_snapshot(self, vault) -> bool:
        """
        Atomically saves an encrypted vault snapshot with SHA-256 integrity metadata,
        secure file permissions (0o600), and cross-platform file locking.
        """
        # 5. Concurrency Control via FileLock
        lock = FileLock(self.lock_path, timeout=10)
        try:
            with lock:
                # 7. Rotate existing backup before writing new state
                self._rotate_backups()

                raw_snapshot = vault.export_snapshot()
                integrity_hash = self._compute_hash(raw_snapshot)

                envelope = {
                    "version": "1.0",
                    "checksum_sha256": integrity_hash,
                    "payload": raw_snapshot
                }

                # 1. Atomic Save via Temporary File
                temp_path = f"{self.storage_path}.tmp"
                with open(temp_path, "w", encoding="utf-8") as f:
                    json.dump(envelope, f, indent=2)

                # 6. Secure File Permissions (Owner Read/Write Only)
                try:
                    os.chmod(temp_path, 0o600)
                except OSError as perm_err:
                    logger.warning(f"Failed to set strict permissions (0o600): {perm_err}")

                # Atomic swap replaces target without leaving partial state on error
                os.replace(temp_path, self.storage_path)
                
                # Apply 0o600 to final path explicitly
                try:
                    os.chmod(self.storage_path, 0o600)
                except OSError:
                    pass

                logger.info(f"Successfully saved snapshot atomically to {self.storage_path}")
                return True

        except Timeout:
            logger.error("Timed out acquiring lock for snapshot save.")
            return False
        # 2. Refined Exception Handling
        except (IOError, OSError) as io_err:
            logger.error(f"IO error occurred while saving snapshot: {io_err}")
            if os.path.exists(f"{self.storage_path}.tmp"):
                os.remove(f"{self.storage_path}.tmp")
            return False

    def load_snapshot(self, vault) -> bool:
        """
        Reads, verifies SHA-256 integrity, and imports the snapshot into the vault.
        Ensures atomic state rollback if importing fails.
        """
        if not os.path.exists(self.storage_path):
            logger.warning(f"Snapshot file '{self.storage_path}' not found.")
            return False

        # 5. Concurrency Control via FileLock
        lock = FileLock(self.lock_path, timeout=10)
        try:
            with lock:
                with open(self.storage_path, "r", encoding="utf-8") as f:
                    envelope = json.load(f)

                payload = envelope.get("payload")
                stored_hash = envelope.get("checksum_sha256")

                if payload is None or stored_hash is None:
                    raise StorageSecurityError("Invalid snapshot envelope format.")

                # 4. Data Integrity Verification
                computed_hash = self._compute_hash(payload)
                if computed_hash != stored_hash:
                    raise StorageSecurityError(
                        "Integrity check failed! Data has been modified or corrupted."
                    )

                # 8. Transactional Import (Preserve state on failure)
                # Backup current vault state before mutation
                previous_state = vault.export_snapshot()

                try:
                    vault.import_snapshot(payload)
                    logger.info("Successfully verified and loaded snapshot into vault.")
                    return True
                except Exception as import_err:
                    # Revert to known good state
                    logger.error(f"Vault state import failed: {import_err}. Rolling back vault state...")
                    vault.import_snapshot(previous_state)
                    raise import_err

        except Timeout:
            logger.error("Timed out acquiring lock for snapshot load.")
            return False
        # 2. Refined Exception Handling
        except (IOError, OSError) as io_err:
            logger.error(f"IO error reading snapshot file: {io_err}")
            return False
        except json.JSONDecodeError as json_err:
            logger.error(f"Failed to parse JSON snapshot file: {json_err}")
            return False
        except StorageSecurityError as sec_err:
            logger.critical(f"Security Alert: {sec_err}")
            return False