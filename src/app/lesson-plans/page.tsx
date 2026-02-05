import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function LessonPlansPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <div className="mx-auto bg-primary/10 p-3 rounded-full">
                    <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="mt-4">Lesson Plans</CardTitle>
                <CardDescription>This feature is coming soon. You'll be able to provide lesson plans to guide your AI's learning journey.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Stay tuned for updates!</p>
            </CardContent>
        </Card>
    </div>
  );
}
