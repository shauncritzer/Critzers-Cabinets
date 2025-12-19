import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Loader2, Plus, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

export default function Dashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const { data: quotes, isLoading: quotesLoading } = trpc.quotes.getMyQuotes.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  const { data: projects, isLoading: projectsLoading } = trpc.projects.getMyProjects.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to view your quotes and projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href={getLoginUrl()}>Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; icon: any }> = {
      pending: { variant: "secondary", icon: Clock },
      reviewed: { variant: "outline", icon: FileText },
      approved: { variant: "default", icon: CheckCircle },
      declined: { variant: "destructive", icon: XCircle },
      converted: { variant: "default", icon: CheckCircle },
    };

    const config = variants[status] || variants.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-primary"></div>
              <span className="text-xl font-bold">Critzer's Cabinets</span>
            </a>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user?.name || user?.email}
            </span>
            {user?.role === "admin" && (
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  Admin Panel
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Dashboard</h1>
              <p className="text-muted-foreground">
                View and manage your cabinet quotes and projects
              </p>
            </div>
            <Link href="/quote">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Quote Request
              </Button>
            </Link>
          </div>

          {/* Quotes Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">My Quotes</h2>
            {quotesLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : quotes && quotes.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {quotes.map((quote) => (
                  <Card key={quote.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {quote.roomType || "Cabinet Project"}
                          </CardTitle>
                          <CardDescription>
                            {new Date(quote.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        {getStatusBadge(quote.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {quote.cabinetStyle && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Style:</span>{" "}
                          <span className="font-medium">{quote.cabinetStyle}</span>
                        </div>
                      )}
                      {quote.woodType && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Wood:</span>{" "}
                          <span className="font-medium">{quote.woodType}</span>
                        </div>
                      )}
                      {quote.estimatedCost && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Estimate:</span>{" "}
                          <span className="font-medium text-primary">
                            ${quote.estimatedCost}
                          </span>
                        </div>
                      )}
                      <Button variant="outline" className="w-full mt-4">
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Quotes Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by requesting a quote for your cabinet project
                  </p>
                  <Link href="/quote">
                    <Button>Request a Quote</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Projects Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4">My Projects</h2>
            {projectsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : projects && projects.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {project.projectName}
                          </CardTitle>
                          <CardDescription>
                            {new Date(project.createdAt).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <Badge>{project.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {project.finalPrice && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Total:</span>{" "}
                          <span className="font-medium text-primary">
                            ${project.finalPrice}
                          </span>
                        </div>
                      )}
                      {project.estimatedCompletionDate && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Est. Completion:</span>{" "}
                          <span className="font-medium">
                            {new Date(project.estimatedCompletionDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <Button variant="outline" className="w-full mt-4">
                        View Project
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Active Projects</h3>
                  <p className="text-muted-foreground">
                    Your approved quotes will appear here as projects
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
