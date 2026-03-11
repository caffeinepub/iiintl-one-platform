import { TransactionType } from "@/backend";
import { Layout } from "@/components/Layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CartItem, Order } from "@/context/CartContext";
import { loadOrders, useCart } from "@/context/CartContext";
import {
  convertFromICP,
  formatAmount,
  useWallet,
} from "@/context/WalletContext";
import { getOrderStatusBadgeClasses } from "@/data/mockData";
import { useActor } from "@/hooks/useActor";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle,
  CreditCard,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Store,
  Trash2,
  Truck,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

// ICP mock rate: 1 ICP = $8.50 USD (checkout display)
const ICP_RATE_USD = 8.5;

function usdToICP(usd: number): number {
  return usd / ICP_RATE_USD;
}

// ── Cart Item Row ──────────────────────────────────────────────────────────────
function CartItemRow({
  item,
  index,
}: {
  item: CartItem;
  index: number;
}) {
  const { updateQuantity, removeItem } = useCart();
  const { activeCurrency } = useWallet();
  const icpPrice = usdToICP(item.price);

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8, height: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-4 py-4 border-b border-border last:border-0"
      data-ocid={`cart.item.${index + 1}`}
    >
      {/* Image placeholder */}
      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center flex-shrink-0">
        <ShoppingBag size={18} className="text-white/60" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground line-clamp-1">
          {item.name}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Store size={10} className="text-primary/60" />
          <span className="text-xs text-muted-foreground">{item.vendor}</span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-xs text-muted-foreground">
            {formatAmount(
              convertFromICP(icpPrice, activeCurrency),
              activeCurrency,
            )}{" "}
            each
          </p>
          {activeCurrency !== "ICP" && (
            <span className="text-[10px] text-muted-foreground/60">
              ({icpPrice.toFixed(4)} ICP)
            </span>
          )}
        </div>
      </div>

      {/* Quantity */}
      <div className="flex items-center border border-border rounded-md overflow-hidden flex-shrink-0">
        <button
          type="button"
          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
          className="h-8 w-8 flex items-center justify-center hover:bg-secondary transition-colors"
          data-ocid={`cart.quantity_decrease.${index + 1}`}
        >
          <Minus size={12} />
        </button>
        <span
          className="w-8 text-center text-xs font-semibold"
          data-ocid={`cart.quantity_input.${index + 1}`}
        >
          {item.quantity}
        </span>
        <button
          type="button"
          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
          className="h-8 w-8 flex items-center justify-center hover:bg-secondary transition-colors"
          data-ocid={`cart.quantity_increase.${index + 1}`}
        >
          <Plus size={12} />
        </button>
      </div>

      {/* Line total */}
      <div className="w-20 text-right flex-shrink-0">
        <p className="text-sm font-bold text-primary">
          {formatAmount(
            convertFromICP(
              usdToICP(item.price * item.quantity),
              activeCurrency,
            ),
            activeCurrency,
          )}
        </p>
        {activeCurrency !== "ICP" && (
          <p className="text-[10px] text-muted-foreground/60">
            {usdToICP(item.price * item.quantity).toFixed(4)} ICP
          </p>
        )}
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={() => {
          removeItem(item.productId);
          toast("Item removed from cart");
        }}
        className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded hover:bg-destructive/10"
        data-ocid={`cart.delete_button.${index + 1}`}
      >
        <Trash2 size={14} />
      </button>
    </motion.div>
  );
}

// ── Order Status Badge ─────────────────────────────────────────────────────────
function OrderStatusBadge({ status }: { status: string }) {
  const classes = getOrderStatusBadgeClasses(
    status as "processing" | "shipped" | "delivered" | "cancelled",
  );
  return (
    <Badge
      variant="outline"
      className={cn("capitalize text-xs border", classes)}
    >
      {status}
    </Badge>
  );
}

