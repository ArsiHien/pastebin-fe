"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fetchPaste } from "@/lib/api-client";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { PasteStatistics } from "@/components/paste-statistics";
import { BurnAfterReadWarning } from "@/components/burn-after-read-warning";

export default function PastePage() {
  const params = useParams();
  const pasteId = params.id as string;

  const [paste, setPaste] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBurnWarning, setShowBurnWarning] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const loadPaste = async () => {
      try {
        setLoading(true);
        const data = await fetchPaste(pasteId);
        setPaste(data);

        // Check if it's a burn-after-read paste
        if (data.remainingTime === "BURN_AFTER_READ") {
          setShowBurnWarning(true);
        }
      } catch (err) {
        setError("Failed to load paste");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPaste();
  }, [pasteId]);

  const handleConfirmBurn = () => {
    setConfirmed(true);
    setShowBurnWarning(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading paste...</p>
        </div>
      </div>
    );
  }

  if (error || !paste) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Paste Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The paste you are looking for doesn't exist or has been removed.
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
    );
  }

  // Check if paste is expired (if remainingTime is "Expired")
  const isExpired = paste.remainingTime === "Expired";

  if (isExpired) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">This paste has expired</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The paste you are looking for has expired and is no longer
              available.
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
    );
  }

  // Show burn after read warning
  if (showBurnWarning && !confirmed) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 flex items-center justify-center p-4">
        <BurnAfterReadWarning onConfirm={handleConfirmBurn} />
      </div>
    );
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
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {paste.remainingTime === "NEVER"
                          ? "Never expires"
                          : paste.remainingTime === "BURN_AFTER_READ"
                          ? "Burn After Read"
                          : paste.remainingTime}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <pre className="p-4 overflow-x-auto font-mono text-sm bg-muted/50 dark:bg-muted/20 rounded-b-lg min-h-[300px]">
                  {paste.content}
                </pre>
              </CardContent>
            </Card>
          </div>

          <PasteStatistics
            pasteUrl={paste.url}
            totalViews={paste.totalViews}
            remainingTime={
              paste.remainingTime === "BURN_AFTER_READ"
                ? "After viewing"
                : paste.remainingTime
            }
          />
        </div>
      </div>
    </div>
  );
}
