
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag"; 

export default async function Dashboard() {
  const morningBriefing = "Your application is temporarily running in a safe mode. Please use the file editor on the left to open the `.env` file and add your valid `GEMINI_API_KEY`. Let me know once you have saved the file.";
  const userInterests = ["Web Development", "Land Surveying", "Card Collecting", "ASL"];

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">
      <aside className="w-64 p-6 bg-gray-800 border-r border-gray-700">
        <h2 className="text-2xl font-bold mb-6 font-headline">Interests</h2>
        <div className="flex flex-wrap gap-3">
          {userInterests.map((interest) => (
            <Tag key={interest} text={interest} />
          ))}
        </div>
      </aside>
      <main className="flex-1 p-8">
        <section className="hero-section">
          <Card className="bg-black border-green-400 border-2 shadow-lg shadow-green-400/20">
            <CardHeader className="border-b border-green-400 p-4 flex flex-row items-center justify-between">
              <CardTitle className="font-mono text-lg text-green-400">user@cloudshell: ~</CardTitle>
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <pre className="whitespace-pre-wrap font-mono text-sm text-green-300">
                $ {morningBriefing}
              </pre>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
