import logging
import re
from contextlib import contextmanager
from typing import Dict, Optional, Any, Generator
import hvac
import hvac.exceptions

# Configure production-ready logger
logger = logging.getLogger("SovereignVault")
logger.setLevel(logging.INFO)

if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter(
        "[%(asctime)s] [%(levelname)s] [SovereignVault]: %(message)s"
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)


class SovereignVaultError(Exception):
    """Base exception class for SovereignVault errors."""
    pass


class SovereignVault:
    """
    Sovereign Vault - Enterprise Enclave via HashiCorp Vault (hvac).
    Handles client authentication, KV secret engine read/write, 
    dynamic credential generation, and policy checks.
    """

    # Input validation pattern: alphanumeric, underscores, hyphens only
    VALID_INPUT_PATTERN = re.compile(r"^[a-zA-Z0-9_\-]+$")

    def __init__(
        self, 
        vault_url: str, 
        token: Optional[str] = None, 
        client: Optional[hvac.Client] = None
    ):
        """
        Initializes the Sovereign Vault connection.

        :param vault_url: The URL of the HashiCorp Vault instance.
        :param token: Optional client token for authentication.
        :param client: Optional pre-configured hvac.Client instance for dependency injection and testing.
        """
        self.url = vault_url
        
        # 5. Dependency Injection for Testability
        if client is not None:
            self.client = client
        else:
            self.client = hvac.Client(url=self.url, token=token)

    # 3. Input Validation Helper
    def _validate_identifier(self, param_name: str, value: str, max_length: int = 64) -> None:
        """Validates that input parameters avoid path traversal and malicious characters."""
        if not value or not isinstance(value, str):
            raise ValueError(f"Parameter '{param_name}' must be a non-empty string.")
        if len(value) > max_length:
            raise ValueError(f"Parameter '{param_name}' exceeds maximum length of {max_length}.")
        if not self.VALID_INPUT_PATTERN.match(value):
            raise ValueError(
                f"Parameter '{param_name}' contains invalid characters. "
                "Only alphanumeric characters, underscores, and hyphens are permitted."
            )

    def is_authenticated(self) -> bool:
        """Verifies if the client has a valid session token."""
        try:
            return self.client.is_authenticated()
        except Exception as e:
            # 1. Redacted Logging
            logger.error("Authentication status check failed due to an underlying network/connection error.")
            return False

    # 7. Guidance for secret_id Handling & 6. Explicit Token Renewal Strategy
    def authenticate_approle(self, role_id: str, secret_id: str) -> bool:
        """
        Authenticates using the HashiCorp Vault AppRole method.

        SECURITY NOTICE: 
        The `secret_id` must NEVER be hardcoded or written to disk. Retrieve it at runtime
        from a secure local enclave, encrypted environment variable, or secure parameter store.

        TOKEN RENEWAL:
        Tokens generated via AppRole are renewable by default if configured in the Vault policy.
        For long-running processes, caller tasks should periodically execute `self.renew_token()`.

        :param role_id: AppRole Role ID.
        :param secret_id: AppRole Secret ID.
        :return: True if authentication succeeds, False otherwise.
        """
        self._validate_identifier("role_id", role_id)
        try:
            response = self.client.auth.approle.login(role_id=role_id, secret_id=secret_id)
            self.client.token = response['auth']['client_token']
            logger.info("AppRole authentication successful for specified Role ID.")
            return True
        except hvac.exceptions.VaultError as e:
            # 1. Redacted/Sanitized Logging
            logger.error("AppRole authentication failed due to Vault API error (credentials redacted).")
            return False
        except Exception as e:
            logger.error("Unexpected error occurred during AppRole authentication.")
            return False

    # 6. Token Renewal Implementation
    def renew_token(self, increment_seconds: int = 3600) -> bool:
        """Manually renews the current client authentication token lease."""
        try:
            self.client.auth.token.renew_self(increment=f"{increment_seconds}s")
            logger.info("Successfully renewed client token lease.")
            return True
        except hvac.exceptions.VaultError:
            logger.error("Failed to renew client token lease. Lease may have expired.")
            return False

    # 2. Refined Agent Memory Design (Per-Key Pattern with Simplified Extraction)
    def add_agent_memory(
        self, 
        agent_id: str, 
        memory_key: str, 
        memory_val: str, 
        mount_point: str = "secret"
    ) -> bool:
        """
        Stores a key-value secret under the path: `agents/{agent_id}/{memory_key}` (KV v2).
        """
        self._validate_identifier("agent_id", agent_id)
        self._validate_identifier("memory_key", memory_key)
        self._validate_identifier("mount_point", mount_point)

        try:
            path = f"agents/{agent_id}/{memory_key}"
            self.client.secrets.kv.v2.create_or_update_secret(
                mount_point=mount_point,
                path=path,
                secret={memory_key: memory_val}
            )
            logger.info(f"Successfully stored memory key for agent: {agent_id}")
            return True
        except hvac.exceptions.VaultError:
            logger.error(f"Vault error occurred while writing memory for agent: {agent_id}")
            return False

    def retrieve_agent_memory(
        self, 
        agent_id: str, 
        memory_key: str, 
        mount_point: str = "secret"
    ) -> Optional[Any]:
        """
        Retrieves a secret memory value stored at `agents/{agent_id}/{memory_key}`.

        :return: The target value directly, or None if not found or read fails.
        """
        self._validate_identifier("agent_id", agent_id)
        self._validate_identifier("memory_key", memory_key)
        self._validate_identifier("mount_point", mount_point)

        try:
            path = f"agents/{agent_id}/{memory_key}"
            read_response = self.client.secrets.kv.v2.read_secret_version(
                mount_point=mount_point,
                path=path
            )
            secret_dict = read_response.get("data", {}).get("data", {})
            # 2. Simplified extraction logic
            return secret_dict.get(memory_key)
        except hvac.exceptions.InvalidPath:
            logger.warning(f"Memory key '{memory_key}' not found for agent: {agent_id}")
            return None
        except hvac.exceptions.VaultError:
            logger.error(f"Vault error occurred while retrieving memory for agent: {agent_id}")
            return None

    # 4. Document and Guard Destructive Operations
    def clear_agent_memory(
        self, 
        agent_id: str, 
        memory_key: str, 
        mount_point: str = "secret", 
        force: bool = False
    ) -> bool:
        """
        CRITICAL WARNING: PERMANENT AND IRREVERSIBLE OPERATION.
        
        This method permanently deletes all metadata and underlying secret versions 
        at `agents/{agent_id}/{memory_key}`. Deleted data CANNOT be recovered.
        
        Vault access policies must be strictly configured to restrict usage of this method.

        :param agent_id: Agent identifier.
        :param memory_key: Secret key target.
        :param mount_point: KV secret mount point.
        :param force: Must be explicitly set to True to execute deletion. Defaults to False.
        :return: True if deletion succeeded, False otherwise.
        """
        if not force:
            logger.warning(
                f"Deletion aborted for agent '{agent_id}'. "
                "Must set 'force=True' to execute destructive operations."
            )
            return False

        self._validate_identifier("agent_id", agent_id)
        self._validate_identifier("memory_key", memory_key)
        self._validate_identifier("mount_point", mount_point)

        try:
            path = f"agents/{agent_id}/{memory_key}"
            self.client.secrets.kv.v2.delete_metadata_and_all_versions(
                mount_point=mount_point,
                path=path
            )
            logger.info(f"PERMANENTLY purged agent memory at path: agents/{agent_id}/{memory_key}")
            return True
        except hvac.exceptions.VaultError:
            logger.error(f"Failed to clear memory for agent: {agent_id}")
            return False

    # 8. Context Manager for Dynamic Credentials
    @contextmanager
    def ephemeral_db_credentials(
        self, 
        name: str, 
        mount_point: str = "database"
    ) -> Generator[Dict[str, Any], None, None]:
        """
        Context manager for dynamic database credentials. Automatically attempts lease 
        revocation upon exiting the context to guarantee short-lived access.

        Usage:
            with vault.ephemeral_db_credentials("my-role") as creds:
                db_user = creds["username"]
                db_pass = creds["password"]
                # Perform database operations
        """
        self._validate_identifier("name", name)
        self._validate_identifier("mount_point", mount_point)

        credentials_data = None
        lease_id = None

        try:
            response = self.client.secrets.database.generate_credentials(
                name=name,
                mount_point=mount_point
            )
            lease_id = response.get("lease_id")
            credentials_data = response.get("data", {})
            logger.info(f"Generated dynamic database credentials for role: {name}")
            yield credentials_data
        except hvac.exceptions.VaultError:
            logger.error(f"Failed to generate dynamic credentials for role: {name}")
            raise SovereignVaultError(f"Could not provision dynamic credentials for {name}")
        finally:
            if lease_id:
                try:
                    self.client.sys.revoke_lease(lease_id=lease_id)
                    logger.info(f"Successfully revoked lease: {lease_id}")
                except Exception:
                    logger.error(f"Failed to revoke lease: {lease_id}. Lease will expire naturally.")