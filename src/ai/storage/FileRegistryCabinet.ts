import { StorageRecordCard } from '@/app/types';
import { persistVFSNode, getNodesByParent, purgeVFSNode } from '@/ai/storage/virtual-file-system';

export interface IFileRegistryCabinet {
  addRecord(userId: string, card: Omit<StorageRecordCard, 'createdAt' | 'updatedAt'>): Promise<StorageRecordCard>;
  getRecords(userId: string): Promise<StorageRecordCard[]>;
  deleteRecord(id: string): Promise<boolean>;
}

export class FileRegistryCabinet implements IFileRegistryCabinet {
  /**
   * Adds a new StorageRecordCard into Firestore under the Cabinet directory.
   */
  async addRecord(userId: string, card: Omit<StorageRecordCard, 'createdAt' | 'updatedAt'>): Promise<StorageRecordCard> {
    const now = new Date();
    
    // Persist as a specialized VFS metadata node
    const node = await persistVFSNode({
      userId,
      name: `${card.name}.card.json`,
      path: `/Cabinet_Registry/${card.name}.card.json`,
      type: 'file',
      content: JSON.stringify(card.metadata || {}),
      parentId: 'cabinet_root',
      metadata: {
        type: 'storage_record_card',
        cardId: card.id,
        filePath: card.filePath,
        owner_agent: 'Librarian_Cabinet_Manager',
      }
    });

    return {
      id: node.id,
      name: card.name,
      filePath: card.filePath,
      createdAt: now,
      updatedAt: now,
      metadata: card.metadata,
    };
  }

  /**
   * Fetches all registered cards from Firestore for a given user.
   */
  async getRecords(userId: string): Promise<StorageRecordCard[]> {
    const nodes = await getNodesByParent(userId, 'cabinet_root');
    
    return nodes.map(node => ({
      id: node.id,
      name: node.name.replace('.card.json', ''),
      filePath: node.metadata?.filePath || node.path,
      createdAt: new Date(node.createdAt || node.updatedAt),
      updatedAt: new Date(node.updatedAt),
      metadata: node.content ? JSON.parse(node.content) : {},
    }));
  }

  /**
   * Removes a record card from VFS storage.
   */
  async deleteRecord(id: string): Promise<boolean> {
    const res = await purgeVFSNode(id);
    return res.success;
  }
}