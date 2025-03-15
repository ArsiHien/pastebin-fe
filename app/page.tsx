import { PasteCreator } from "@/components/paste-creator";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 flex justify-between items-center">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold tracking-tight mb-2">PasteBin</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Share code snippets, notes, and text easily with our modern
              pastebin service. Create a paste, get a link, and share it with
              anyone.
            </p>
          </div>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </header>

        <div className="max-w-3xl mx-auto">
          <PasteCreator />
        </div>
      </div>
    </div>
  );
}
