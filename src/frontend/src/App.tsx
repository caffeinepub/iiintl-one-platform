import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { I18nProvider } from "@/context/I18nContext";
import { ActivismPage } from "@/pages/ActivismPage";
import { AdminPage } from "@/pages/AdminPage";
import { CampaignDetailPage } from "@/pages/CampaignDetailPage";
import { CampaignsPage } from "@/pages/CampaignsPage";
import { CartPage } from "@/pages/CartPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { DocsPage } from "@/pages/DocsPage";
import { FAQPage } from "@/pages/FAQPage";
import { ForumDetailPage } from "@/pages/ForumDetailPage";
import { ForumsPage } from "@/pages/ForumsPage";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { MembersPage } from "@/pages/MembersPage";
import { OrganizationDetailPage } from "@/pages/OrganizationDetailPage";
import { OrganizationsPage } from "@/pages/OrganizationsPage";
import { ProductDetailPage } from "@/pages/ProductDetailPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ResourcesPage } from "@/pages/ResourcesPage";
import { StorePage } from "@/pages/StorePage";
import { VendorPage } from "@/pages/VendorPage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

// ── Root route ──
const rootRoute = createRootRoute({
  component: () => (
    <I18nProvider>
      <AuthProvider>
        <CartProvider>
          <Outlet />
        </CartProvider>
      </AuthProvider>
    </I18nProvider>
  ),
});

// ── Public routes ──
const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/faq",
  component: FAQPage,
});

const docsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/docs",
  component: DocsPage,
});

const storeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/store",
  component: StorePage,
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/store/$id",
  component: ProductDetailPage,
});

const vendorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/store/vendor/$vendorId",
  component: VendorPage,
});

// ── Protected routes ──
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: () => (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  ),
});

const organizationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/organizations",
  component: () => (
    <ProtectedRoute>
      <OrganizationsPage />
    </ProtectedRoute>
  ),
});

const organizationDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/organizations/$id",
  component: OrganizationDetailPage,
});

const membersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/members",
  component: () => (
    <ProtectedRoute>
      <MembersPage />
    </ProtectedRoute>
  ),
});

const campaignsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/campaigns",
  component: () => (
    <ProtectedRoute>
      <CampaignsPage />
    </ProtectedRoute>
  ),
});

const campaignDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/campaigns/$id",
  component: CampaignDetailPage,
});

const forumsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forums",
  component: () => (
    <ProtectedRoute>
      <ForumsPage />
    </ProtectedRoute>
  ),
});

const forumDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/forums/$id",
  component: ForumDetailPage,
});

const resourcesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/resources",
  component: () => (
    <ProtectedRoute>
      <ResourcesPage />
    </ProtectedRoute>
  ),
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: () => (
    <ProtectedRoute>
      <CartPage />
    </ProtectedRoute>
  ),
});

// Admin route -- requires admin or super_admin role
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: () => (
    <ProtectedRoute requiredRole={["admin", "super_admin"]}>
      <AdminPage />
    </ProtectedRoute>
  ),
});

// Activism Hub page
const activismRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/activism",
  component: () => (
    <ProtectedRoute>
      <ActivismPage />
    </ProtectedRoute>
  ),
});

// ── Route tree ──
const routeTree = rootRoute.addChildren([
  homeRoute,
  loginRoute,
  registerRoute,
  dashboardRoute,
  organizationsRoute,
  organizationDetailRoute,
  membersRoute,
  profileRoute,
  campaignsRoute,
  campaignDetailRoute,
  forumsRoute,
  forumDetailRoute,
  resourcesRoute,
  faqRoute,
  docsRoute,
  storeRoute,
  productDetailRoute,
  vendorRoute,
  cartRoute,
  adminRoute,
  activismRoute,
]);

// ── Router ──
const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
