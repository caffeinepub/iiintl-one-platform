import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/context/CartContext";
import {
  MOCK_PRODUCTS,
  MOCK_VENDORS,
  getProductCategoryColor,
  getProductsByVendorId,
  getReviewsByProductId,
  getVendorById,
} from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle,
  ChevronRight,
  Globe,
  Heart,
  Minus,
  Package,
  Plus,
  ShoppingBag,
  ShoppingCart,
  Star,
  Store,
  Tag,
  Truck,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

// ── Star Rating ────────────────────────────────────────────────────────────────
function StarRating({
  rating,
  size = "sm",
}: {
  rating: number;
  size?: "sm" | "lg";
}) {
  const s = size === "lg" ? 16 : 12;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={s}
          className={
            i <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted-foreground/30"
          }
        />
      ))}
    </div>
  );
}

// ── Related Product Card ──────────────────────────────────────────────────────
function RelatedCard({ productId }: { productId: string }) {
  const product = MOCK_PRODUCTS.find((p) => p.id === productId);
  if (!product) return null;
  const gradient = getProductCategoryColor(product.category);
  return (
    <Link to="/store/$id" params={{ id: product.id }}>
      <Card className="group hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer overflow-hidden">
        <div
          className={cn(
            "h-28 bg-gradient-to-br flex items-center justify-center",
            gradient,
          )}
        >
          <ShoppingBag size={20} className="text-white/60" />
        </div>
        <CardContent className="p-3">
          <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
            {product.title}
          </p>
          <div className="flex items-center justify-between">
            <StarRating rating={product.rating} />
            <span className="text-sm font-bold text-primary">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// ── Main ProductDetailPage ─────────────────────────────────────────────────────
export function ProductDetailPage() {
  const { id } = useParams({ from: "/store/$id" });
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [savedForLater, setSavedForLater] = useState(false);

  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  const vendor = product ? getVendorById(product.vendorId) : undefined;
  const reviews = product ? getReviewsByProductId(product.id) : [];
  const relatedProducts = product
    ? MOCK_PRODUCTS.filter(
        (p) => p.category === product.category && p.id !== product.id,
      ).slice(0, 4)
    : [];

  if (!product) {
    return (
      <Layout breadcrumb="Commerce › Store › Not Found">
        <div className="flex flex-col items-center justify-center py-24 text-center px-4">
          <ShoppingBag size={40} className="text-muted-foreground/40 mb-4" />
          <h2 className="text-lg font-bold text-foreground mb-2">
            Product Not Found
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            This product doesn't exist or has been removed.
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

  const gradient = getProductCategoryColor(product.category);

  const handleAddToCart = () => {
    addItem(
      {
        productId: product.id,
        name: product.title,
        vendor: product.vendor,
        price: product.price,
      },
      quantity,
    );
    toast.success(`${quantity}× added to cart`, {
      description: product.title.slice(0, 50),
    });
  };

  return (
    <Layout breadcrumb={`Commerce › Store › ${product.category}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* ── Breadcrumb ── */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link
            to="/store"
            className="hover:text-primary transition-colors"
            data-ocid="product.store_link"
          >
            Store
          </Link>
          <ChevronRight size={12} />
          <Link to="/store" className="hover:text-primary transition-colors">
            {product.category}
          </Link>
          <ChevronRight size={12} />
          <span className="text-foreground font-medium truncate max-w-48">
            {product.title}
          </span>
        </div>

        {/* ── Product Main Section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-10">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="lg:col-span-2"
          >
            <div
              className={cn(
                "rounded-xl h-72 lg:h-96 bg-gradient-to-br flex flex-col items-center justify-center relative",
                gradient,
              )}
            >
              <ShoppingBag size={48} className="text-white/50 mb-3" />
              <p className="text-white/70 text-sm font-medium">
                {product.category}
              </p>
              {product.featured && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-amber-500/90 text-white border-0 gap-1 text-xs">
                    <Zap size={11} />
                    Featured
                  </Badge>
                </div>
              )}
              {product.stock <= 10 && (
                <div className="absolute top-4 right-4">
                  <Badge
                    variant="outline"
                    className="bg-white/90 text-orange-600 border-orange-200 text-xs"
                  >
                    Only {product.stock} left
                  </Badge>
                </div>
              )}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="lg:col-span-3"
          >
            {/* Vendor + Category */}
            <div className="flex items-center gap-2 mb-3">
              <Link
                to="/store/vendor/$vendorId"
                params={{ vendorId: product.vendorId }}
                className="flex items-center gap-1.5 text-xs font-semibold text-primary/70 hover:text-primary transition-colors"
                data-ocid="product.vendor_link"
              >
                <Store size={12} />
                {product.vendor}
              </Link>
              <span className="text-muted-foreground/40">·</span>
              <Badge
                variant="outline"
                className="text-[10px] px-2 h-5 border-border text-muted-foreground"
              >
                <Tag size={9} className="mr-1" />
                {product.category}
              </Badge>
            </div>

            <h1 className="text-2xl font-bold font-display text-foreground leading-tight mb-3">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                <StarRating rating={product.rating} size="lg" />
                <span className="text-sm font-semibold text-foreground">
                  {product.rating.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">
                  ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Price + Stock */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl font-bold text-primary font-display">
                ${product.price.toFixed(2)}
              </span>
              {product.stock > 10 ? (
                <Badge className="bg-green-100 text-green-700 border-green-200 border gap-1 text-xs">
                  <CheckCircle size={11} />
                  In Stock
                </Badge>
              ) : product.stock > 0 ? (
                <Badge className="bg-orange-100 text-orange-700 border-orange-200 border text-xs">
                  Only {product.stock} left
                </Badge>
              ) : (
                <Badge className="bg-red-100 text-red-700 border-red-200 border text-xs">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {product.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-[10px] px-2 h-5"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Quantity + CTA */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center border border-border rounded-md overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-10 w-10 flex items-center justify-center hover:bg-secondary transition-colors"
                  data-ocid="product.quantity_decrease_button"
                >
                  <Minus size={14} />
                </button>
                <span
                  className="w-10 text-center text-sm font-semibold"
                  data-ocid="product.quantity_display"
                >
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="h-10 w-10 flex items-center justify-center hover:bg-secondary transition-colors"
                  data-ocid="product.quantity_increase_button"
                >
                  <Plus size={14} />
                </button>
              </div>

              <Button
                className="flex-1 h-10 font-semibold"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                data-ocid="product.add_to_cart_button"
              >
                <ShoppingCart size={15} className="mr-2" />
                Add to Cart · ${(product.price * quantity).toFixed(2)}
              </Button>
            </div>

            <Button
              variant="outline"
              className="w-full h-9 text-sm"
              onClick={() => {
                setSavedForLater(!savedForLater);
                toast(savedForLater ? "Removed from saved" : "Saved for later");
              }}
              data-ocid="product.save_for_later_button"
            >
              <Heart
                size={14}
                className={cn(
                  "mr-2",
                  savedForLater && "fill-primary text-primary",
                )}
              />
              {savedForLater ? "Saved for Later" : "Save for Later"}
            </Button>

            {/* Vendor Info Mini */}
            {vendor && (
              <div className="mt-5 p-3 bg-secondary/50 rounded-lg flex items-center gap-3">
                <div className="w-9 h-9 rounded-md civic-gradient flex items-center justify-center flex-shrink-0">
                  <Store size={14} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-foreground">
                    {vendor.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          size={9}
                          className={
                            i <= Math.round(vendor.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "fill-muted text-muted"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {vendor.reviewCount} reviews · {vendor.region}
                    </span>
                  </div>
                </div>
                <Link
                  to="/store/vendor/$vendorId"
                  params={{ vendorId: vendor.id }}
                >
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    View Store
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Tabs ── */}
        <Tabs defaultValue="description" className="mb-10">
          <TabsList className="w-full sm:w-auto" data-ocid="product.tabs">
            <TabsTrigger
              value="description"
              data-ocid="product.description_tab"
            >
              Description
            </TabsTrigger>
            <TabsTrigger value="reviews" data-ocid="product.reviews_tab">
              Reviews ({reviews.length || product.reviewCount})
            </TabsTrigger>
            <TabsTrigger value="vendor" data-ocid="product.vendor_tab">
              Vendor Info
            </TabsTrigger>
            <TabsTrigger value="shipping" data-ocid="product.shipping_tab">
              Shipping
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-4">
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {product.description}
                </p>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Category
                    </p>
                    <p className="text-sm font-medium">{product.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Region</p>
                    <p className="text-sm font-medium">{product.region}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Vendor</p>
                    <p className="text-sm font-medium">{product.vendor}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      In Stock
                    </p>
                    <p className="text-sm font-medium">{product.stock} units</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-4">
            <Card>
              <CardContent className="p-5 space-y-5">
                {/* Rating Summary */}
                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-primary font-display">
                      {product.rating.toFixed(1)}
                    </p>
                    <StarRating rating={product.rating} size="lg" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {product.reviewCount} reviews
                    </p>
                  </div>
                  <div className="flex-1 space-y-1">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const pct =
                        star === 5 ? 65 : star === 4 ? 20 : star === 3 ? 10 : 4;
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-xs w-2">{star}</span>
                          <Star
                            size={10}
                            className="fill-amber-400 text-amber-400"
                          />
                          <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-6">
                            {pct}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Individual Reviews */}
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div
                      key={review.id}
                      className="pb-4 border-b border-border last:border-0 last:pb-0"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {review.authorName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {review.date}
                          </p>
                        </div>
                        <StarRating rating={review.rating} />
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        {review.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  // Fallback mock reviews if none in data
                  <div className="text-center py-6 text-muted-foreground">
                    <Star size={28} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No written reviews yet</p>
                    <p className="text-xs mt-1">
                      Be the first to leave a review after purchase
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vendor" className="mt-4">
            <Card>
              <CardContent className="p-5">
                {vendor ? (
                  <div>
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg civic-gradient flex items-center justify-center flex-shrink-0">
                        <Store size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-foreground font-display">
                          {vendor.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge
                            variant="outline"
                            className="text-[10px] h-4 px-1.5 border-border text-muted-foreground"
                          >
                            <Globe size={8} className="mr-1" />
                            {vendor.region}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Member since{" "}
                            {new Date(vendor.memberSince).getFullYear()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                      {vendor.description}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-secondary/60 rounded-lg">
                        <p className="text-xl font-bold text-primary font-display">
                          {vendor.productCount}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Products
                        </p>
                      </div>
                      <div className="text-center p-3 bg-secondary/60 rounded-lg">
                        <p className="text-xl font-bold text-primary font-display">
                          {vendor.totalSales.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Sales</p>
                      </div>
                      <div className="text-center p-3 bg-secondary/60 rounded-lg">
                        <p className="text-xl font-bold text-primary font-display">
                          {vendor.rating.toFixed(1)}
                        </p>
                        <p className="text-xs text-muted-foreground">Rating</p>
                      </div>
                      <div className="text-center p-3 bg-secondary/60 rounded-lg">
                        <p className="text-xl font-bold text-primary font-display">
                          {new Date(vendor.memberSince).getFullYear()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Member Since
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Contact</p>
                        <p className="text-sm text-foreground">
                          {vendor.contactEmail}
                        </p>
                      </div>
                      <Link
                        to="/store/vendor/$vendorId"
                        params={{ vendorId: vendor.id }}
                      >
                        <Button size="sm" data-ocid="product.view_store_button">
                          <Store size={13} className="mr-1.5" />
                          View Full Store
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Vendor info not available.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shipping" className="mt-4">
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <Truck
                    size={18}
                    className="text-primary mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-0.5">
                      Standard Shipping
                    </p>
                    <p className="text-sm text-foreground/80">
                      3–7 business days. Free on orders over $50. $4.99 flat
                      rate below.
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Globe
                    size={18}
                    className="text-primary mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-0.5">
                      International Delivery
                    </p>
                    <p className="text-sm text-foreground/80">
                      Available to most countries. 7–21 business days depending
                      on destination. Customs duties may apply and are the
                      responsibility of the buyer.
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <Package
                    size={18}
                    className="text-primary mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-0.5">
                      Packaging & Sustainability
                    </p>
                    <p className="text-sm text-foreground/80">
                      All orders are packed in recycled or compostable
                      materials. Digital products are delivered instantly via
                      email upon payment confirmation.
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-start gap-3">
                  <CheckCircle
                    size={18}
                    className="text-green-600 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-0.5">
                      Returns & Refunds
                    </p>
                    <p className="text-sm text-foreground/80">
                      30-day returns on physical goods in original condition.
                      Digital products are non-refundable. Damaged or incorrect
                      items will be replaced at no cost.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* ── Related Products ── */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-lg font-bold font-display text-foreground mb-4">
              Related Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((p) => (
                <RelatedCard key={p.id} productId={p.id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
