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

type Report = {
  id: string;
  gem: string;
  reason: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  timestamp: string;
  status: "Pending" | "Resolved" | "Ignored";
  content: string;
};

const mockReports: Report[] = [
  {
    id: "REP-001",
    gem: "FilterUserInput",
    reason: "Toxic language detected",
    severity: "High",
    timestamp: "2024-05-20 10:30:00",
    status: "Pending",
    content: "You are all idiots and your project is dumb.",
  },
  {
    id: "REP-002",
    gem: "FilterAIOutput",
    reason: "Generated harmful instruction",
    severity: "Critical",
    timestamp: "2024-05-20 09:15:00",
    status: "Resolved",
    content: "To bypass the filter, you can try...",
  },
  {
    id: "REP-003",
    gem: "FilterUserInput",
    reason: "Spam content",
    severity: "Low",
    timestamp: "2024-05-19 18:00:21",
    status: "Resolved",
    content: "BUY CHEAP CODES NOW AT...",
  },
  {
    id: "REP-004",
    gem: "FilterUserInput",
    reason: "Hate speech",
    severity: "Critical",
    timestamp: "2024-05-19 14:22:05",
    status: "Pending",
    content: "[Redacted hate speech content]",
  },
  {
    id: "REP-005",
    gem: "FilterAIOutput",
    reason: "Violates policy X",
    severity: "Medium",
    timestamp: "2024-05-18 22:10:00",
    status: "Ignored",
    content: "The AI's opinion on a controversial topic.",
  },
];

const severityVariant: Record<Report["severity"], "default" | "secondary" | "destructive"> = {
    Low: "secondary",
    Medium: "default",
    High: "destructive",
    Critical: "destructive",
};

const statusVariant: Record<Report["status"], "default" | "secondary" | "outline"> = {
    Pending: "destructive",
    Resolved: "default",
    Ignored: "secondary",
};

export default function ReportsPage() {
  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight font-headline">Content Reports</h1>
        <p className="text-muted-foreground mt-2">
          Review and manage all content flagged by the AI moderation system.
        </p>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Flagged By</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Content</TableHead>
              <TableHead className="text-right">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.id}</TableCell>
                <TableCell>{report.gem}</TableCell>
                <TableCell>
                    <Badge variant={severityVariant[report.severity]}>{report.severity}</Badge>
                </TableCell>
                <TableCell>
                    <Badge variant={statusVariant[report.status]}>{report.status}</Badge>
                </TableCell>
                <TableCell>{report.reason}</TableCell>
                <TableCell className="max-w-xs truncate">{report.content}</TableCell>
                <TableCell className="text-right">{report.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
