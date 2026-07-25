# VFS Mutation Tracking & Record Cabinet Integration Guide

To track VFS mutations globally—whether files are added, modified, or purged—we can wire an audit hook directly inside `virtual-file-system.ts`. This will write a permanent event log entry to a dedicated `vfs_audit_logs` collection in Firestore every time the writer or eraser executes.

Here is how to set up audit logging across the entire system.

---

## Part 1: VFS Audit Logging Setup

### Step 1: Update `virtual-file-system.ts` with Audit Hooks

Add a `logVFSEvent` helper and call it inside `persistVFSNode` and `purgeVFSNode`:

```typescript
// Add near the top of src/ai/storage/virtual-file-system.ts
const AUDIT_COLLECTION = 'vfs_audit_logs';

/**
 * Writes an immutable transaction log entry to Firestore whenever a file is created, updated, or purged.
 */
async function logVFSEvent(
  action: 'CREATE' | 'UPDATE' | 'DELETE',
  nodeId: string,
  nodeData: { name: string; path: string; userId: string; type: string; owner_agent?: string }
) {
  try {
    const db = getAdminDb();
    await db.collection(AUDIT_COLLECTION).add({
      action,
      nodeId,
      name: nodeData.name,
      path: nodeData.path,
      userId: nodeData.userId,
      type: nodeData.type,
      ownerAgent: nodeData.owner_agent || 'System',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.error(`🚨 VFS_AUDIT_LOG_FAILED for node ${nodeId}:`, err);
  }
}

```

Now update `persistVFSNode` to trigger the audit event:

```typescript
export async function persistVFSNode(node: Omit<VFSNode, 'id' | 'updatedAt'>) {
  const db = getAdminDb();
  const docRef = db.collection(COLLECTION_NAME).doc();
  
  const writeData = {
    ...node,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  };
  
  await docRef.set(writeData);
  
  // 📜 Global Audit Event: Log creation/persistence
  logVFSEvent('CREATE', docRef.id, {
    name: node.name,
    path: node.path,
    userId: node.userId,
    type: node.type,
    owner_agent: node.metadata?.owner_agent || node.metadata?.agentOrigin,
  });

  // Background vector indexing...
  if (node.type === 'file' && node.content && !node.metadata?.isVault) {
    indexVFSNode({
      nodeId: docRef.id,
      path: node.path,
      content: node.content,
      userId: node.userId,
      agentOrigin: node.metadata?.agentOrigin || node.metadata?.owner_agent
    }).catch(err => {
      console.error(`🚨 VFS_VECTOR_SYNC_FAILED for node ${docRef.id}:`, err);
    });
  }
  
  return sanitizeNode(docRef.id, {
    ...node,
    updatedAt: { toDate: () => new Date() }
  });
}

```

And update `purgeVFSNode`:

```typescript
export async function purgeVFSNode(nodeId: string) {
  const db = getAdminDb();
  const docRef = db.collection(COLLECTION_NAME).doc(nodeId);
  const snap = await docRef.get();
  
  if (snap.exists) {
    const data = snap.data();
    
    // 📜 Global Audit Event: Log deletion before removing
    await logVFSEvent('DELETE', nodeId, {
      name: data?.name || 'Unnamed',
      path: data?.path || '/',
      userId: data?.userId || 'unknown',
      type: data?.type || 'file',
      owner_agent: data?.metadata?.owner_agent || 'User_Action',
    });
  }

  const batch = db.batch();
  const findChildren = async (pid: string) => {
    const snapshot = await db.collection(COLLECTION_NAME).where('parentId', '==', pid).get();
    for (const doc of snapshot.docs) {
      batch.delete(doc.ref);
      await findChildren(doc.id);
    }
  };
  
  await findChildren(nodeId);
  batch.delete(docRef);
  await batch.commit();
  return { success: true };
}

```

---

### Step 2: Add Action to Fetch Audit Logs in `src/app/actions.ts`

To display or query these transactions from anywhere in your app:

