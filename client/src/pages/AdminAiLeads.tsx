import { useMemo, useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import {
  Bot,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Trash2,
  UserCheck,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { trpc } from "@/lib/trpc";

const LEAD_STATUSES = [
  "new",
  "contacted",
  "qualified",
  "booked",
  "won",
  "lost",
  "spam",
] as const;

type LeadStatus = (typeof LEAD_STATUSES)[number];

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  contacted: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  qualified: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  booked: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  won: "bg-green-600 text-white hover:bg-green-600",
  lost: "bg-gray-200 text-gray-700 hover:bg-gray-200",
  spam: "bg-red-100 text-red-800 hover:bg-red-100",
};

type TranscriptMessage = { role: string; content: string };

function parseTranscript(json: string | null): TranscriptMessage[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is TranscriptMessage =>
        item && typeof item.content === "string" && typeof item.role === "string"
    );
  } catch {
    return [];
  }
}

export default function AdminAiLeads() {
  const { user, loading, isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const isAdmin = isAuthenticated && user?.role === "admin";

  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [contactedOnly, setContactedOnly] = useState(false);
  const [openLeadId, setOpenLeadId] = useState<number | null>(null);

  const { data: leads, isLoading: leadsLoading } =
    trpc.aiAgent.getAllLeads.useQuery(
      {
        status: statusFilter === "all" ? undefined : statusFilter,
        contactedOnly: contactedOnly || undefined,
        limit: 200,
      },
      { enabled: isAdmin }
    );

  const { data: stats } = trpc.aiAgent.getLeadStats.useQuery(undefined, {
    enabled: isAdmin,
  });

  const updateLead = trpc.aiAgent.updateLead.useMutation({
    onSuccess: () => {
      toast.success("Lead updated");
      utils.aiAgent.getAllLeads.invalidate();
      utils.aiAgent.getLeadStats.invalidate();
    },
    onError: error => toast.error(error.message || "Failed to update lead"),
  });

  const deleteLead = trpc.aiAgent.deleteLead.useMutation({
    onSuccess: () => {
      toast.success("Lead deleted");
      setOpenLeadId(null);
      utils.aiAgent.getAllLeads.invalidate();
      utils.aiAgent.getLeadStats.invalidate();
    },
    onError: error => toast.error(error.message || "Failed to delete lead"),
  });

  const openLead = useMemo(
    () => leads?.find(lead => lead.id === openLeadId) ?? null,
    [leads, openLeadId]
  );

  const transcript = useMemo(
    () => parseTranscript(openLead?.conversationJson ?? null),
    [openLead]
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to view AI chat leads.
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/images/logo.png"
              alt="Critzer's Cabinets"
              className="size-8"
            />
            <span className="text-xl font-bold">Critzer's Cabinets</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                Admin Panel
              </Button>
            </Link>
            <span className="hidden text-sm text-muted-foreground sm:inline">
              Admin: {user?.name || user?.email}
            </span>
          </div>
        </div>
      </header>

      <div className="container space-y-8 py-8">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold">
            <Bot className="size-7 text-primary" />
            AI Chat Leads
          </h1>
          <p className="text-muted-foreground">
            Conversations captured by the website design assistant
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Conversations"
            value={stats?.total ?? 0}
            hint="All time"
            icon={<MessageSquare className="size-4 text-muted-foreground" />}
          />
          <StatCard
            title="With Contact Info"
            value={stats?.withContact ?? 0}
            hint="Ready to follow up"
            icon={<UserCheck className="size-4 text-muted-foreground" />}
          />
          <StatCard
            title="Awaiting Follow-Up"
            value={stats?.newLeads ?? 0}
            hint="Status: new"
            icon={<Phone className="size-4 text-muted-foreground" />}
          />
          <StatCard
            title="Last 7 Days"
            value={stats?.last7Days ?? 0}
            hint="New conversations"
            icon={<Bot className="size-4 text-muted-foreground" />}
          />
        </div>

        <Card>
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Captured Leads</CardTitle>
              <CardDescription>
                Click a row to read the full conversation
              </CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={contactedOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setContactedOnly(value => !value)}
              >
                Contactable only
              </Button>
              <Select
                value={statusFilter}
                onValueChange={value =>
                  setStatusFilter(value as LeadStatus | "all")
                }
              >
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {LEAD_STATUSES.map(status => (
                    <SelectItem key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {leadsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="size-8 animate-spin text-primary" />
              </div>
            ) : leads && leads.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contact</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Timeline</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map(lead => (
                      <TableRow
                        key={lead.id}
                        className="cursor-pointer"
                        onClick={() => setOpenLeadId(lead.id)}
                      >
                        <TableCell>
                          <div className="font-medium">
                            {lead.name || (
                              <span className="text-muted-foreground">
                                Anonymous
                              </span>
                            )}
                          </div>
                          <div className="space-y-0.5 text-xs text-muted-foreground">
                            {lead.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="size-3" />
                                {lead.email}
                              </div>
                            )}
                            {lead.phone && (
                              <div className="flex items-center gap-1">
                                <Phone className="size-3" />
                                {lead.phone}
                              </div>
                            )}
                            {!lead.email && !lead.phone && (
                              <span>No contact info yet</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[180px]">
                          <div className="truncate capitalize">
                            {lead.projectType || "—"}
                          </div>
                          {lead.estimateRange && (
                            <div className="text-xs text-muted-foreground">
                              Quoted {lead.estimateRange}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{lead.budgetRange || "—"}</TableCell>
                        <TableCell>{lead.timeline || "—"}</TableCell>
                        <TableCell className="whitespace-nowrap text-sm">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell onClick={event => event.stopPropagation()}>
                          <Select
                            value={lead.status}
                            onValueChange={value =>
                              updateLead.mutate({
                                id: lead.id,
                                updates: { status: value as LeadStatus },
                              })
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {LEAD_STATUSES.map(status => (
                                <SelectItem key={status} value={status}>
                                  {status.charAt(0).toUpperCase() +
                                    status.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell
                          className="text-right"
                          onClick={event => event.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Delete lead"
                            onClick={() => deleteLead.mutate({ id: lead.id })}
                          >
                            <Trash2 className="size-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                No AI chat leads yet. Conversations will appear here as visitors
                use the chat widget.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={openLeadId !== null}
        onOpenChange={open => !open && setOpenLeadId(null)}
      >
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {openLead?.name || "Anonymous visitor"}
              {openLead?.status && (
                <Badge
                  className={`ml-2 align-middle ${STATUS_STYLES[openLead.status as LeadStatus]}`}
                >
                  {openLead.status}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              {openLead
                ? `Conversation started ${new Date(openLead.createdAt).toLocaleString()}`
                : ""}
            </DialogDescription>
          </DialogHeader>

          {openLead && (
            <div className="space-y-5">
              <div className="grid gap-3 rounded-lg border bg-muted/40 p-4 text-sm sm:grid-cols-2">
                <DetailRow label="Email" value={openLead.email} />
                <DetailRow label="Phone" value={openLead.phone} />
                <DetailRow label="Project" value={openLead.projectType} />
                <DetailRow label="Room size" value={openLead.roomSize} />
                <DetailRow label="Style" value={openLead.stylePreference} />
                <DetailRow label="Budget" value={openLead.budgetRange} />
                <DetailRow label="Timeline" value={openLead.timeline} />
                <DetailRow
                  label="Ballpark given"
                  value={openLead.estimateRange}
                />
                <DetailRow
                  label="Wants"
                  value={openLead.appointmentPreference}
                />
              </div>

              {openLead.notes && (
                <div>
                  <h3 className="mb-1.5 text-sm font-semibold">Summary</h3>
                  <p className="text-sm text-muted-foreground">
                    {openLead.notes}
                  </p>
                </div>
              )}

              <div>
                <h3 className="mb-2 text-sm font-semibold">Transcript</h3>
                {transcript.length > 0 ? (
                  <div className="space-y-2">
                    {transcript.map((message, index) => (
                      <div
                        key={index}
                        className={
                          message.role === "user"
                            ? "flex justify-end"
                            : "flex justify-start"
                        }
                      >
                        <p
                          className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          {message.content}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No messages recorded.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2 border-t pt-4">
                {openLead.email && (
                  <a href={`mailto:${openLead.email}`}>
                    <Button size="sm" variant="outline">
                      <Mail className="size-4" />
                      Email
                    </Button>
                  </a>
                )}
                {openLead.phone && (
                  <a href={`tel:${openLead.phone.replace(/[^\d+]/g, "")}`}>
                    <Button size="sm" variant="outline">
                      <Phone className="size-4" />
                      Call
                    </Button>
                  </a>
                )}
                <Button
                  size="sm"
                  onClick={() =>
                    updateLead.mutate({
                      id: openLead.id,
                      updates: { status: "contacted" },
                    })
                  }
                >
                  Mark contacted
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({
  title,
  value,
  hint,
  icon,
}: {
  title: string;
  value: number;
  hint: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div>
      <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm">{value || "—"}</span>
    </div>
  );
}
