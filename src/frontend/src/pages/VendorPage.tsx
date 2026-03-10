import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import {
  MOCK_PRODUCTS,
  MOCK_VENDORS,
  getProductCategoryColor,
  getProductsByVendorId,
  getVendorById,
} from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronRight,
  Globe,
  Mail,
  Package,
  ShoppingBag,
  ShoppingCart,
  Star,
  Store,
  Tag,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

// ── Star Rating ────────────────────────────────────────────────────────────────
function StarRating({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={12}
            className={
              i <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted-foreground/30"
            }
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs text-muted-foreground">({count})</span>
      )}
    </div>
  );
}

// ── Vendor Product Card ────────────────────────────────────────────────────────
function VendorProductCard({
  productId,
  index,
}: {
  productId: string;
  index: number;
}) {
  const { addItem } = useCart();
  const product = MOCK_PRODUCTS.find((p) => p.id === productId);
  if (!product) return null;

  const gradient = getProductCategoryColor(product.category);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.title,
      vendor: product.vendor,
      price: product.price,
    });
    toast.success("Added to cart", {
      description: product.title.slice(0, 45),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
    >
      <Link to="/store/$id" params={{ id: product.id }}>
        <Card
          className="group overflow-hidden border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer"
          data-ocid={`vendor.product_card.${index + 1}`}
        >
          <div
            className={cn(
              "h-36 bg-gradient-to-br relative flex items-center justify-center",
              gradient,
            )}
          >
            <ShoppingBag size={24} className="text-white/50" />
            {product.featured && (
              <div className="absolute top-2 left-2">
                <Badge className="bg-amber-500/90 text-white border-0 text-[9px] gap-1">
                  <Zap size={8} />
                  Featured
                </Badge>
              </div>
            )}
          </div>
          <CardContent className="p-3">
            <div className="flex items-start justify-between gap-1 mb-1">
              <Badge
                variant="outline"
                className="text-[9px] px-1.5 h-4 border-border/60 text-muted-foreground"
              >
                <Tag size={7} className="mr-0.5" />
                {product.category}
              </Badge>
            </div>
            <p className="text-xs font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors leading-snug">
              {product.title}
            </p>
            <div className="flex items-center justify-between mb-2">
              <StarRating rating={product.rating} count={product.reviewCount} />
              <span className="text-sm font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
            </div>
            <Button
              size="sm"
              className="w-full h-7 text-xs"
              onClick={handleAddToCart}
              data-ocid={`vendor.add_to_cart_button.${index + 1}`}
            >
              <ShoppingCart size={11} className="mr-1" />
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

// ── Main VendorPage ────────────────────────────────────────────────────────────
export function VendorPage() {
  const { vendorId } = useParams({ from: "/store/vendor/$vendorId" });
  const vendor = getVendorById(vendorId);
  const vendorProducts = getProductsByVendorId(vendorId);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactSent, setContactSent] = useState(false);

  if (!vendor) {
    return (
      <Layout breadcrumb="Commerce › Store › Vendor Not Found">
        <div className="flex flex-col items-center justify-center py-24 text-center px-4">
          <Store size={40} className="text-muted-foreground/40 mb-4" />
          <h2 className="text-lg font-bold text-foreground mb-2">
            Vendor Not Found
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            This vendor doesn't exist or has been removed.
          </p>
          <Link to="/store">
            <Button variant="outline" size="sm">
              <ArrowLeft size={13} className="mr-1.5" />
              Back to Store
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSent(true);
    toast.success("Message sent to vendor", {
      description: `Your message has been sent to ${vendor.name}.`,
    });
    setTimeout(() => setContactOpen(false), 1500);
  };

  return (
    <Layout breadcrumb={`Commerce › Store › ${vendor.name}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* ── Back Link ── */}
        <Link
          to="/store"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors mb-5"
          data-ocid="vendor.store_link"
        >
          <ArrowLeft size={13} />
          Back to Marketplace
        </Link>

        {/* ── Vendor Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Card className="overflow-hidden">
            {/* Hero Strip */}
            <div className="civic-gradient h-28 relative">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 80% 50%, white 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
            </div>

            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-8 mb-4">
                <div className="w-16 h-16 rounded-xl bg-white shadow-md border border-border flex items-center justify-center flex-shrink-0">
                  <div className="civic-gradient w-12 h-12 rounded-lg flex items-center justify-center">
                    <Store size={22} className="text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-bold font-display text-foreground">
                      {vendor.name}
                    </h1>
                    <Badge
                      variant="outline"
                      className="border-border text-muted-foreground text-xs"
                    >
                      <Globe size={10} className="mr-1" />
                      {vendor.region}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Member since {new Date(vendor.memberSince).getFullYear()} ·{" "}
                    {vendor.specialties.join(", ")}
                  </p>
                </div>
                <Dialog open={contactOpen} onOpenChange={setContactOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0"
                      data-ocid="vendor.contact_button"
                    >
                      <Mail size={13} className="mr-1.5" />
                      Contact Vendor
                    </Button>
                  </DialogTrigger>
                  <DialogContent data-ocid="vendor.contact_dialog">
                    <DialogHeader>
                      <DialogTitle>Contact {vendor.name}</DialogTitle>
                      <DialogDescription>
                        Send a message directly to this vendor. They typically
                        respond within 2 business days.
                      </DialogDescription>
                    </DialogHeader>
                    {contactSent ? (
                      <div className="py-4 text-center">
                        <p className="text-green-600 font-semibold">
                          Message sent!
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {vendor.name} will reply to your email address.
                        </p>
                      </div>
                    ) : (
                      <form
                        onSubmit={handleContactSubmit}
                        className="space-y-3"
                      >
                        <div>
                          <Label
                            className="text-xs font-semibold"
                            htmlFor="contact_subject"
                          >
                            Subject
                          </Label>
                          <Input
                            id="contact_subject"
                            placeholder="What is your inquiry about?"
                            className="mt-1 h-9 text-sm"
                            required
                            data-ocid="vendor.contact_subject_input"
                          />
                        </div>
                        <div>
                          <Label
                            className="text-xs font-semibold"
                            htmlFor="contact_message"
                          >
                            Message
                          </Label>
                          <Textarea
                            id="contact_message"
                            placeholder="Write your message here..."
                            className="mt-1 text-sm resize-none"
                            rows={4}
                            required
                            data-ocid="vendor.contact_message_textarea"
                          />
                        </div>
                        <DialogFooter className="gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setContactOpen(false)}
                            data-ocid="vendor.contact_cancel_button"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            size="sm"
                            data-ocid="vendor.contact_submit_button"
                          >
                            <Mail size={13} className="mr-1.5" />
                            Send Message
                          </Button>
                        </DialogFooter>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              </div>

              <p className="text-sm text-foreground/80 leading-relaxed mb-5">
                {vendor.description}
              </p>

              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="text-center p-3 bg-secondary/60 rounded-lg">
                  <p className="text-xl font-bold text-primary font-display">
                    {vendorProducts.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Products</p>
                </div>
                <div className="text-center p-3 bg-secondary/60 rounded-lg">
                  <p className="text-xl font-bold text-primary font-display">
                    {vendor.totalSales.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Total Sales</p>
                </div>
                <div className="text-center p-3 bg-secondary/60 rounded-lg">
                  <div className="flex items-center justify-center gap-1">
                    <p className="text-xl font-bold text-primary font-display">
                      {vendor.rating.toFixed(1)}
                    </p>
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                  </div>
                  <p className="text-xs text-muted-foreground">Avg Rating</p>
                </div>
                <div className="text-center p-3 bg-secondary/60 rounded-lg">
                  <p className="text-xl font-bold text-primary font-display">
                    {new Date(vendor.memberSince).getFullYear()}
                  </p>
                  <p className="text-xs text-muted-foreground">Member Since</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Products Section ── */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package size={16} className="text-primary" />
              <h2 className="text-lg font-bold font-display text-foreground">
                Products by {vendor.name}
              </h2>
              <Badge
                variant="outline"
                className="text-xs border-border text-muted-foreground"
              >
                {vendorProducts.length}
              </Badge>
            </div>
            <Link
              to="/store"
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              Browse all
              <ChevronRight size={12} />
            </Link>
          </div>

          {vendorProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {vendorProducts.map((product, i) => (
                <VendorProductCard
                  key={product.id}
                  productId={product.id}
                  index={i}
                />
              ))}
            </div>
          ) : (
            <div
              className="text-center py-16"
              data-ocid="vendor.products_empty_state"
            >
              <Package
                size={32}
                className="mx-auto mb-3 text-muted-foreground/30"
              />
              <p className="text-sm text-muted-foreground">
                No products listed yet
              </p>
            </div>
          )}
        </div>

        {/* ── Other Vendors ── */}
        <Separator className="my-8" />
        <div>
          <h2 className="text-base font-bold font-display text-foreground mb-4">
            Other Marketplace Vendors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {MOCK_VENDORS.filter((v) => v.id !== vendorId)
              .slice(0, 3)
              .map((v, i) => (
                <Link
                  key={v.id}
                  to="/store/vendor/$vendorId"
                  params={{ vendorId: v.id }}
                >
                  <Card
                    className="group hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer p-3"
                    data-ocid={`vendor.other_vendor_card.${i + 1}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg civic-gradient flex items-center justify-center flex-shrink-0">
                        <Store size={14} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                          {v.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {v.region} · {v.productCount} products
                        </p>
                      </div>
                      <ChevronRight
                        size={13}
                        className="text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0"
                      />
                    </div>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