```typescript
export async function getVFSAuditLogsAction(limitCount: number = 20) {
  try {
    const session = await verifyAuth();
    const db = getAdminDb();
    
    const snapshot = await db.collection('vfs_audit_logs')
      .where('userId', '==', session.user.id)
      .orderBy('timestamp', 'desc')
      .limit(limitCount)
      .get();

    const logs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return deepSanitize({ success: true, data: logs });
  } catch (error: any) {
    return deepSanitize({ success: false, error: error.message, data: [] });
  }
}

```

Now every file creation, refactor, or deletion in Firestore creates an automatic ledger entry in `vfs_audit_logs`.

---

## Part 2: Collection Overview & Architecture

### What is `vfs_audit_logs`?

`vfs_audit_logs` is a **Firestore collection name** (not a local file). When you add the audit logging code to `src/ai/storage/virtual-file-system.ts`, Firestore creates this collection automatically inside your Cloud Firestore database (under Firebase project `studio-3863072923-d4373`) the first time an audit event is logged.

### Where it lives:

1. **In Google Cloud / Firebase Console:** Go to **Firebase Console** -> **Firestore Database** -> **Data Tab**. Alongside your `ai_vfs` collection, you will see `vfs_audit_logs` listed as a top-level collection containing document entries for every `CREATE`, `UPDATE`, or `DELETE` event.
2. **In Code (Server Actions):** You query it directly from your Next.js application using `getAdminDb().collection('vfs_audit_logs')`.

---

## Part 3: UI Integration with FileRegistryCabinet

Wiring `vfs_audit_logs` directly into the `FileRegistryCabinet` gives you a dedicated transaction log right inside the **Record Cabinet** tab.

### Step 1: Add `getVFSAuditLogsAction` Handler

Ensure your action handles timestamp formatting properly for the client UI:

```typescript
export async function getVFSAuditLogsAction(limitCount: number = 20) {
  try {
    const db = getAdminDb();
    
    const snapshot = await db
      .collection('vfs_audit_logs')
      .orderBy('timestamp', 'desc')
      .limit(limitCount)
      .get();

    const logs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Format Firestore Timestamp for client UI
      timestamp: doc.data().timestamp?.toDate?.()?.toISOString() || new Date().toISOString(),
    }));

    return deepSanitize({ success: true, data: logs });
  } catch (error: any) {
    return deepSanitize({ success: false, error: error.message, data: [] });
  }
}

```

---

### Step 2: Display Audit History inside `StorageDrawer`

Update `src/components/storage-drawer.tsx` to display both registered Record Cards and live Firestore Audit Logs side-by-side:

```tsx
// 1. Add state and load function near top of StorageDrawer component
const [auditLogs, setAuditLogs] = useState<any[]>([]);

const loadAuditLogs = async () => {
  const res = await getVFSAuditLogsAction(15);
  if (res.success && res.data) {
    setAuditLogs(res.data);
  }
};

useEffect(() => {
  loadCabinetCards();
  loadAuditLogs(); // Fetch logs on mount
}, []);

```

