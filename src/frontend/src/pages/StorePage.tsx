import { Layout } from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useI18n } from "@/context/I18nContext";
import {
  MOCK_PRODUCTS,
  MOCK_VENDORS,
  type ProductCategory,
  getProductCategoryColor,
} from "@/data/mockData";
import { useBackend } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  ChevronRight,
  Filter,
  Globe,
  Grid3X3,
  LayoutList,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Star,
  Store,
  Tag,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Store type augmentation -- extends backendInterface with Store methods added to main.mo
interface Vendor {
  id: bigint;
  ownerId: unknown;
  name: string;
  description: string;
  logoUrl: string;
  status: string;
  createdAt: bigint;
}
interface Product {
  id: bigint;
  vendorId: bigint;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  stock: bigint;
  imageUrl: string;
  isActive: boolean;
  createdAt: bigint;
}
interface Order {
  id: bigint;
  buyerId: unknown;
  items: Array<{ productId: bigint; quantity: bigint; unitPrice: number }>;
  total: number;
  currency: string;
  status: string;
  walletAddress: string;
  createdAt: bigint;
}
interface StoreBackend {
  listProducts(
    vendorId: bigint | null,
    category: string | null,
  ): Promise<Array<Product>>;
  listVendors(): Promise<Array<Vendor>>;
  placeOrder(
    items: Array<{ productId: bigint; quantity: bigint; unitPrice: number }>,
    currency: string,
    walletAddress: string,
  ): Promise<bigint>;
  getMyOrders(): Promise<Array<Order>>;
}
const CATEGORIES: ProductCategory[] = [
  "Books & Publications",
  "Apparel",
  "Digital Resources",
  "Art & Crafts",
  "Food & Goods",
  "Equipment & Tools",
  "Services",
  "Merchandise",
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Top Rated" },
];

const REGIONS = [
  "All Regions",
  "Americas",
  "Europe",
  "Africa",
  "Asia-Pacific",
  "Middle East",
  "South Asia",
  "Caribbean",
];

// Normalized product type used in display
interface DisplayProduct {
  id: string;
  title: string;
  vendor: string;
  vendorId: string;
  price: number;
  category: string;
  stock: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  region: string;
  tags: string[];
  createdAt: string;
  fromBackend?: boolean;
}

// Normalized vendor type used in display
interface DisplayVendor {
  id: string;
  name: string;
  description: string;
  region: string;
  productCount: number;
  rating: number;
  reviewCount: number;
  fromBackend?: boolean;
}

