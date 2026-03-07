import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getGems } from "@/app/actions";
import { GemActions } from "./gem-actions";

type GemSeverity = "low" | "medium" | "high" | "critical";
type GemResolution = "pending" | "resolved" | "dismissed";

interface Gem {
  id: string;
  type: string;
  reason: string;
  severity: GemSeverity;
  time: string;
  resolution: GemResolution;
  content: string;
}

const severityVariant: Record<GemSeverity, "default" | "secondary" | "destructive"> = {
    low: "secondary",
    medium: "default",
    high: "destructive",
    critical: "destructive",
};

const statusVariant: Record<GemResolution, "default" | "secondary" | "outline"> = {
    pending: "destructive",
    resolved: "default",
    dismissed: "secondary",
};

export default async function ReportsPage() {
  const result = await getGems();
  const gems: Gem[] = result.success ? result.data : [];

  return (
    <div className="w-full p-8 bg-[#050505] min-h-screen text-white font-mono">
      <div className="mb-8 border-l-4 border-red-500 pl-6">
        <h1 className="text-4xl font-light tracking-[0.2em] uppercase">Security_Logs</h1>
        <p className="text-white/40 mt-2 uppercase tracking-widest text-xs">
          Reviewing flagged content incidents recorded by the Librarian.
        </p>
      </div>
      
      <Card className="bg-black/40 border-white/10 backdrop-blur-md overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-[10px] uppercase tracking-widest text-white/50">ID</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest text-white/50">Source</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest text-white/50">Severity</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest text-white/50">Status</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest text-white/50">Reason</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest text-white/50">Content_Snippet</TableHead>
              <TableHead className="text-[10px] uppercase tracking-widest text-white/50">Actions</TableHead>
              <TableHead className="text-right text-[10px] uppercase tracking-widest text-white/50">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-white/20 uppercase tracking-[0.3em] text-xs">
                  No_Incidents_Logged
                </TableCell>
              </TableRow>
            ) : (
              gems.map((gem) => (
                <TableRow key={gem.id} className="border-white/5 hover:bg-white/5 transition-colors">
                  <TableCell className="font-mono text-[10px] text-white/30">{gem.id.substring(0, 8)}...</TableCell>
                  <TableCell className="text-[10px] uppercase text-white/70">{gem.type}</TableCell>
                  <TableCell>
                      <Badge variant={severityVariant[gem.severity]} className="text-[8px] uppercase tracking-tighter">
                        {gem.severity}
                      </Badge>
                  </TableCell>
                  <TableCell>
                      <Badge variant={statusVariant[gem.resolution || 'pending']} className="text-[8px] uppercase tracking-tighter">
                        {gem.resolution || 'pending'}
                      </Badge>
                  </TableCell>
                  <TableCell className="text-[10px] text-white/60">{gem.reason}</TableCell>
                  <TableCell className="max-w-xs truncate text-[10px] text-white/40 font-mono italic">
                    "{gem.content}"
                  </TableCell>
                  <TableCell>
                    <GemActions gemId={gem.id} status={gem.resolution || 'pending'} />
                  </TableCell>
                  <TableCell className="text-right text-[10px] text-white/30 tabular-nums">
                    {new Date(gem.time).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
