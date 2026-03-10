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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import {
  MOCK_ORDERS,
  getOrderStatusBadgeClasses,
  getProductCategoryColor,
} from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
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
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

// ── Cart Item Row ──────────────────────────────────────────────────────────────
function CartItemRow({
  item,
  index,
}: {
  item: {
    productId: string;
    name: string;
    vendor: string;
    price: number;
    quantity: number;
  };
  index: number;
}) {
  const { updateQuantity, removeItem } = useCart();
  const gradient = "from-slate-400 to-slate-600";

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
      <div
        className={cn(
          "w-16 h-16 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0",
          gradient,
        )}
      >
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
        <p className="text-xs text-muted-foreground mt-0.5">
          ${item.price.toFixed(2)} each
        </p>
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
      <p className="text-sm font-bold text-primary w-16 text-right flex-shrink-0">
        ${(item.price * item.quantity).toFixed(2)}
      </p>

      {/* Remove */}
      <button
        type="button"
        onClick={() => {
          removeItem(item.productId);
          toast("Item removed from cart");
        }}
        className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded hover:bg-destructive/10"
        data-ocid={`cart.remove_button.${index + 1}`}
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
function CheckoutDialog({ total }: { subtotal?: number; total: number }) {
  const { clearCart } = useCart();
  const [step, setStep] = useState<"form" | "success">("form");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("success");
    setTimeout(() => {
      clearCart();
    }, 1500);
  };

  return (
    <DialogContent className="max-w-md" data-ocid="cart.checkout_dialog">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <CreditCard size={18} className="text-primary" />
          {step === "form" ? "Checkout" : "Order Placed!"}
        </DialogTitle>
        <DialogDescription>
          {step === "form"
            ? "Demo checkout — no real payment will be processed."
            : "Your demo order has been submitted."}
        </DialogDescription>
      </DialogHeader>

      {step === "success" ? (
        <div className="py-6 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h3 className="text-lg font-bold font-display text-foreground mb-2">
            Order Confirmed!
          </h3>
          <p className="text-sm text-muted-foreground mb-1">
            Total charged (demo): <strong>${total.toFixed(2)}</strong>
          </p>
          <p className="text-xs text-muted-foreground">
            This is a demo. No actual payment was processed.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
            <AlertCircle
              size={14}
              className="text-amber-600 mt-0.5 flex-shrink-0"
            />
            <p className="text-xs text-amber-700">
              <strong>Demo only</strong> — this is a prototype checkout. No real
              payment or order will be created.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <Label className="text-xs font-semibold" htmlFor="checkout_name">
                Full Name
              </Label>
              <Input
                id="checkout_name"
                placeholder="Your full name"
                className="mt-1 h-9 text-sm"
                required
                data-ocid="cart.checkout_name_input"
              />
            </div>
            <div>
              <Label
                className="text-xs font-semibold"
                htmlFor="checkout_address"
              >
                Shipping Address
              </Label>
              <Textarea
                id="checkout_address"
                placeholder="Street address, city, country"
                className="mt-1 text-sm resize-none"
                rows={2}
                required
                data-ocid="cart.checkout_address_textarea"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold" htmlFor="checkout_card">
                Card Number
              </Label>
              <Input
                id="checkout_card"
                placeholder="4242 4242 4242 4242 (demo)"
                className="mt-1 h-9 text-sm"
                required
                data-ocid="cart.checkout_card_input"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label
                  className="text-xs font-semibold"
                  htmlFor="checkout_expiry"
                >
                  Expiry
                </Label>
                <Input
                  id="checkout_expiry"
                  placeholder="MM/YY"
                  className="mt-1 h-9 text-sm"
                  required
                />
              </div>
              <div>
                <Label className="text-xs font-semibold" htmlFor="checkout_cvv">
                  CVV
                </Label>
                <Input
                  id="checkout_cvv"
                  placeholder="123"
                  className="mt-1 h-9 text-sm"
                  required
                />
              </div>
            </div>
          </div>

          <Separator />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="font-bold text-primary text-base">
              ${total.toFixed(2)}
            </span>
          </div>

          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button
              type="submit"
              className="flex-1"
              data-ocid="cart.checkout_submit_button"
            >
              Place Demo Order
            </Button>
          </DialogFooter>
        </form>
      )}
    </DialogContent>
  );
}

// ── Main CartPage ──────────────────────────────────────────────────────────────
export function CartPage() {
  const { items, totalItems, subtotal, clearCart } = useCart();
  const shipping = subtotal >= 50 ? 0 : 4.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

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
            <TabsTrigger value="orders" data-ocid="cart.my_orders_tab">
              <Package size={13} className="mr-1.5" />
              My Orders
              <Badge className="ml-1.5 h-4 px-1.5 text-[9px] bg-secondary text-muted-foreground border-border border">
                {MOCK_ORDERS.length}
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
                        <span className="font-medium">
                          ${subtotal.toFixed(2)}
                        </span>
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
                        <span className="font-bold text-primary text-lg">
                          ${total.toFixed(2)}
                        </span>
                      </div>

                      <Dialog>
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
                        <CheckoutDialog subtotal={subtotal} total={total} />
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
            {MOCK_ORDERS.length === 0 ? (
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
                {MOCK_ORDERS.map((order, i) => (
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
                                    {order.orderNumber}
                                  </p>
                                  <OrderStatusBadge status={order.status} />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(order.date).toLocaleDateString(
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
                                  ${order.total.toFixed(2)}
                                </p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                  View details ↓
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
                                        {item.productName}
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
                              <div className="bg-secondary/50 rounded-lg p-3 space-y-1.5">
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">
                                    Subtotal
                                  </span>
                                  <span>${order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">
                                    Shipping
                                  </span>
                                  <span>
                                    {order.shipping === 0 ? (
                                      <span className="text-green-600 font-semibold">
                                        Free
                                      </span>
                                    ) : (
                                      `$${order.shipping.toFixed(2)}`
                                    )}
                                  </span>
                                </div>
                                <div className="flex justify-between text-xs">
                                  <span className="text-muted-foreground">
                                    Tax
                                  </span>
                                  <span>${order.tax.toFixed(2)}</span>
                                </div>
                                <Separator className="my-1" />
                                <div className="flex justify-between text-sm font-bold">
                                  <span>Total</span>
                                  <span className="text-primary">
                                    ${order.total.toFixed(2)}
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
