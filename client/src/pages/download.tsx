import { useEffect } from "react";
import { useRoute, Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Home, Lock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Purchase, PackageItem } from "@shared/schema";

// 5-pointed star SVG component
function ButtonStar({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
        fill="none"
        stroke="currentColor" 
        strokeWidth="2"
      />
    </svg>
  );
}

export default function DownloadPage() {
  const [match, params] = useRoute("/download/:token");
  const token = params?.token;

  const { data, isLoading, error } = useQuery<{
    purchase: Purchase;
    packageItems: PackageItem[];
  }>({
    queryKey: ['/api/download', token],
    enabled: !!token,
  });

  useEffect(() => {
    if (data?.purchase) {
      // Track download page access
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: "download_access",
          eventData: { purchaseId: data.purchase.id },
        }),
      }).catch(console.error);
    }
  }, [data]);

  if (!match || !token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Invalid Link</h1>
          <p className="text-muted-foreground mb-6">
            This download link is not valid. Please check your email for the correct link.
          </p>
          <Link href="/">
            <Button variant="outline" data-testid="button-home">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
        <Card className="max-w-4xl w-full p-8">
          <div className="space-y-4">
            <div className="h-8 bg-muted animate-pulse rounded w-1/3" />
            <div className="h-6 bg-muted animate-pulse rounded w-2/3" />
            <div className="h-32 bg-muted animate-pulse rounded mt-8" />
          </div>
        </Card>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <Lock className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            {error instanceof Error ? error.message : "This download link is invalid or has expired."}
          </p>
          <Link href="/">
            <Button variant="outline" data-testid="button-home">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const { purchase, packageItems } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 p-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold font-serif text-primary mb-2" data-testid="heading-download">
                Your King Jesus Meditation Package
              </h1>
              <p className="text-muted-foreground mb-3">
                Welcome, {purchase.name || 'friend'}! Your divine transformation package is ready.
              </p>
              <p className="text-sm text-muted-foreground">
                Download link sent to: <span className="font-semibold text-foreground">{purchase.email}</span>
              </p>
            </div>
          </div>
        </Card>

        {/* Package Items */}
        <Card className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <Download className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Download Your Content</h2>
          </div>

          {packageItems.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Package content is being prepared. Please check back soon or contact support.
            </p>
          ) : (
            <div className="space-y-4">
              {packageItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border hover-elevate"
                  data-testid={`download-item-${item.id}`}
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                    {item.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {item.description}
                      </p>
                    )}
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => window.open(item.contentUrl || '#', '_blank')}
                      data-testid={`button-download-${item.id}`}
                      disabled={!item.contentUrl}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download {item.name}
                    </Button>
                  </div>
                  <ButtonStar className="w-8 h-8 text-primary/50 flex-shrink-0" />
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 p-6 bg-accent/50 border border-primary/20 rounded-lg">
            <h3 className="font-bold mb-2">📧 Save This Page</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Bookmark this page or save the link from your email. You can access your downloads anytime.
            </p>
            <p className="text-sm text-muted-foreground">
              Need help? Contact us at support@travelingtoconciousness.com
            </p>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <Link href="/">
            <Button size="lg" variant="outline" data-testid="button-home">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
