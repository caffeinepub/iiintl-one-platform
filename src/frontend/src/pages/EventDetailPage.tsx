import type { MLMEvent, TicketTier, TicketTierType } from "@/backend.d";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useBackend } from "@/hooks/useBackend";
import { Link, useParams } from "@tanstack/react-router";
import {
  Calendar,
  CheckCircle,
  Loader2,
  MapPin,
  Tag,
  Ticket,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const TIER_TYPE_COLORS: Record<TicketTierType, string> = {
  general: "bg-blue-100 text-blue-800",
  vip: "bg-purple-100 text-purple-800",
  earlyBird: "bg-green-100 text-green-800",
  vipPlus: "bg-yellow-100 text-yellow-800",
};

const STATUS_COLORS: Record<string, string> = {
  upcoming: "bg-blue-100 text-blue-800",
  active: "bg-green-100 text-green-800",
  past: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

const MOCK_EVENT: MLMEvent = {
  id: 1n,
  title: "Global Leadership Summit 2026",
  description:
    "The premier annual gathering of IIIntl One Platform leaders, ambassadors, and founders from over 60 countries. Featuring keynote speakers, workshops on civic technology, and exclusive networking sessions. Earn commissions for every ticket you help sell.",
  location: "Geneva, Switzerland",
  eventDate: BigInt(new Date("2026-06-15").getTime()) * 1_000_000n,
  status: "upcoming",
  imageUrl: null,
  currency: "USD",
  totalRevenueCents: 0n,
  createdAt: BigInt(Date.now()) * 1_000_000n,
  createdBy: "system",
};

const MOCK_TIERS: TicketTier[] = [
  {
    id: 1n,
    eventId: 1n,
    name: "General Admission",
    tierType: "general",
    priceCents: 19900n,
    currency: "USD",
    capacity: 500n,
    sold: 127n,
    commissionBasisPoints: 500n,
  },
  {
    id: 2n,
    eventId: 1n,
    name: "VIP Access",
    tierType: "vip",
    priceCents: 49900n,
    currency: "USD",
    capacity: 100n,
    sold: 43n,
    commissionBasisPoints: 800n,
  },
  {
    id: 3n,
    eventId: 1n,
    name: "Early Bird",
    tierType: "earlyBird",
    priceCents: 14900n,
    currency: "USD",
    capacity: 200n,
    sold: 200n,
    commissionBasisPoints: 600n,
  },
];

function formatEventDate(ts: bigint): string {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function EventDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const backend = useBackend();

  const [event, setEvent] = useState<MLMEvent | null>(null);
  const [tiers, setTiers] = useState<TicketTier[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<bigint | null>(null);
  const [referrerCode, setReferrerCode] = useState("");
  const [purchasing, setPurchasing] = useState(false);
  const [purchasedId, setPurchasedId] = useState<bigint | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        if (backend && id) {
          const eventId = BigInt(id);
          const [ev, ts] = await Promise.all([
            backend.getMLMEvent(eventId),
            backend.listEventTicketTiers(eventId),
          ]);
          setEvent(ev ?? MOCK_EVENT);
          setTiers(ts.length > 0 ? ts : MOCK_TIERS);
        } else {
          setEvent(MOCK_EVENT);
          setTiers(MOCK_TIERS);
        }
      } catch {
        setEvent(MOCK_EVENT);
        setTiers(MOCK_TIERS);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [backend, id]);

  async function handlePurchase() {
    if (!backend || !selectedTier || !event) return;
    setPurchasing(true);
    try {
      const ticketId = await backend.purchaseTicket(
        event.id,
        selectedTier,
        referrerCode || null,
      );
      setPurchasedId(ticketId);
      toast.success("Ticket purchased!");
    } catch {
      toast.error("Purchase failed. Please try again.");
    } finally {
      setPurchasing(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Skeleton className="mb-6 h-56 rounded-2xl" />
        <Skeleton className="mb-4 h-8 w-64" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-24 text-center text-muted-foreground">
        Event not found.
      </div>
    );
  }

  if (purchasedId !== null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md rounded-2xl border bg-card p-10 text-center shadow-lg"
          data-ocid="purchase.success_state"
        >
          <CheckCircle size={48} className="mx-auto mb-4 text-emerald-500" />
          <h2 className="mb-2 text-xl font-bold">Ticket Purchased!</h2>
          <p className="mb-2 text-sm text-muted-foreground">
            Ticket ID:{" "}
            <span className="font-mono font-bold">#{String(purchasedId)}</span>
          </p>
          <p className="mb-6 text-sm text-muted-foreground">
            Your ticket has been added to your account.
          </p>
          <Link to="/my-tickets">
            <Button data-ocid="purchase.primary_button">View My Tickets</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 px-6 py-16 text-white">
        <div className="relative mx-auto max-w-4xl">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${STATUS_COLORS[event.status]}`}
            >
              {event.status}
            </span>
          </div>
          <h1 className="mb-4 text-3xl font-bold leading-tight">
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-slate-300">
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {formatEventDate(event.eventDate)}
            </span>
            {event.location && (
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {event.location}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Description */}
          <div className="lg:col-span-2">
            <h2 className="mb-3 text-lg font-semibold">About This Event</h2>
            <p className="leading-relaxed text-muted-foreground">
              {event.description}
            </p>
          </div>

          {/* Purchase panel */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Get Tickets</h2>
            {tiers.map((tier) => {
              const soldOut = tier.sold >= tier.capacity;
              const pct =
                tier.capacity > 0n
                  ? Math.round(
                      (Number(tier.sold) / Number(tier.capacity)) * 100,
                    )
                  : 0;
              const commission = Number(tier.commissionBasisPoints) / 100;
              return (
                <Card
                  key={String(tier.id)}
                  className={`cursor-pointer transition-all ${
                    selectedTier === tier.id
                      ? "border-primary ring-2 ring-primary/30"
                      : "hover:border-primary/50"
                  } ${soldOut ? "opacity-60" : ""}`}
                  onClick={() => !soldOut && setSelectedTier(tier.id)}
                  data-ocid={`ticket.item.${Number(tier.id)}`}
                >
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <div>
                        <p className="font-semibold">{tier.name}</p>
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            TIER_TYPE_COLORS[tier.tierType]
                          }`}
                        >
                          {tier.tierType}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">
                          ${(Number(tier.priceCents) / 100).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tier.currency}
                        </p>
                      </div>
                    </div>
                    <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                      <span>
                        {String(tier.sold)} / {String(tier.capacity)} sold
                      </span>
                      {soldOut && (
                        <span className="text-red-500 font-medium">
                          Sold Out
                        </span>
                      )}
                    </div>
                    <Progress value={pct} className="mb-2 h-1.5" />
                    <div className="flex items-center gap-1 text-xs text-emerald-600">
                      <Tag size={10} />
                      Earn {commission}% commission when you share
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {/* Referrer code */}
            <div>
              <Label className="mb-1 block text-xs">
                Referral Code (optional)
              </Label>
              <Input
                placeholder="Enter referral code"
                value={referrerCode}
                onChange={(e) => setReferrerCode(e.target.value)}
                data-ocid="ticket.input"
              />
            </div>

            <Button
              className="w-full"
              disabled={!selectedTier || purchasing}
              onClick={handlePurchase}
              data-ocid="ticket.submit_button"
            >
              {purchasing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Ticket size={15} className="mr-2" />
              {purchasing ? "Processing..." : "Buy Ticket"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
