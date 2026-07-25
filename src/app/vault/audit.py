import json
from typing import List, Dict, Any

class VaultAuditParser:
    """
    Parses HashiCorp Vault JSON audit logs for security compliance reports 
    and SIEM ingestion in sovereign air-gapped environments.
    """
    def __init__(self, log_file_path: str):
        self.log_file_path = log_file_path

    def parse_events(self) -> List[Dict[str, Any]]:
        """Parses JSON line audit entries into structured telemetry events."""
        events = []
        try:
            with open(self.log_file_path, "r", encoding="utf-8") as f:
                for line in f:
                    if line.strip():
                        events.append(json.loads(line.strip()))
        except FileNotFoundError:
            print(f"[Audit Error] Log file '{self.log_file_path}' not found.")
        except Exception as e:
            print(f"[Audit Parsing Error] {e}")
        return events

    def filter_by_agent(self, agent_id: str) -> List[Dict[str, Any]]:
        """Extracts audit events related to specific agent paths."""
        events = self.parse_events()
        agent_events = []
        target_path = f"agents/{agent_id}"
        
        for event in events:
            req_path = event.get("request", {}).get("path", "")
            if target_path in req_path:
                agent_events.append(event)
                
        return agent_events