import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getPaste } from "@/lib/actions"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { PasteStatistics } from "@/components/paste-statistics"

interface PastePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PastePageProps): Promise<Metadata> {
  const paste = await getPaste(params.id)

  if (!paste) {
    return {
      title: "Paste Not Found",
    }
  }

  return {
    title: `Paste ${paste.url}`,
    description: `View paste with ${paste.totalViews} views`,
  }
}

export default async function PastePage({ params }: PastePageProps) {
  const paste = await getPaste(params.id)

  if (!paste) {
    notFound()
  }

  // Check if paste is expired (if remainingTime is "Expired")
  const isExpired = paste.remainingTime === "Expired"

  if (isExpired) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">This paste has expired</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The paste you are looking for has expired and is no longer available.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Create a new paste
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/">
            <Button variant="ghost" className="gap-2 pl-0">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Button>
          </Link>
          <ThemeToggle />
        </div>

        <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div>
            <Card>
              <CardHeader className="border-b">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl">Paste {paste.url}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <pre className="p-4 overflow-x-auto font-mono text-sm bg-muted/50 dark:bg-muted/20 rounded-b-lg min-h-[300px]">
                  {paste.content}
                </pre>
              </CardContent>
            </Card>
          </div>

          <PasteStatistics pasteUrl={paste.url} totalViews={paste.totalViews} remainingTime={paste.remainingTime} />
        </div>
      </div>
    </div>
  )
}