// ── Star Rating Component ──────────────────────────────────────────────────────
function StarRating({
  rating,
  count,
  size = "sm",
}: {
  rating: number;
  count?: number;
  size?: "sm" | "md";
}) {
  const starSize = size === "sm" ? 11 : 14;
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={starSize}
            className={
              i <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted"
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

// ── Product Card (Grid View) ──────────────────────────────────────────────────
function ProductCard({
  product,
  index,
}: {
  product: DisplayProduct;
  index: number;
}) {
  const { addItem } = useCart();
  const gradientClass = getProductCategoryColor(
    product.category as ProductCategory,
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.title,
      vendor: product.vendor,
      price: product.price,
    });
    toast.success("Added to cart", {
      description:
        product.title.slice(0, 45) +
        (product.title.length > 45 ? "\u2026" : ""),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
    >
      <Link to="/store/$id" params={{ id: product.id }}>
        <Card
          className="group overflow-hidden border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200 cursor-pointer"
          data-ocid={`store.product_card.${index + 1}`}
        >
          {/* Image Placeholder */}
          <div className={cn("h-44 bg-gradient-to-br relative", gradientClass)}>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/90 p-4">
              <ShoppingBag size={28} className="opacity-60 mb-2" />
              <p className="text-xs font-medium text-center opacity-75 leading-tight line-clamp-2">
                {product.category}
              </p>
            </div>
            {product.featured && (
              <div className="absolute top-2 left-2">
                <Badge className="bg-amber-500/90 text-white border-0 text-[10px] font-bold gap-1">
                  <Zap size={9} />
                  Featured
                </Badge>
              </div>
            )}
            {product.stock <= 10 && product.stock > 0 && (
              <div className="absolute top-2 right-2">
                <Badge
                  variant="outline"
                  className="bg-white/90 text-orange-600 border-orange-200 text-[10px]"
                >
                  Only {product.stock} left
                </Badge>
              </div>
            )}
          </div>

          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-2 mb-1">
              <Link
                to="/store/vendor/$vendorId"
                params={{ vendorId: product.vendorId }}
                onClick={(e) => e.stopPropagation()}
                className="text-[10px] font-semibold text-primary/70 hover:text-primary transition-colors truncate flex items-center gap-1"
              >
                <Store size={9} />
                {product.vendor}
              </Link>
              <Badge
                variant="outline"
                className="text-[9px] px-1.5 py-0 h-4 border-border/60 text-muted-foreground whitespace-nowrap flex-shrink-0"
              >
                <Tag size={7} className="mr-0.5" />
                {product.category}
              </Badge>
            </div>

            <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {product.title}
            </h3>

            <div className="flex items-center justify-between mb-3">
              <StarRating rating={product.rating} count={product.reviewCount} />
              <span className="text-base font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
            </div>

            <Button
              size="sm"
              className="w-full h-8 text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleAddToCart}
              data-ocid={`store.add_to_cart_button.${index + 1}`}
            >
              <ShoppingCart size={12} className="mr-1.5" />
              Add to Cart
            </Button>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

// ── Product Row (List View) ────────────────────────────────────────────────────
function ProductRow({
  product,
  index,
}: {
  product: DisplayProduct;
  index: number;
}) {
  const { addItem } = useCart();
  const gradientClass = getProductCategoryColor(
    product.category as ProductCategory,
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.title,
      vendor: product.vendor,
      price: product.price,
    });
    toast.success("Added to cart", {
      description:
        product.title.slice(0, 45) +
        (product.title.length > 45 ? "\u2026" : ""),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
    >
      <Link to="/store/$id" params={{ id: product.id }}>
        <Card
          className="group hover:border-primary/30 hover:shadow-sm transition-all duration-200 cursor-pointer"
          data-ocid={`store.product_card.${index + 1}`}
        >
          <CardContent className="p-0">
            <div className="flex items-center gap-4 p-3">
              <div
                className={cn(
                  "w-16 h-16 rounded-lg bg-gradient-to-br flex-shrink-0 flex items-center justify-center",
                  gradientClass,
                )}
              >
                <ShoppingBag size={20} className="text-white/70" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-semibold text-primary/70">
                    {product.vendor}
                  </span>
                  {product.featured && (
                    <Badge className="bg-amber-500/80 text-white border-0 text-[9px] px-1 h-3.5">
                      Featured
                    </Badge>
                  )}
                </div>
                <p className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {product.title}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <StarRating
                    rating={product.rating}
                    count={product.reviewCount}
                  />
                  <Badge
                    variant="outline"
                    className="text-[9px] px-1.5 h-4 border-border/60 text-muted-foreground"
                  >
                    {product.category}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-base font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
                <Button
                  size="sm"
                  className="h-8 px-3 text-xs"
                  onClick={handleAddToCart}
                  data-ocid={`store.add_to_cart_button.${index + 1}`}
                >
                  <ShoppingCart size={12} className="mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

// ── Loading Skeleton ───────────────────────────────────────────────────────────
function ProductSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-44 w-full rounded-none" />
      <CardContent className="p-4 space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-8 w-full mt-2" />
      </CardContent>
    </Card>
  );
}

// ── Main StorePage ─────────────────────────────────────────────────────────────
export function StorePage() {
  const { user } = useAuth();
  const { totalItems } = useCart();
  const { t } = useI18n();
  const backend = useBackend();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"all" | string>("all");
  const [region, setRegion] = useState("All Regions");
  const [sort, setSort] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(12);
  const [products, setProducts] = useState<DisplayProduct[]>([]);
  const [vendors, setVendors] = useState<DisplayVendor[]>([]);
  const [loading, setLoading] = useState(true);

  const isAdmin =
    user?.role === "admin" ||
    user?.role === "super_admin" ||
    user?.role === "org_admin";
  const isSuperAdmin = user?.role === "admin" || user?.role === "super_admin";

  // Fetch live data on mount
  useEffect(() => {
    async function fetchStoreData() {
      setLoading(true);
      try {
        if (!backend) throw new Error("not ready");
        const store = backend as unknown as StoreBackend;
        const [backendProducts, backendVendors] = await Promise.all([
          store.listProducts(null, null),
          store.listVendors(),
        ]);

        if (backendProducts.length > 0) {
          // Map backend products to display format
          const mapped: DisplayProduct[] = backendProducts.map((p) => {
            const vendor = backendVendors.find((v) => v.id === p.vendorId);
            return {
              id: p.id.toString(),
              title: p.name,
              vendor: vendor?.name ?? "IIIntl Vendor",
              vendorId: p.vendorId.toString(),
              price: p.price,
              category: p.category || "Merchandise",
              stock: Number(p.stock),
              rating: 4.5,
              reviewCount: 0,
              featured: false,
              region: "Global",
              tags: [p.category],
              createdAt: new Date(
                Number(p.createdAt) / 1_000_000,
              ).toISOString(),
              fromBackend: true,
            };
          });
          setProducts(mapped);
        } else {
          // Fallback to mock data when no backend products exist yet
          const mockMapped: DisplayProduct[] = MOCK_PRODUCTS.map((p) => ({
            id: p.id,
            title: p.title,
            vendor: p.vendor,
            vendorId: p.vendorId,
            price: p.price,
            category: p.category,
            stock: p.stock,
            rating: p.rating,
            reviewCount: p.reviewCount,
            featured: p.featured,
            region: p.region,
            tags: p.tags,
            createdAt: p.createdAt,
          }));
          setProducts(mockMapped);
        }

        if (backendVendors.length > 0) {
          // Map backend vendors to display format
          const mappedVendors: DisplayVendor[] = backendVendors.map((v) => ({
            id: v.id.toString(),
            name: v.name,
            description: v.description,
            region: "Global",
            productCount: backendProducts.filter((p) => p.vendorId === v.id)
              .length,
            rating: 4.5,
            reviewCount: 0,
            fromBackend: true,
          }));
          setVendors(mappedVendors);
        } else {
          // Fallback to mock vendors
          const mockVendors: DisplayVendor[] = MOCK_VENDORS.map((v) => ({
            id: v.id,
            name: v.name,
            description: v.description,
            region: v.region,
            productCount: v.productCount,
            rating: v.rating,
            reviewCount: v.reviewCount,
          }));
          setVendors(mockVendors);
        }
      } catch {
        // On error, fall back to mock data silently
        const mockMapped: DisplayProduct[] = MOCK_PRODUCTS.map((p) => ({
          id: p.id,
          title: p.title,
          vendor: p.vendor,
          vendorId: p.vendorId,
          price: p.price,
          category: p.category,
          stock: p.stock,
          rating: p.rating,
          reviewCount: p.reviewCount,
          featured: p.featured,
          region: p.region,
          tags: p.tags,
          createdAt: p.createdAt,
        }));
        setProducts(mockMapped);
        const mockVendors: DisplayVendor[] = MOCK_VENDORS.map((v) => ({
          id: v.id,
          name: v.name,
          description: v.description,
          region: v.region,
          productCount: v.productCount,
          rating: v.rating,
          reviewCount: v.reviewCount,
        }));
        setVendors(mockVendors);
      } finally {
        setLoading(false);
      }
    }
    fetchStoreData();
  }, [backend]);

  // Filter
  let filtered = products.filter((p) => {
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.vendor.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    const matchCat = category === "all" || p.category === category;
    const matchRegion = region === "All Regions" || p.region === region;
    return matchSearch && matchCat && matchRegion;
  });

  // Sort
  filtered = [...filtered].sort((a, b) => {
    switch (sort) {
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "rating":
        return b.rating - a.rating;
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  const visible = filtered.slice(0, visibleCount);

  // Derive unique categories from loaded products
  const activeCategories = CATEGORIES.filter((cat) =>
    products.some((p) => p.category === cat),
  );

  return (
    <Layout breadcrumb={`${t.sidebar.commerce} \u203a ${t.store.title}`}>
      {/* ── Hero Banner ── */}
      <div className="civic-gradient text-white px-6 py-8 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 70% 50%, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative max-w-5xl">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ShoppingBag size={20} className="text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400 font-display">
                  IIIntl One Marketplace
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight mb-2">
                {t.store.title}
              </h1>
              <p className="text-sm text-white/70 max-w-lg">
                {t.store.subtitle}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {isAdmin && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 bg-white/10 hover:bg-white/20 border-white/20 text-white text-xs"
                      data-ocid="store.become_vendor_button"
                    >
                      <Plus size={12} className="mr-1" />
                      {t.store.becomeVendor}
                    </Button>
                  </DialogTrigger>
                  <DialogContent data-ocid="store.vendor_dialog">
                    <DialogHeader>
                      <DialogTitle>Apply to Become a Vendor</DialogTitle>
                      <DialogDescription>
                        Submit your application to open a storefront on the
                        IIIntl One Marketplace. Our team reviews all
                        applications within 5 business days.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-2 space-y-3">
                      <div className="rounded-lg bg-secondary/60 p-4 text-sm text-foreground/80">
                        Vendor applications are reviewed by the marketplace
                        admin team. Approved vendors gain access to the seller
                        dashboard, order management, and payout tools. All
                        vendors must comply with IIIntl One community standards.
                      </div>
                      <Button
                        className="w-full"
                        data-ocid="store.vendor_dialog_submit_button"
                      >
                        Submit Vendor Application
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        Vendor portal coming soon — applications accepted via
                        email for now.
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
              {isSuperAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 bg-white/10 hover:bg-white/20 border-white/20 text-white text-xs"
                  data-ocid="store.manage_store_button"
                >
                  <Settings size={12} className="mr-1" />
                  {t.store.manageStore}
                </Button>
              )}
              <Link to="/cart">
                <Button
                  size="sm"
                  className="h-8 bg-amber-500 hover:bg-amber-600 text-white text-xs border-0 relative"
                  data-ocid="store.cart_button"
                >
                  <ShoppingCart size={13} className="mr-1.5" />
                  Cart
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-white text-primary text-[9px] font-bold flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 max-w-7xl mx-auto">
        {/* ── Search + Controls ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder={t.store.searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(12);
              }}
              className="pl-9 h-9 text-sm"
              data-ocid="store.search_input"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={region}
              onValueChange={(v) => {
                setRegion(v);
                setVisibleCount(12);
              }}
            >
              <SelectTrigger
                className="h-9 w-36 text-xs"
                data-ocid="store.region_select"
              >
                <Globe size={13} className="mr-1 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REGIONS.map((r) => (
                  <SelectItem key={r} value={r} className="text-xs">
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger
                className="h-9 w-36 text-xs"
                data-ocid="store.sort_select"
              >
                <Filter size={13} className="mr-1 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="text-xs"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center border border-border rounded-md overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "h-9 w-9 flex items-center justify-center transition-colors",
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary",
                )}
                data-ocid="store.grid_view_toggle"
              >
                <Grid3X3 size={14} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={cn(
                  "h-9 w-9 flex items-center justify-center transition-colors",
                  viewMode === "list"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary",
                )}
                data-ocid="store.list_view_toggle"
              >
                <LayoutList size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ── Category Tabs ── */}
        <Tabs
          value={category}
          onValueChange={(v) => {
            setCategory(v);
            setVisibleCount(12);
          }}
          className="mb-6"
        >
          <TabsList className="flex-wrap h-auto gap-1 bg-transparent p-0">
            <TabsTrigger
              value="all"
              className="h-7 px-3 text-xs rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              data-ocid="store.all_tab"
            >
              All Products
              <span className="ml-1.5 text-[9px] opacity-60">
                {products.length}
              </span>
            </TabsTrigger>
            {activeCategories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="h-7 px-3 text-xs rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                data-ocid={`store.${cat.toLowerCase().replace(/[^a-z0-9]/g, "_")}_tab`}
              >
                {cat}
                <span className="ml-1.5 text-[9px] opacity-60">
                  {products.filter((p) => p.category === cat).length}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* ── Results Count ── */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {loading ? (
              <span data-ocid="store.loading_state">Loading products...</span>
            ) : (
              <>
                <span className="font-semibold text-foreground">
                  {filtered.length}
                </span>{" "}
                product{filtered.length !== 1 ? "s" : ""} found
                {search && (
                  <span>
                    {" "}
                    for{" "}
                    <span className="font-medium text-primary">"{search}"</span>
                  </span>
                )}
              </>
            )}
          </p>
        </div>

        {/* ── Product Grid / List ── */}
        {loading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            data-ocid="store.loading_state"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton list
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 text-muted-foreground"
                data-ocid="store.empty_state"
              >
                <ShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-semibold text-foreground/60">
                  No products found
                </p>
                <p className="text-sm mt-1">
                  Try adjusting your search or filters
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 text-xs"
                  onClick={() => {
                    setSearch("");
                    setCategory("all");
                    setRegion("All Regions");
                  }}
                >
                  Clear Filters
                </Button>
              </motion.div>
            ) : viewMode === "grid" ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              >
                {visible.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                {visible.map((product, i) => (
                  <ProductRow key={product.id} product={product} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* ── Load More ── */}
        {!loading && visible.length < filtered.length && (
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              onClick={() => setVisibleCount((c) => c + 12)}
              className="text-sm"
              data-ocid="store.load_more_button"
            >
              Load More
              <span className="ml-2 text-xs text-muted-foreground">
                ({filtered.length - visible.length} remaining)
              </span>
            </Button>
          </div>
        )}

        {/* ── Vendor Spotlight ── */}
        <Separator className="my-10" />
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Store size={16} className="text-primary" />
            <h2 className="text-lg font-bold font-display text-foreground">
              Vendor Spotlight
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Goods and services from IIIntl One certified vendors across the
            globe
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendors.map((vendor, i) => (
            <motion.div
              key={vendor.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: i * 0.05 }}
            >
              <Link
                to="/store/vendor/$vendorId"
                params={{ vendorId: vendor.id }}
              >
                <Card
                  className="group hover:border-primary/30 hover:shadow-sm transition-all duration-200 cursor-pointer p-4"
                  data-ocid={`store.vendor_card.${i + 1}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg civic-gradient flex items-center justify-center flex-shrink-0">
                      <Store size={16} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                          {vendor.name}
                        </h3>
                        <ChevronRight
                          size={14}
                          className="text-muted-foreground flex-shrink-0 group-hover:text-primary transition-colors"
                        />
                      </div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Badge
                          variant="outline"
                          className="text-[9px] px-1.5 h-4 border-border/60 text-muted-foreground"
                        >
                          <Globe size={8} className="mr-0.5" />
                          {vendor.region}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {vendor.productCount} products
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {vendor.description}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <StarRating
                          rating={vendor.rating}
                          count={vendor.reviewCount}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
