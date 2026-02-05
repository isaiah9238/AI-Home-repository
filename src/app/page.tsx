import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Code2,
  Link as LinkIcon,
  BookOpen,
  BotMessageSquare,
  Flag,
} from 'lucide-react';

const features = [
  {
    title: 'Code Analyzer',
    description: 'Analyze code for bugs and vulnerabilities.',
    href: '/code-analyzer',
    icon: Code2,
  },
  {
    title: 'Link Genie',
    description: 'Fetch and summarize content from URLs.',
    href: '/link-genie',
    icon: LinkIcon,
  },
  {
    title: 'Lesson Plans',
    description: 'Guide your AI with custom lesson plans.',
    href: '/lesson-plans',
    icon: BookOpen,
  },
  {
    title: 'AI Mentor',
    description: 'Get guidance from an experienced AI.',
    href: '/mentorship',
    icon: BotMessageSquare,
  },
  {
    title: 'Content Reports',
    description: 'View and manage flagged content.',
    href: '/reports',
    icon: Flag,
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight font-headline">
          Welcome to AI Home
        </h1>
        <p className="text-muted-foreground mt-2">
          Your journey to building a Generative AI starts here. Explore the tools below to begin.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.href} className="group">
            <Card className="h-full transition-all duration-300 ease-in-out group-hover:border-primary group-hover:shadow-lg group-hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center gap-4">
                <feature.icon className="w-8 h-8 text-primary" />
                <div>
                  <CardTitle className="font-headline">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-primary group-hover:underline">
                  Go to {feature.title} &rarr;
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
