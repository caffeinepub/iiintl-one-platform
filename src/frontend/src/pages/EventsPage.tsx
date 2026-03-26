import type { EventStatus, MLMEvent } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { useBackend } from "@/hooks/useBackend";
import { Link } from "@tanstack/react-router";
import {
  Calendar,
  ChevronDown,
  Loader2,
  MapPin,
  Plus,
  Ticket,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const STATUS_COLORS: Record<EventStatus, string> = {
  upcoming: "bg-blue-100 text-blue-800",
  active: "bg-green-100 text-green-800",
  past: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

const MOCK_EVENTS: MLMEvent[] = [
  {
    id: 1n,
    title: "Global Leadership Summit 2026",
    description:
      "Annual gathering of platform leaders and ambassadors from around the world.",
    location: "Geneva, Switzerland",
    eventDate: BigInt(new Date("2026-06-15").getTime()) * 1_000_000n,
    status: "upcoming",
    imageUrl: null,
    currency: "USD",
    totalRevenueCents: 0n,
    createdAt: BigInt(Date.now()) * 1_000_000n,
    createdBy: "system",
  },
  {
    id: 2n,
    title: "FinFracFran™ Founders Retreat",
    description:
      "Exclusive retreat for Founder-tier members to shape the platform's economic future.",
    location: "Davos, Switzerland",
    eventDate: BigInt(new Date("2026-08-20").getTime()) * 1_000_000n,
    status: "upcoming",
    imageUrl: null,
    currency: "USD",
    totalRevenueCents: 0n,
    createdAt: BigInt(Date.now()) * 1_000_000n,
    createdBy: "system",
  },
  {
    id: 3n,
    title: "Civic Tech Innovation Conference",
    description:
      "Exploring the intersection of civic engagement and blockchain technology.",
    location: "Berlin, Germany",
    eventDate: BigInt(new Date("2026-03-10").getTime()) * 1_000_000n,
    status: "past",
    imageUrl: null,
    currency: "USD",
    totalRevenueCents: 485000n,
    createdAt: BigInt(Date.now()) * 1_000_000n,
    createdBy: "system",
  },
];

function formatEventDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function EventGradient({ id }: { id: bigint }) {
  const gradients = [
    "from-blue-600 to-indigo-700",
    "from-purple-600 to-pink-700",
    "from-teal-600 to-cyan-700",
    "from-orange-500 to-red-600",
    "from-emerald-500 to-teal-600",
  ];
  const idx = Number(id) % gradients.length;
  return (
    <div
      className={`flex h-40 w-full items-center justify-center rounded-t-xl bg-gradient-to-br ${gradients[idx]}`}
    >
      <Ticket size={40} className="text-white/70" />
    </div>
  );
}

export function EventsPage() {
  const backend = useBackend();
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState<MLMEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | EventStatus>("all");
  const [hostOpen, setHostOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    eventDate: "",
    currency: "USD",
    imageUrl: "",
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        if (backend) {
          const result = await backend.listMLMEvents();
          setEvents(result.length > 0 ? result : MOCK_EVENTS);
        } else {
          setEvents(MOCK_EVENTS);
        }
      } catch {
        setEvents(MOCK_EVENTS);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [backend]);

  async function handleCreate() {
    if (!backend || !form.title || !form.eventDate) return;
    setSubmitting(true);
    try {
      const ts = BigInt(new Date(form.eventDate).getTime()) * 1_000_000n;
      await backend.createMLMEvent(
        form.title,
        form.description,
        form.location,
        ts,
        form.currency,
        form.imageUrl || null,
      );
      toast.success("Event created successfully!");
      setForm({
        title: "",
        description: "",
        location: "",
        eventDate: "",
        currency: "USD",
        imageUrl: "",
      });
      setHostOpen(false);
      const result = await backend.listMLMEvents();
      setEvents(result);
    } catch {
      toast.error("Failed to create event.");
    } finally {
      setSubmitting(false);
    }
  }

  const filtered =
    filter === "all" ? events : events.filter((e) => e.status === filter);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold">Events</h1>
          <p className="text-sm text-muted-foreground">
            Attend exclusive events, purchase tickets, and earn commissions
          </p>
        </motion.div>

        {/* Filter bar */}
        <div className="mb-6 flex gap-2" data-ocid="events.tab">
          {(["all", "upcoming", "active", "past"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize"
            >
              {f}
            </Button>
          ))}
        </div>

        {/* Host event */}
        {isAuthenticated && (
          <Collapsible
            open={hostOpen}
            onOpenChange={setHostOpen}
            className="mb-6"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="mb-3"
                data-ocid="events.open_modal_button"
              >
                <Plus size={15} className="mr-2" />
                Host an Event
                <ChevronDown
                  size={14}
                  className={`ml-2 transition-transform ${hostOpen ? "rotate-180" : ""}`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="mb-4">
                <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <Label className="mb-1 block text-xs">Event Title *</Label>
                    <Input
                      placeholder="e.g. Annual Leadership Summit"
                      value={form.title}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, title: e.target.value }))
                      }
                      data-ocid="events.input"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="mb-1 block text-xs">Description</Label>
                    <Textarea
                      placeholder="Describe the event..."
                      value={form.description}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, description: e.target.value }))
                      }
                      data-ocid="events.textarea"
                    />
                  </div>
                  <div>
                    <Label className="mb-1 block text-xs">Location</Label>
                    <Input
                      placeholder="City, Country"
                      value={form.location}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, location: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label className="mb-1 block text-xs">Event Date *</Label>
                    <Input
                      type="date"
                      value={form.eventDate}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, eventDate: e.target.value }))
                      }
                    />
                  </div>
                  <div>
                    <Label className="mb-1 block text-xs">Currency</Label>
                    <Select
                      value={form.currency}
                      onValueChange={(v) =>
                        setForm((p) => ({ ...p, currency: v }))
                      }
                    >
                      <SelectTrigger data-ocid="events.select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="ICP">ICP</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="mb-1 block text-xs">
                      Image URL (optional)
                    </Label>
                    <Input
                      placeholder="https://..."
                      value={form.imageUrl}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, imageUrl: e.target.value }))
                      }
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Button
                      onClick={handleCreate}
                      disabled={submitting || !form.title || !form.eventDate}
                      data-ocid="events.submit_button"
                    >
                      {submitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Create Event
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Event grid */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="py-16 text-center text-muted-foreground"
            data-ocid="events.empty_state"
          >
            No events found for the selected filter.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event, i) => (
              <motion.div
                key={String(event.id)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                data-ocid={`events.item.${i + 1}`}
              >
                <Link
                  to={`/events/${String(event.id)}` as any}
                  className="block"
                >
                  <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                    {event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="h-40 w-full object-cover"
                      />
                    ) : (
                      <EventGradient id={event.id} />
                    )}
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <h3 className="line-clamp-2 font-semibold leading-snug">
                          {event.title}
                        </h3>
                        <span
                          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[event.status]}`}
                        >
                          {event.status}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar size={11} />
                          {formatEventDate(event.eventDate)}
                        </p>
                        {event.location && (
                          <p className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin size={11} />
                            {event.location}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
