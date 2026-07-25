import json
import logging
import os
from typing import Dict, List, Any, Optional, Generator

# 4. Secure Logger Configuration
logger = logging.getLogger("VaultAuditParser")
logger.setLevel(logging.INFO)

if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter(
        "[%(asctime)s] [%(levelname)s] [VaultAuditParser]: %(message)s"
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)


class AuditSecurityError(Exception):
    """Exception raised when path sanitization or security boundaries fail."""
    pass


class VaultAuditParser:
    """
    Parses HashiCorp Vault JSON audit logs for security compliance reporting
    and SIEM integration in air-gapped sovereign environments.
    """

    def __init__(
        self, 
        log_file_path: str, 
        allowed_dir: Optional[str] = None
    ):
        """
        :param log_file_path: Path to the JSON audit log file.
        :param allowed_dir: Directory boundary restricting log file location (defaults to CWD).
        """
        # 2. Input Validation for log_file_path (Directory Traversal Prevention)
        base_dir = os.path.abspath(allowed_dir or os.getcwd())
        resolved_log_path = os.path.abspath(log_file_path)

        # Ensure resolved_log_path stays within allowed_dir
        try:
            common = os.path.commonpath([base_dir, resolved_log_path])
            if common != base_dir:
                raise AuditSecurityError(
                    f"Path Traversal Blocked: Log path '{log_file_path}' resolves outside allowed directory."
                )
        except ValueError as val_err:
            raise AuditSecurityError(f"Invalid path comparison: {val_err}") from val_err

        self.log_file_path = resolved_log_path
        # 1. Caching container for loaded events
        self._cached_events: Optional[List[Dict[str, Any]]] = None

    # 1. Streaming Generator for Memory Efficiency on Large Files
    def stream_events(self) -> Generator[Dict[str, Any], None, None]:
        """
        Generator yielding audit events line-by-line without loading 
        the entire file into memory. Ideal for massive SIEM log dumps.
        """
        if not os.path.exists(self.log_file_path):
            logger.error("Audit log file target does not exist.")
            return

        try:
            with open(self.log_file_path, "r", encoding="utf-8") as f:
                for line_num, line in enumerate(f, 1):
                    line_str = line.strip()
                    if not line_str:
                        continue
                    try:
                        yield json.loads(line_str)
                    except json.JSONDecodeError as json_err:
                        # 4. Redacted/Sanitized Error Logging
                        logger.warning(
                            f"Malformed JSON audit entry skipped on line {line_num}."
                        )
        except (IOError, OSError) as io_err:
            logger.error("Failed to read audit log file due to an I/O error.")

    # 5. Dedicated Public Method for All Cached Events & 1. Lazy Loading
    def get_all_events(self, force_reload: bool = False) -> List[Dict[str, Any]]:
        """
        Returns all parsed events, utilizing in-memory caching to prevent repeated disk I/O.
        
        :param force_reload: Forces re-reading from disk if True.
        """
        if self._cached_events is None or force_reload:
            logger.info("Parsing audit log file into memory cache...")
            self._cached_events = list(self.stream_events())
            logger.info(f"Cached {len(self._cached_events)} audit events.")
        
        return self._cached_events

    # 3. Refined Path Matching Logic
    def filter_by_agent(self, agent_id: str, use_stream: bool = False) -> List[Dict[str, Any]]:
        """
        Filters log events for requests targeting `agents/{agent_id}` using precise path boundaries.

        :param agent_id: Target agent identifier.
        :param use_stream: If True, streams directly from file to conserve RAM.
        :return: List of matching audit record dictionaries.
        """
        target_prefix = f"agents/{agent_id.strip('/')}"
        agent_events: List[Dict[str, Any]] = []

        # Choose event iterator (Stream vs Cached)
        event_source = self.stream_events() if use_stream else self.get_all_events()

        for event in event_source:
            req_path = event.get("request", {}).get("path", "").strip('/')

            # 3. Precise Path Matching: prevents false positives (e.g. agent_id="bot" matching "bot_admin")
            if req_path == target_prefix or req_path.startswith(f"{target_prefix}/"):
                agent_events.append(event)

        return agent_events