```tsx
{/* 🗄️ FILE REGISTRY CABINET & AUDIT TAB */}
<TabsContent value="cabinet" className="flex-1 m-0 overflow-hidden font-mono">
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">

    {/* Left Panel: Storage Record Cards Index */}
    <div className="lg:col-span-7 flex flex-col gap-4 overflow-hidden">
      <Card className="bg-black/40 border-emerald-500/20 backdrop-blur-md flex-1 flex flex-col overflow-hidden">
        <CardHeader className="bg-emerald-950/30 border-b border-emerald-500/10 py-3 flex flex-row items-center justify-between">
          <CardTitle className="text-[10px] text-emerald-400 uppercase tracking-widest flex items-center gap-2">
            <HardDrive className="w-3.5 h-3.5" /> Registered_Record_Cards
          </CardTitle>
          <Badge variant="outline" className="text-[8px] border-emerald-500/30 text-emerald-400">
            {cards.length} INDEXED
          </Badge>
        </CardHeader>
        <ScrollArea className="flex-1 p-4">
          <div className="grid grid-cols-1 gap-3">
            {cards.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 border border-dashed border-emerald-500/10 rounded-xl opacity-30">
                <HardDrive className="w-10 h-10 text-emerald-400 mb-2" />
                <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-300">Cabinet Empty.</p>
              </div>
            ) : (
              cards.map((card) => (
                <Card key={card.id} className="bg-black/40 border-emerald-500/20 hover:border-emerald-500/50 transition-all">
                  <CardHeader className="py-2 px-3 border-b border-white/5 flex flex-row items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 uppercase truncate">{card.name}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteCard(card.id)}
                      className="h-5 w-5 text-white/20 hover:text-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-3 text-[10px] text-white/70 space-y-1">
                    <div><b className="text-emerald-500/60 uppercase">Path:</b> {card.filePath}</div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>

    {/* Right Panel: Firestore Transaction Audit Feed */}
    <div className="lg:col-span-5 flex flex-col gap-4 overflow-hidden">
      <Card className="bg-black/40 border-purple-500/20 backdrop-blur-md flex-1 flex flex-col overflow-hidden">
        <CardHeader className="bg-purple-950/20 border-b border-purple-500/10 py-3 flex flex-row items-center justify-between">
          <CardTitle className="text-[10px] text-purple-400 uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Firestore_Audit_Ledger
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={loadAuditLogs} className="h-6 w-6 text-purple-300 hover:text-white">
            <RefreshCcw className="w-3 h-3" />
          </Button>
        </CardHeader>
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-2">
            {auditLogs.length === 0 ? (
              <p className="text-[9px] text-white/30 text-center py-8 uppercase tracking-widest">No audit transactions recorded yet.</p>
            ) : (
              auditLogs.map((log) => (
                <div key={log.id} className="p-2.5 rounded bg-black/60 border border-white/5 text-[9px] font-mono space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge className={`text-[7px] px-1.5 py-0 h-4 uppercase ${
                      log.action === 'CREATE' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                      log.action === 'DELETE' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }`}>
                      {log.action}
                    </Badge>
                    <span className="text-white/30 text-[8px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-white/80 font-bold truncate">{log.name}</div>
                  <div className="text-white/40 truncate">{log.path}</div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </Card>
    </div>

  </div>
</TabsContent>

```

---

## Part 4: Record Cabinet Input Reference

In the registration inputs, tell the Record Cabinet **which application's foundational files** you want indexed:

* **`RECORD_NAME`**: Clean label for the core file (`[AppName]_[FileType]`).
* **`FILE_PATH`**: Relative workspace path where the file lives.

### Key Application Examples

| App | Record Name | File Path |
| --- | --- | --- |
| **AI Home App** | `AIHome_VFS_Core` | `src/ai/storage/virtual-file-system.ts` |
| **The Note Book** | `Notebook_Main Canvas` | `src/components/notebook-canvas.tsx` |
| **SVG Viewer** | `SVGViewer_Webpack_Config` | `webpack.config.js` |
| **Code Inspector** | `Inspector_Domain_Config` | `src/components/code-analyzer.tsx` |

### Usage Workflow

1. Enter `AIHome_VFS_Core` into **RECORD_NAME**.
2. Enter `src/ai/storage/virtual-file-system.ts` into **FILE_PATH**.
3. Select **INDEX_RECORD_CARD**.

---

## Part 5: Storage & Persistence Details

Record Cards are **permanently stored** inside Cloud Firestore.

* **Database**: Google Cloud Firestore (`studio-3863072923-d4373`)
* **Collection**: `ai_vfs`
* **Document Path**: Persisted under the `cabinet_root` virtual directory path.

Because records commit through `FileRegistryCabinet` via `addRecordCardAction`, they persist across page refreshes and server restarts until explicitly removed using the deletion purge control.