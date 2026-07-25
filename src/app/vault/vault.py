import base64
import os
import hashlib
from typing import Dict, List, Optional
from cryptography.hazmat.primitives.ciphers.aead import AESGCM


class SovereignVault:
    """
    Sovereign Vault - Privacy Domain Enclave
    Manages client-side AES-256 encrypted agent memory and short-lived credentials.
    """
    def __init__(self, master_passphrase: str, salt: bytes = b'cabinet_sovereign_salt'):
        # Derive a 256-bit symmetric encryption key from the passphrase
        self._key = hashlib.pbkdf2_hmac(
            'sha256', 
            master_passphrase.encode('utf-8'), 
            salt, 
            100_000
        )
        self._aesgcm = AESGCM(self._key)
        self._encrypted_memory: Dict[str, List[bytes]] = {}

    def _encrypt(self, plaintext: str) -> bytes:
        """Encrypts raw text using AES-256-GCM with a fresh 12-byte nonce."""
        nonce = os.urandom(12)
        ciphertext = self._aesgcm.encrypt(nonce, plaintext.encode('utf-8'), None)
        return nonce + ciphertext

    def _decrypt(self, payload: bytes) -> str:
        """Decrypts payload using extracted 12-byte nonce."""
        nonce = payload[:12]
        ciphertext = payload[12:]
        decrypted_bytes = self._aesgcm.decrypt(nonce, ciphertext, None)
        return decrypted_bytes.decode('utf-8')

    def add_agent_memory(self, agent_id: str, memory: str) -> None:
        """Encrypts and stores a memory fragment for a specific agent."""
        if agent_id not in self._encrypted_memory:
            self._encrypted_memory[agent_id] = []
        
        encrypted_payload = self._encrypt(memory)
        self._encrypted_memory[agent_id].append(encrypted_payload)

    def retrieve_agent_memory(self, agent_id: str) -> List[str]:
        """Decrypts and returns all stored memory fragments for an agent."""
        encrypted_list = self._encrypted_memory.get(agent_id, [])
        decrypted_memories = []
        
        for payload in encrypted_list:
            try:
                decrypted_memories.append(self._decrypt(payload))
            except Exception:
                decrypted_memories.append("[DECRYPTION_FAILED: Tampered payload or invalid passphrase]")
                
        return decrypted_memories

    def clear_agent_memory(self, agent_id: str) -> bool:
        """Purges all memory fragments for an agent."""
        if agent_id in self._encrypted_memory:
            del self._encrypted_memory[agent_id]
            return True
        return False

    def export_snapshot(self) -> Dict[str, List[str]]:
        """Exports base64-encoded encrypted blobs for persistence."""
        snapshot = {}
        for agent_id, payloads in self._encrypted_memory.items():
            snapshot[agent_id] = [base64.b64encode(p).decode('utf-8') for p in payloads]
        return snapshot

    def import_snapshot(self, snapshot: Dict[str, List[str]]) -> None:
        """Imports base64-encoded encrypted blobs into enclave memory."""
        for agent_id, b64_payloads in snapshot.items():
            self._encrypted_memory[agent_id] = [
                base64.b64decode(p.encode('utf-8')) for p in b64_payloads
            ]