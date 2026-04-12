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
  const vaultNode: Omit<VFSNode, 'id' | 'updatedAt'> = {
    name,
    path: `/vault/${name}`,
    type: 'file',
    content: encryptedContent, // AES-256 string from Node_Active
    parentId: 'vault-root',    // Reserved ID for the Secret Enclave
    userId,
    mimeType: 'application/octet-stream',
    metadata: {
      isVault: true,
      agentOrigin,
      neuralWeight: 1.0,
      disappearanceMarker: false // Set to true if this recovers 'Silver Memory'
    }
  };

  return await persistVFSNode(vaultNode);
}