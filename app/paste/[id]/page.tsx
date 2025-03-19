"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchPasteContent, fetchPastePolicy } from "@/lib/api-client";
import Link from "next/link";
import { ArrowLeft, Copy, Check, Clock } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { BurnAfterReadWarning } from "@/components/burn-after-read-warning";
import { PasteStatsDialog } from "@/components/paste-stats-dialog";
import { useToast } from "@/hooks/use-toast";

export default function PastePage() {
  const params = useParams();
  const pasteId = params.id as string;
  const { toast } = useToast();

  const [pasteData, setPasteData] = useState<{
    url: string;
    content: string;
    remainingTime: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBurnWarning, setShowBurnWarning] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load paste policy first to check if it's a burn-after-read paste
  useEffect(() => {
    const checkPastePolicy = async () => {
      try {
        setLoading(true);

        // First, fetch just the policy (doesn't mark as read)
        const policy = await fetchPastePolicy(pasteId);

        // Check if it's a burn-after-read paste
        if (policy === "BURN_AFTER_READ" && !confirmed) {
          setShowBurnWarning(true);
          // Set minimal paste data for the warning screen
          setPasteData({
            url: pasteId,
            content: "",
            remainingTime: policy,
          });
          setLoading(false);
          return;
        }

        // If not burn-after-read or already confirmed, load the actual content
        await loadActualContent();
      } catch (err) {
        setError("Failed to load paste");
        console.error(err);
        setLoading(false);
      }
    };

    checkPastePolicy();
  }, [pasteId]);

  // Load the actual content (marks as read)
  const loadActualContent = async () => {
    try {
      setLoading(true);
      const data = await fetchPasteContent(pasteId);
      setPasteData(data);
    } catch (err) {
      setError("Failed to load paste");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBurn = async () => {
    setConfirmed(true);
    setShowBurnWarning(false);
    // Now load the actual content which will mark it as read
    await loadActualContent();
  };

  const copyToClipboard = () => {
    if (pasteData?.content) {
      navigator.clipboard.writeText(pasteData.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      });
    }
  };

  // Format the remaining time for display
  const formatRemainingTime = (time: string) => {
    if (time === "NEVER") return "Never";
    if (time === "BURN_AFTER_READ") return "After viewing";
    return time;
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

  if (error || pasteData === null) {
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
          <CardContent>
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Create a new paste
              </Button>
            </Link>
          </CardContent>
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

  const isBurnAfterRead = pasteData.remainingTime === "BURN_AFTER_READ";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/">
            <Button variant="ghost" className="gap-2 pl-0">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Button>
          </Link>
          <ThemeToggle />
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">
                  Paste: {pasteData.url}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {isBurnAfterRead ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Expires: After viewing</span>
                    </div>
                  ) : (
                    <PasteStatsDialog
                      pasteUrl={pasteData.url}
                      remainingTime={pasteData.remainingTime}
                    />
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                    className="hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    <span className="sr-only">Copy content</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <pre className="p-6 overflow-x-auto font-mono text-lg bg-muted/50 dark:bg-muted/20 rounded-b-lg min-h-[400px]">
                {pasteData.content}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
