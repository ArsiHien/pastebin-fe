"use client"

import { useState } from "react"
import { AlertTriangle, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface BurnAfterReadWarningProps {
  onConfirm: () => void
}

export function BurnAfterReadWarning({ onConfirm }: BurnAfterReadWarningProps) {
  const [isConfirming, setIsConfirming] = useState(false)

  const handleConfirm = () => {
    setIsConfirming(true)
    onConfirm()
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
            <Flame className="h-8 w-8 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
        <CardTitle className="text-2xl">Burn After Read Paste</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert
          variant="destructive"
          className="border-amber-500 bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300"
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This paste will be permanently deleted after you view it. You will not be able to access it again.
          </AlertDescription>
        </Alert>

        <div className="text-center text-muted-foreground">
          <p>This paste was created with "Burn After Read" protection.</p>
          <p>
            Once you click "View Paste", the content will be displayed and then permanently deleted from our servers.
          </p>
          <p className="mt-2 font-semibold">Make sure to save the content if you need it!</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={handleConfirm} disabled={isConfirming} className="bg-amber-600 hover:bg-amber-700 text-white">
          {isConfirming ? "Loading..." : "View Paste"}
        </Button>
      </CardFooter>
    </Card>
  )
}

