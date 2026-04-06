export default function VaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // This creates the pitch-black environment and sets the default text to a terminal green
    <div className="min-h-screen bg-black text-emerald-500 font-mono p-4 md:p-8 selection:bg-emerald-900 selection:text-emerald-100">
      
      {/* Top Status Bar for The Safe */}
      <header className="border-b border-emerald-900 pb-4 mb-8 flex justify-between items-center">
        <h1 className="text-lg md:text-xl font-bold tracking-widest uppercase flex items-center gap-2">
          <span className="animate-pulse h-2 w-2 bg-emerald-500 rounded-full inline-block"></span>
          Sovereign_Vault // Node_Active
        </h1>
        <div className="text-xs md:text-sm text-emerald-700 text-right">
          <p>Auth: Validated</p>
          <p>Local Encryption: Standby</p>
        </div>
      </header>

      {/* This renders whatever page is currently active inside the vault */}
      <main className="max-w-7xl mx-auto">
        {children}
      </main>
      
    </div>
  );
}