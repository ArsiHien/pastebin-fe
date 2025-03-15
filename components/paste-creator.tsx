"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createPaste } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

export function PasteCreator() {
  const [content, setContent] = useState("");
  const [expiration, setExpiration] = useState("never");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pasteUrl, setPasteUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Paste content cannot be empty",
        variant: "destructive",
      });
      return;
    }

    let policyType: "TIMED" | "NEVER" | "BURN_AFTER_READ";
    let duration: string | null = null;

    if (expiration === "never") {
      policyType = "NEVER";
    } else if (expiration === "burn") {
      policyType = "BURN_AFTER_READ";
    } else {
      policyType = "TIMED";
      duration = expiration;
    }

    setIsSubmitting(true);
    try {
      const result = await createPaste({ content, policyType, duration });
      setPasteUrl(`${window.location.origin}/paste/${result.id}`);
      toast({
        title: "Success!",
        description: "Your paste has been created",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create paste. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create a New Paste</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="content">Paste Content</Label>
          <Textarea
            id="content"
            placeholder="Enter your code or text here..."
            className="min-h-[300px] font-mono resize-y"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expiration">Expiration</Label>
          <Select value={expiration} onValueChange={setExpiration}>
            <SelectTrigger id="expiration">
              <SelectValue placeholder="Select expiration time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Never</SelectItem>
              <SelectItem value="burn">Burn After Read</SelectItem>
              <SelectItem value="10minutes">10 Minutes</SelectItem>
              <SelectItem value="1hour">1 Hour</SelectItem>
              <SelectItem value="1day">1 Day</SelectItem>
              <SelectItem value="1week">1 Week</SelectItem>
              <SelectItem value="2weeks">2 Weeks</SelectItem>
              <SelectItem value="1month">1 Month</SelectItem>
              <SelectItem value="6months">6 Months</SelectItem>
              <SelectItem value="1year">1 Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {pasteUrl && (
          <div className="p-4 bg-muted rounded-md flex items-center justify-between">
            <span className="text-sm font-medium truncate">{pasteUrl}</span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigator.clipboard.writeText(pasteUrl)}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {pasteUrl ? (
          <>
            <Button variant="outline" onClick={() => setPasteUrl(null)}>
              Create New Paste
            </Button>
            <Button onClick={() => navigator.clipboard.writeText(pasteUrl)}>
              {copied ? "Copied!" : "Copy Link"}
            </Button>
          </>
        ) : (
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={isSubmitting || !content.trim()}
          >
            {isSubmitting ? "Creating..." : "Create Paste"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
