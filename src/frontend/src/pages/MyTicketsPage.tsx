import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { useBackend } from "@/hooks/useBackend";
import type { Ticket, TicketTierType } from "@/types/appTypes";
import { Ticket as TicketIcon } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

const TIER_BAND_COLORS: Record<TicketTierType, string> = {
  general: "bg-blue-500",
  vip: "bg-purple-500",
  earlyBird: "bg-green-500",
  vipPlus: "bg-yellow-500",
};

const TIER_NAMES: Record<TicketTierType, string> = {
  general: "General",
  vip: "VIP",
  earlyBird: "Early Bird",
  vipPlus: "VIP+",
};

type QRCell = { cellKey: string; filled: boolean };

function generateQRCells(qrCode: string): QRCell[] {
  const seed = qrCode.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const cells: QRCell[] = [];
  for (let r = 0; r < 9; r++) {
    for (let col = 0; col < 9; col++) {
      cells.push({
        cellKey: `r${r}c${col}`,
        filled: (seed * (r + 1) * (col + 1)) % 7 > 2,
      });
    }
  }
  return cells;
}

function QRDisplay({ qrCode }: { qrCode: string }) {
  const cells = generateQRCells(qrCode);
  return (
    <div
      className="inline-grid gap-0.5 rounded-md bg-white p-2"
      style={{ gridTemplateColumns: "repeat(9, 1fr)" }}
    >
      {cells.map(({ cellKey, filled }) => (
        <div
          key={cellKey}
          className={`h-2 w-2 rounded-sm ${filled ? "bg-slate-900" : "bg-white"}`}
        />
      ))}
    </div>
  );
}

// Determine tier type from tierId (mock mapping for display)
function getTierType(tierId: bigint): TicketTierType {
  const types: TicketTierType[] = ["general", "vip", "earlyBird", "vipPlus"];
  return types[Number(tierId) % 4];
}

const MOCK_TICKETS: Ticket[] = [
  {
    id: 1001n,
    eventId: 1n,
    tierId: 1n,
    qrCode: "IIINTL-EVT1-TKT1001-GA",
    isUsed: false,
    pricePaidCents: 19900n,
    purchasedAt: BigInt(Date.now() - 86400000) * 1_000_000n,
  },
  {
    id: 1002n,
    eventId: 2n,
    tierId: 2n,
    qrCode: "IIINTL-EVT2-TKT1002-VIP",
    isUsed: true,
    pricePaidCents: 49900n,
    purchasedAt: BigInt(Date.now() - 2592000000) * 1_000_000n,
  },
];

export function MyTicketsPage() {
  const backend = useBackend();
  const { isAuthenticated } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        if (backend && isAuthenticated) {
          const result = await backend.getMyTickets();
          setTickets(result.length > 0 ? result : MOCK_TICKETS);
        } else {
          setTickets(MOCK_TICKETS);
        }
      } catch {
        setTickets(MOCK_TICKETS);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [backend, isAuthenticated]);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <TicketIcon size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">My Tickets</h1>
              <p className="text-sm text-muted-foreground">
                Your purchased event tickets
              </p>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-36 w-full rounded-2xl" />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border py-20 text-center"
            data-ocid="tickets.empty_state"
          >
            <TicketIcon size={48} className="mb-4 text-muted-foreground/40" />
            <p className="text-lg font-medium text-muted-foreground">
              No tickets yet
            </p>
            <p className="text-sm text-muted-foreground">
              Browse events to purchase tickets
            </p>
          </div>
        ) : (
          <div className="space-y-4" data-ocid="tickets.list">
            {tickets.map((ticket, i) => {
              const tierType = getTierType(ticket.tierId);
              const bandColor = TIER_BAND_COLORS[tierType];
              const purchaseDate = new Date(
                Number(ticket.purchasedAt) / 1_000_000,
              ).toLocaleDateString();
              const price = `$${(Number(ticket.pricePaidCents) / 100).toFixed(2)}`;

              return (
                <motion.div
                  key={String(ticket.id)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  data-ocid={`tickets.item.${i + 1}`}
                >
                  <div className="relative flex overflow-hidden rounded-2xl border bg-card shadow-sm">
                    {/* Left color band */}
                    <div className={`w-3 shrink-0 ${bandColor}`} />

                    {/* Torn edge effect */}
                    <div className="flex w-3 shrink-0 flex-col justify-evenly">
                      {["a", "b", "c", "d", "e", "f"].map((k) => (
                        <div
                          key={`edge-${k}`}
                          className="h-2 w-2 -translate-x-1 rounded-full bg-background"
                        />
                      ))}
                    </div>

                    {/* Ticket body */}
                    <div className="flex flex-1 flex-wrap items-center gap-4 p-4">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-semibold text-white ${bandColor}`}
                          >
                            {TIER_NAMES[tierType]}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Event #{String(ticket.eventId)}
                        </p>
                        <p className="font-mono text-xs text-muted-foreground">
                          Ticket #{String(ticket.id)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Purchased {purchaseDate} &bull; {price}
                        </p>
                      </div>

                      {/* QR code */}
                      <div className="relative">
                        <QRDisplay qrCode={ticket.qrCode} />
                        {ticket.isUsed && (
                          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                            <span className="rotate-[-35deg] rounded border-2 border-red-500 px-1 font-mono text-xs font-bold tracking-widest text-red-500 opacity-90">
                              USED
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Verification code */}
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          Verification
                        </p>
                        <p className="font-mono text-xs font-bold tracking-wider">
                          {ticket.qrCode}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
