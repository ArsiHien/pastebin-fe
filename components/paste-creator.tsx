"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { createPaste } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"

export function PasteCreator() {
  const [content, setContent] = useState("")
  const [expiration, setExpiration] = useState("never")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pasteUrl, setPasteUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Paste content cannot be empty",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const result = await createPaste(content, expiration)
      setPasteUrl(`${window.location.origin}/paste/${result.id}`)
      toast({
        title: "Success!",
        description: "Your paste has been created",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create paste. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = () => {
    if (pasteUrl) {
      navigator.clipboard.writeText(pasteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      })
    }
  }

  const resetForm = () => {
    setContent("")
    setExpiration("never")
    setPasteUrl(null)
  }

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
              <SelectItem value="10m">10 Minutes</SelectItem>
              <SelectItem value="1h">1 Hour</SelectItem>
              <SelectItem value="1d">1 Day</SelectItem>
              <SelectItem value="1w">1 Week</SelectItem>
              <SelectItem value="1m">1 Month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {pasteUrl && (
          <div className="p-4 bg-muted rounded-md flex items-center justify-between">
            <span className="text-sm font-medium truncate">{pasteUrl}</span>
            <Button size="sm" variant="ghost" onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {pasteUrl ? (
          <>
            <Button variant="outline" onClick={resetForm}>
              Create New Paste
            </Button>
            <Button onClick={copyToClipboard}>{copied ? "Copied!" : "Copy Link"}</Button>
          </>
        ) : (
          <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting || !content.trim()}>
            {isSubmitting ? "Creating..." : "Create Paste"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

