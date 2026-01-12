import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Loader2, Users, FileText, TrendingUp, DollarSign } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  
  const { data: quotes, isLoading: quotesLoading } = trpc.quotes.getAll.useQuery(
    undefined,
    { enabled: isAuthenticated && user?.role === "admin" }
  );
  
  const { data: projects, isLoading: projectsLoading } = trpc.projects.getAll.useQuery(
    undefined,
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  const updateQuoteStatus = trpc.quotes.update.useMutation({
    onSuccess: () => {
      toast.success("Quote status updated");
      utils.quotes.getAll.invalidate();
    },
    onError: (error) => {
      toast.error("Failed to update quote");
      console.error(error);
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">Go to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = {
    totalQuotes: quotes?.length || 0,
    pendingQuotes: quotes?.filter((q) => q.status === "pending").length || 0,
    approvedQuotes: quotes?.filter((q) => q.status === "approved").length || 0,
    activeProjects: projects?.filter((p) => p.status !== "completed").length || 0,
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
            <Link href="/dashboard">
              <Button variant="outline" size="sm">
                My Dashboard
              </Button>
            </Link>
            <span className="text-sm text-muted-foreground">
              Admin: {user?.name || user?.email}
            </span>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="space-y-8">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">
              Manage quotes, leads, and projects
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalQuotes}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pendingQuotes}</div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approved</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.approvedQuotes}</div>
                <p className="text-xs text-muted-foreground">Ready to convert</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeProjects}</div>
                <p className="text-xs text-muted-foreground">In progress</p>
              </CardContent>
            </Card>
          </div>

          {/* Quotes Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Quote Requests</CardTitle>
              <CardDescription>
                Manage and review customer quote requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {quotesLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : quotes && quotes.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Room Type</TableHead>
                      <TableHead>Style</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quotes.map((quote) => (
                      <TableRow key={quote.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{quote.customerName}</div>
                            <div className="text-sm text-muted-foreground">
                              {quote.customerEmail}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{quote.roomType || "—"}</TableCell>
                        <TableCell>{quote.cabinetStyle || "—"}</TableCell>
                        <TableCell>
                          {new Date(quote.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={quote.status}
                            onValueChange={(value) => {
                              updateQuoteStatus.mutate({
                                id: quote.id,
                                updates: { status: value as any },
                              });
                            }}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="reviewed">Reviewed</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="declined">Declined</SelectItem>
                              <SelectItem value="converted">Converted</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No quotes yet
                </div>
              )}
            </CardContent>
          </Card>

          {/* Projects Table */}
          <Card>
            <CardHeader>
              <CardTitle>Active Projects</CardTitle>
              <CardDescription>
                Track ongoing cabinet projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              {projectsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : projects && projects.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Completion</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">
                          {project.projectName}
                        </TableCell>
                        <TableCell>
                          <Badge>{project.status}</Badge>
                        </TableCell>
                        <TableCell>
                          {project.finalPrice ? `$${project.finalPrice}` : "—"}
                        </TableCell>
                        <TableCell>
                          {project.actualStartDate
                            ? new Date(project.actualStartDate).toLocaleDateString()
                            : "—"}
                        </TableCell>
                        <TableCell>
                          {project.estimatedCompletionDate
                            ? new Date(project.estimatedCompletionDate).toLocaleDateString()
                            : "—"}
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  No active projects
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
