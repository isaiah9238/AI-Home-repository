import argparse
import hashlib
import logging
import os
import sys
from typing import Optional
from vault import SovereignVault, SovereignVaultError

# 6. Standardized Logging Framework Configuration
logger = logging.getLogger("SovereignMain")
logger.setLevel(logging.INFO)

if not logger.handlers:
    handler = logging.StreamHandler(sys.stdout)
    formatter = logging.Formatter(
        "[%(asctime)s] [%(levelname)s] [MainOrchestrator]: %(message)s"
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)


def parse_cli_args() -> argparse.Namespace:
    """4. Parameterizes inputs using argparse."""
    parser = argparse.ArgumentParser(
        description="Sovereign Vault Orchestrator CLI for Agent Memory Management"
    )
    parser.add_argument(
        "--agent-id", 
        type=str, 
        default=os.getenv("AGENT_ID", "agent_architect"),
        help="Target identifier for the agent (e.g., agent_architect)"
    )
    parser.add_argument(
        "--memory-key", 
        type=str, 
        default=os.getenv("MEMORY_KEY", "session_token"),
        help="Secret key label to write or retrieve"
    )
    parser.add_argument(
        "--memory-val", 
        type=str, 
        default=os.getenv("MEMORY_VAL", "sovereign_live_token_8819x"),
        help="Payload value to store in the vault"
    )
    parser.add_argument(
        "--role-id", 
        type=str, 
        default=os.getenv("VAULT_ROLE_ID"),
        help="Vault AppRole Role ID (optional if VAULT_TOKEN is set)"
    )
    parser.add_argument(
        "--secret-id", 
        type=str, 
        default=os.getenv("VAULT_SECRET_ID"),
        help="Vault AppRole Secret ID (optional if VAULT_TOKEN is set)"
    )
    return parser.parse_parse_args() if hasattr(parser, "parse_parse_args") else parser.parse_args()


def redact_secret(secret_value: Optional[str]) -> str:
    """2. Sanitizes sensitive data for logging by hashing the payload."""
    if not secret_value:
        return "[EMPTY_OR_NONE]"
    # Produce a short SHA-256 fingerprint for debugging without exposing raw secret
    fingerprint = hashlib.sha256(secret_value.encode("utf-8")).hexdigest()[:8]
    return f"[REDACTED (SHA256 fingerprint: {fingerprint}...)]"


def run_sovereign_pipeline():
    args = parse_cli_args()

    # 5. Secure Default Protocol (HTTPS Default) & Environment Variable Fallback
    vault_addr = os.getenv("VAULT_ADDR", "https://127.0.0.1:8200")
    if not vault_addr.startswith("https://") and not vault_addr.startswith("http://127.0.0.1"):
        logger.warning(
            f"VAULT_ADDR is set to '{vault_addr}'. TLS/HTTPS should be used in production environments!"
        )

    # 1. Mandate Token / Secure Auth Check
    vault_token = os.getenv("VAULT_TOKEN")
    
    logger.info("Initializing Sovereign Vault Orchestrator...")

    try:
        # Initialize Vault client
        vault = SovereignVault(vault_url=vault_addr, token=vault_token)

        # 1. Flexible Auth: AppRole method fallback if token is not provided directly
        if not vault_token:
            if args.role_id and args.secret_id:
                logger.info("VAULT_TOKEN missing. Attempting AppRole authentication...")
                auth_success = vault.authenticate_approle(role_id=args.role_id, secret_id=args.secret_id)
                if not auth_success:
                    logger.error("AppRole authentication failed.")
                    sys.exit(1)
            else:
                logger.critical(
                    "Authentication Failure: VAULT_TOKEN environment variable is missing "
                    "and AppRole credentials (--role-id, --secret-id) were not supplied."
                )
                raise ValueError("Vault authentication credentials must be explicitly configured.")

        # Validate connection status
        if not vault.is_authenticated():
            logger.critical("Vault client authentication check failed. Exiting pipeline.")
            sys.exit(1)

        logger.info("Vault client authenticated successfully.")

        # 3. Robust Error Handling - Write Secret
        logger.info(f"Injecting secret memory fragment for agent: '{args.agent_id}'...")
        write_ok = vault.add_agent_memory(
            agent_id=args.agent_id,
            memory_key=args.memory_key,
            memory_val=args.memory_val
        )
        if not write_ok:
            raise SovereignVaultError(f"Failed to write memory key '{args.memory_key}' for agent '{args.agent_id}'.")

        # 3. Robust Error Handling - Retrieve Secret
        logger.info(f"Retrieving secret memory fragment from Vault...")
        retrieved_val = vault.retrieve_agent_memory(
            agent_id=args.agent_id, 
            memory_key=args.memory_key
        )
        
        # 2. Prohibit Sensitive Data Logging
        logger.info(
            f"Successfully retrieved memory for '{args.agent_id}'. Payload Status: {redact_secret(retrieved_val)}"
        )

        # 3. Robust Error Handling - Ephemeral DB Credentials Context Manager Test
        logger.info("Testing ephemeral database credential generation...")
        try:
            with vault.ephemeral_db_credentials(name="readonly-role") as db_creds:
                username = db_creds.get("username", "unknown")
                logger.info(f"Dynamically generated database user: '{username}' (Password REDACTED)")
                # Operations performed within this block
        except SovereignVaultError as db_err:
            logger.warning(f"Ephemeral database credential test skipped or failed: {db_err}")

        # 3. Robust Error Handling - Purge Secret
        logger.info(f"Purging secret key for agent '{args.agent_id}' (using explicit force guard)...")
        purge_ok = vault.clear_agent_memory(
            agent_id=args.agent_id,
            memory_key=args.memory_key,
            force=True
        )
        if not purge_ok:
            raise SovereignVaultError(f"Failed to purge memory for agent '{args.agent_id}'.")

        logger.info("Sovereign pipeline executed successfully without credential exposure.")

    # 3. Global Exception Safety Net & Exit Codes
    except SovereignVaultError as sve:
        logger.error(f"Sovereign Vault Error encountered: {sve}")
        sys.exit(1)
    except ValueError as ve:
        logger.error(f"Configuration Error: {ve}")
        sys.exit(1)
    except Exception as e:
        logger.critical(f"Unhandled pipeline failure: {e}", exc_info=True)
        sys.exit(1)


if __name__ == "__main__":
    run_sovereign_pipeline()