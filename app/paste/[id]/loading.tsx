export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading paste...</p>
      </div>
    </div>
  );
}