// ── Checkout Dialog ────────────────────────────────────────────────────────────
function CheckoutDialog({
  subtotal,
  items,
  onClose,
}: {
  subtotal: number;
  items: CartItem[];
  onClose: () => void;
}) {
  const { placeOrder } = useCart();
  const { wallets, activeCurrency } = useWallet();
  const { actor } = useActor();
  const [selectedWallet, setSelectedWallet] = useState<string>(
    wallets[0]?.address ?? "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");

  const shipping = subtotal >= 50 ? 0 : 4.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const totalICP = usdToICP(total);
  const totalConverted = convertFromICP(totalICP, activeCurrency);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      // Record transaction in wallet if a wallet is selected
      if (selectedWallet && actor) {
        try {
          await actor.addTransaction(
            selectedWallet,
            totalICP,
            `Store purchase - ${items.length} item(s)`,
            TransactionType.sent,
          );
        } catch {
          // non-fatal — still place the order
        }
      }

      const order: Order = {
        id: `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
        placedAt: Date.now(),
        items,
        subtotal: total,
        currency: activeCurrency,
        icpAmount: totalICP,
        walletAddress: selectedWallet || undefined,
        status: "processing",
      };

      placeOrder(order);
      setStep("success");
      toast.success("Order placed successfully!");
      setTimeout(onClose, 2000);
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="max-w-md" data-ocid="cart.dialog">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <CreditCard size={18} className="text-primary" />
          {step === "form" ? "Checkout" : "Order Placed!"}
        </DialogTitle>
        <DialogDescription>
          {step === "form"
            ? "Review your order and confirm payment."
            : "Your order has been submitted successfully."}
        </DialogDescription>
      </DialogHeader>

      {step === "success" ? (
        <div className="py-6 text-center" data-ocid="cart.success_state">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h3 className="text-lg font-bold font-display text-foreground mb-2">
            Order Confirmed!
          </h3>
          <p className="text-sm text-muted-foreground mb-1">
            Total:{" "}
            <strong>{formatAmount(totalConverted, activeCurrency)}</strong>{" "}
            <span className="text-muted-foreground/60">
              ({totalICP.toFixed(4)} ICP)
            </span>
          </p>
          {selectedWallet && (
            <p className="text-xs text-muted-foreground mt-1">
              Charged to wallet ending in {selectedWallet.slice(-6)}
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Order summary */}
          <div className="bg-secondary/50 rounded-lg p-3 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Order Total
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary font-display">
                {formatAmount(totalConverted, activeCurrency)}
              </span>
              {activeCurrency !== "ICP" && (
                <span className="text-sm text-muted-foreground">
                  {totalICP.toFixed(4)} ICP
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {items.length} item{items.length !== 1 ? "s" : ""} ·{" "}
              {shipping === 0
                ? "Free shipping"
                : `$${shipping.toFixed(2)} shipping`}{" "}
              · {tax.toFixed(2)} tax
            </p>
          </div>

          {/* Wallet selector */}
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-foreground">
              Pay with wallet
            </p>
            {wallets.length > 0 ? (
              <Select value={selectedWallet} onValueChange={setSelectedWallet}>
                <SelectTrigger
                  className="h-9 text-sm"
                  data-ocid="cart.wallet_select"
                >
                  <SelectValue placeholder="Choose a wallet" />
                </SelectTrigger>
                <SelectContent>
                  {wallets.map((w) => (
                    <SelectItem key={w.address} value={w.address}>
                      <span className="flex items-center gap-2">
                        <Wallet size={12} />
                        {w.walletLabel} · {w.address.slice(0, 12)}…
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="text-xs text-muted-foreground bg-amber-50 border border-amber-200 rounded-md p-2.5">
                No wallets linked.{" "}
                <Link
                  to="/wallet"
                  className="underline text-amber-700 font-medium"
                >
                  Link one in Wallet page
                </Link>{" "}
                to enable ICP payments.
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={onClose}
              data-ocid="cart.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex-1"
              data-ocid="cart.confirm_button"
            >
              {isSubmitting ? "Placing order…" : "Confirm Order"}
            </Button>
          </DialogFooter>
        </div>
      )}
    </DialogContent>
  );
}

// ── Main CartPage ──────────────────────────────────────────────────────────────
export function CartPage() {
  const { items, totalItems, subtotal, clearCart } = useCart();
  const { activeCurrency } = useWallet();
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>(() => loadOrders());

  const shipping = subtotal >= 50 ? 0 : 4.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  const totalICP = usdToICP(total);

  const subtotalConverted = convertFromICP(usdToICP(subtotal), activeCurrency);
  const totalConverted = convertFromICP(totalICP, activeCurrency);

  // Reload orders from localStorage when checkout closes
  const handleCheckoutClose = () => {
    setCheckoutOpen(false);
    setOrders(loadOrders());
  };

  return (
    <Layout breadcrumb="Commerce › Cart & Orders">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex items-center gap-3 mb-6">
          <ShoppingCart size={22} className="text-primary" />
          <div>
            <h1 className="text-xl font-bold font-display text-foreground">
              Cart & Orders
            </h1>
            <p className="text-xs text-muted-foreground">
              Manage your purchases from the IIIntl One Marketplace
            </p>
          </div>
        </div>

        <Tabs defaultValue="cart">
          <TabsList className="mb-6" data-ocid="cart.tabs">
            <TabsTrigger value="cart" data-ocid="cart.my_cart_tab">
              <ShoppingCart size={13} className="mr-1.5" />
              My Cart
              {totalItems > 0 && (
                <Badge className="ml-1.5 h-4 px-1.5 text-[9px] bg-primary/20 text-primary border-primary/20 border">
                  {totalItems}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              data-ocid="cart.my_orders_tab"
              onClick={() => setOrders(loadOrders())}
            >
              <Package size={13} className="mr-1.5" />
              My Orders
              <Badge className="ml-1.5 h-4 px-1.5 text-[9px] bg-secondary text-muted-foreground border-border border">
                {orders.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          {/* ── My Cart Tab ── */}
          <TabsContent value="cart">
            {items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
                data-ocid="cart.empty_state"
              >
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart
                    size={32}
                    className="text-muted-foreground/40"
                  />
                </div>
                <h2 className="text-lg font-bold font-display text-foreground mb-2">
                  Your cart is empty
                </h2>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                  Browse the IIIntl One Marketplace to find books, crafts,
                  campaign tools, and goods from global vendors.
                </p>
                <Link to="/store">
                  <Button data-ocid="cart.browse_marketplace_button">
                    <ShoppingBag size={14} className="mr-2" />
                    Browse the Marketplace
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Cart Items */}
                <div className="lg:col-span-3">
                  <Card>
                    <CardHeader className="pb-2 pt-4 px-5">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-bold">
                          {totalItems} item{totalItems !== 1 ? "s" : ""} in your
                          cart
                        </CardTitle>
                        <button
                          type="button"
                          onClick={() => {
                            clearCart();
                            toast("Cart cleared");
                          }}
                          className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                          data-ocid="cart.clear_cart_button"
                        >
                          Clear all
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent className="px-5 pb-4">
                      {items.map((item, i) => (
                        <CartItemRow
                          key={item.productId}
                          item={item}
                          index={i}
                        />
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-2">
                  <Card className="sticky top-4">
                    <CardHeader className="pb-3 pt-4 px-5">
                      <CardTitle className="text-sm font-bold">
                        Order Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-5 pb-5 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Subtotal ({totalItems} items)
                        </span>
                        <div className="text-right">
                          <span className="font-medium">
                            {formatAmount(subtotalConverted, activeCurrency)}
                          </span>
                          {activeCurrency !== "ICP" && (
                            <p className="text-[10px] text-muted-foreground/60">
                              {usdToICP(subtotal).toFixed(4)} ICP
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1.5">
                          <Truck size={12} />
                          Shipping
                        </span>
                        <span className="font-medium">
                          {shipping === 0 ? (
                            <span className="text-green-600 font-semibold">
                              Free
                            </span>
                          ) : (
                            `$${shipping.toFixed(2)}`
                          )}
                        </span>
                      </div>
                      {subtotal < 50 && (
                        <p className="text-xs text-muted-foreground bg-secondary/60 rounded-md p-2">
                          Add ${(50 - subtotal).toFixed(2)} more for free
                          shipping
                        </p>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax (8%)</span>
                        <span className="font-medium">${tax.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between">
                        <span className="font-bold text-foreground">Total</span>
                        <div className="text-right">
                          <span className="font-bold text-primary text-lg">
                            {formatAmount(totalConverted, activeCurrency)}
                          </span>
                          {activeCurrency !== "ICP" && (
                            <p className="text-[10px] text-muted-foreground/60">
                              {totalICP.toFixed(4)} ICP
                            </p>
                          )}
                        </div>
                      </div>

                      <Dialog
                        open={checkoutOpen}
                        onOpenChange={setCheckoutOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            className="w-full mt-2 font-semibold"
                            size="lg"
                            data-ocid="cart.checkout_button"
                          >
                            <CreditCard size={15} className="mr-2" />
                            Proceed to Checkout
                          </Button>
                        </DialogTrigger>
                        <CheckoutDialog
                          subtotal={subtotal}
                          items={items}
                          onClose={handleCheckoutClose}
                        />
                      </Dialog>

                      <Link to="/store" className="block">
                        <Button
                          variant="outline"
                          className="w-full text-sm"
                          data-ocid="cart.continue_shopping_button"
                        >
                          Continue Shopping
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          {/* ── My Orders Tab ── */}
          <TabsContent value="orders">
            {orders.length === 0 ? (
              <div className="text-center py-20" data-ocid="orders.empty_state">
                <Package
                  size={36}
                  className="mx-auto mb-3 text-muted-foreground/30"
                />
                <h2 className="text-lg font-bold text-foreground mb-2">
                  No orders yet
                </h2>
                <p className="text-sm text-muted-foreground">
                  Your completed orders will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order, i) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.05 }}
                  >
                    <Card data-ocid={`orders.item.${i + 1}`}>
                      <Accordion type="single" collapsible>
                        <AccordionItem value={order.id} className="border-0">
                          <AccordionTrigger className="px-5 py-4 hover:no-underline [&>svg]:hidden">
                            <div className="flex items-center gap-4 w-full text-left">
                              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                                <Package
                                  size={16}
                                  className="text-muted-foreground"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <p className="text-sm font-bold text-foreground font-display">
                                    {order.id}
                                  </p>
                                  <OrderStatusBadge status={order.status} />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(order.placedAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    },
                                  )}{" "}
                                  · {order.items.length} item
                                  {order.items.length !== 1 ? "s" : ""}
                                </p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-base font-bold text-primary">
                                  {formatAmount(
                                    convertFromICP(
                                      usdToICP(order.subtotal),
                                      (order.currency as
                                        | "ICP"
                                        | "USD"
                                        | "EUR"
                                        | "GBP") ?? activeCurrency,
                                    ),
                                    (order.currency as
                                      | "ICP"
                                      | "USD"
                                      | "EUR"
                                      | "GBP") ?? activeCurrency,
                                  )}
                                </p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                  {order.icpAmount.toFixed(4)} ICP · View
                                  details ↓
                                </p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="px-5 pb-4">
                              <Separator className="mb-4" />
                              <div className="space-y-3 mb-4">
                                {order.items.map((item) => (
                                  <div
                                    key={item.productId}
                                    className="flex items-center gap-3"
                                  >
                                    <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center flex-shrink-0">
                                      <ShoppingBag
                                        size={14}
                                        className="text-muted-foreground"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-semibold text-foreground line-clamp-1">
                                        {item.name}
                                      </p>
                                      <p className="text-[10px] text-muted-foreground">
                                        {item.vendor} · Qty {item.quantity}
                                      </p>
                                    </div>
                                    <p className="text-xs font-bold text-primary flex-shrink-0">
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                              {order.walletAddress && (
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                                  <Wallet size={10} />
                                  <span>Paid from: {order.walletAddress}</span>
                                </div>
                              )}
                              <div className="bg-secondary/50 rounded-lg p-3 space-y-1.5">
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">
                                    Subtotal
                                  </span>
                                  <span>${order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">
                                    ICP equivalent
                                  </span>
                                  <span>{order.icpAmount.toFixed(4)} ICP</span>
                                </div>
                                <Separator className="my-1" />
                                <div className="flex justify-between text-sm font-bold">
                                  <span>Total</span>
                                  <span className="text-primary">
                                    ${order.subtotal.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
