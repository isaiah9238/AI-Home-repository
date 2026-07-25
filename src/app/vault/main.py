import os
from vault import SovereignVault
from audit import VaultAuditParser

def run_sovereign_pipeline():
    VAULT_ADDR = os.getenv("VAULT_ADDR", "http://127.0.0.1:8200")
    VAULT_TOKEN = os.getenv("VAULT_TOKEN", "root")

    print("--- Initializing Sovereign Vault via hvac ---")
    vault = SovereignVault(vault_url=VAULT_ADDR, token=VAULT_TOKEN)

    if not vault.is_authenticated():
        print("[!] Client authentication failed. Ensure Vault dev server is running.")
        return

    print("[+] Vault Client Authenticated Successfully.")

    # 1. Write Agent Memory to Vault KV Engine
    agent_id = "agent_architect"
    print(f"\n[+] Injecting secret memory fragment for '{agent_id}'...")
    vault.add_agent_memory(
        agent_id=agent_id,
        memory_key="session_token",
        memory_val="sovereign_live_token_8819x"
    )

    # 2. Retrieve Agent Memory from Vault
    print(f"\n[+] Retrieving memory fragment from Vault...")
    secret_data = vault.retrieve_agent_memory(agent_id=agent_id, memory_key="session_token")
    print(f"  Retrieved Secret: {secret_data}")

    # 3. Clean up / Purge
    print(f"\n[+] Purging secret key for '{agent_id}'...")
    vault.clear_agent_memory(agent_id=agent_id, memory_key="session_token")
    print("  Purge request completed.")

if __name__ == "__main__":
    run_sovereign_pipeline()