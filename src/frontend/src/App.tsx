import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import {
  I18nProvider,
  LANGUAGES,
  type Language,
  useI18n,
} from "@/context/I18nContext";
import { WalletProvider, useWallet } from "@/context/WalletContext";
import { useBackend } from "@/hooks/useBackend";
import { ActivismPage } from "@/pages/ActivismPage";
import { AdminPage } from "@/pages/AdminPage";
import { CampaignDetailPage } from "@/pages/CampaignDetailPage";
import { CampaignHubPage } from "@/pages/CampaignHubPage";
import { CampaignsPage } from "@/pages/CampaignsPage";
import { CartPage } from "@/pages/CartPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { DocsPage } from "@/pages/DocsPage";
import { EventDetailPage } from "@/pages/EventDetailPage";
import { EventsPage } from "@/pages/EventsPage";
import { FAQPage } from "@/pages/FAQPage";
import { ForumDetailPage } from "@/pages/ForumDetailPage";
import { ForumsPage } from "@/pages/ForumsPage";
import { HomePage } from "@/pages/HomePage";
import { LoginPage } from "@/pages/LoginPage";
import { MLMPage } from "@/pages/MLMPage";
import { MembersPage } from "@/pages/MembersPage";
import { MyTicketsPage } from "@/pages/MyTicketsPage";
import { OrganizationDetailPage } from "@/pages/OrganizationDetailPage";
import { OrganizationsPage } from "@/pages/OrganizationsPage";
import { PricingPage } from "@/pages/PricingPage";
import { PrivacyPolicyPage } from "@/pages/PrivacyPolicyPage";
import { ProductDetailPage } from "@/pages/ProductDetailPage";
import { ProfilePage } from "@/pages/ProfilePage";
import { ReferralLandingPage } from "@/pages/ReferralLandingPage";
import { RegisterPage } from "@/pages/RegisterPage";
import { ResourcesPage } from "@/pages/ResourcesPage";
import { SLAPage } from "@/pages/SLAPage";
import { StorePage } from "@/pages/StorePage";
import { TenantAdminPage } from "@/pages/TenantAdminPage";
import { TermsOfServicePage } from "@/pages/TermsOfServicePage";
import { VendorPage } from "@/pages/VendorPage";
import { WalletPage } from "@/pages/WalletPage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { useEffect, useRef } from "react";

// Syncs backend actor into WalletContext
function WalletSync() {
  const actor = useBackend();
  const { _setActor, refreshWallets } = useWallet();
  useEffect(() => {
    _setActor(actor);
    if (actor) refreshWallets();
  }, [actor, _setActor, refreshWallets]);
  return null;
}

// Syncs language preference with backend
function LanguageSync() {
  const actor = useBackend();
  const { language, setLanguage } = useI18n();
  const hasLoaded = useRef(false);

  // On login: load preferred language from backend
  useEffect(() => {
    if (actor && !hasLoaded.current) {
      hasLoaded.current = true;
      actor
        .getPreferredLanguage()
        .then((lang: string) => {
          const code = lang.toUpperCase() as Language;
          if (LANGUAGES.find((l) => l.code === code)) {
            setLanguage(code);
          }
        })
        .catch(() => {});
    }
    if (!actor) {
      hasLoaded.current = false;
    }
  }, [actor, setLanguage]);

  // On language change: persist to backend
  useEffect(() => {
    if (actor && hasLoaded.current) {
      actor.setPreferredLanguage(language.toLowerCase()).catch(() => {});
    }
  }, [language, actor]);

  return null;
}

// ── Root route ──
const rootRoute = createRootRoute({
  component: () => (
    <I18nProvider>
      <AuthProvider>
        <WalletProvider>
          <WalletSync />
          <LanguageSync />
          <CartProvider>
            <Outlet />
          </CartProvider>
        </WalletProvider>
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

const mlmRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/mlm",
  component: () => (
    <ProtectedRoute>
      <MLMPage />
    </ProtectedRoute>
  ),
});

const eventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events",
  component: EventsPage,
});

const eventDetailRoute2 = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events/$id",
  component: EventDetailPage,
});

const myTicketsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-tickets",
  component: () => (
    <ProtectedRoute>
      <MyTicketsPage />
    </ProtectedRoute>
  ),
});

const joinRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/join",
  component: ReferralLandingPage,
});

const campaignHubRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/campaign-hub",
  component: CampaignHubPage,
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

const pricingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pricing",
  component: () => <PricingPage />,
});

const tenantRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/tenant",
  component: () => (
    <ProtectedRoute>
      <TenantAdminPage />
    </ProtectedRoute>
  ),
});

const walletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/wallet",
  component: () => (
    <ProtectedRoute>
      <WalletPage />
    </ProtectedRoute>
  ),
});
const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/legal/privacy",
  component: PrivacyPolicyPage,
});
const slaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/legal/sla",
  component: SLAPage,
});
const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/legal/terms",
  component: TermsOfServicePage,
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
  walletRoute,
  pricingRoute,
  tenantRoute,
  privacyRoute,
  termsRoute,
  slaRoute,
  campaignHubRoute,
  mlmRoute,
  eventsRoute,
  eventDetailRoute2,
  myTicketsRoute,
  joinRoute,
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
