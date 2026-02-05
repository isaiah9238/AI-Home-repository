import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BotMessageSquare } from "lucide-react";

export default function MentorshipPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full">
                    <BotMessageSquare className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="mt-4">AI Mentor</CardTitle>
                <CardDescription>This feature is coming soon. You'll be able to receive guidance from an experienced AI mentor.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Stay tuned for updates!</p>
            </CardContent>
        </Card>
    </div>
  );
}
