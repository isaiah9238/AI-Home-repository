// 1. Instructions: Create this file to manage the Secret Enclave logic.
// 2. Logic: Uses your VFS persistVFSNode with specialized metadata.
// 3. Integration: Directly powers the vault-backup-drawer UI.

import { persistVFSNode, VFSNode } from './virtual-file-system';

/**
 * Initializes a secure node within the Librarian's Secret Vault.
 * Ensures the 'isVault' flag is set to restrict general UI visibility.
 */
export async function createVaultEntry(
  userId: string, 
  name: string, 
  encryptedContent: string, 
  agentOrigin: 'inspector' | 'safety' | 'flux-echo'
) {
  // 1. Just define the Constant with the values
  const vaultNode: Omit<VFSNode, 'id' | 'updatedAt'> = {
    userId,
    name,
    path: `/Vault/${name}`,
    type: 'file',
    content: encryptedContent,
    parentId: 'vault_root', 
    metadata: {
      isVault: true,        // The Sanitizer will now pass this flag
      agentOrigin: agentOrigin,
      owner_agent: 'Librarian_Vault_Manager',
      intent_vector: 'secure_storage'
    }
  };

  // 2. Send it to the Writer
  return await persistVFSNode(vaultNode);
}