import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { type UserRole, useAuth } from "@/context/AuthContext";
import { LANGUAGES, useI18n } from "@/context/I18nContext";
import { useBackend } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  BarChart3,
  Bell,
  BellOff,
  BookMarked,
  BookOpen,
  Building2,
  Calendar,
  CheckCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  FileText,
  Globe,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  MessageSquare,
  Server,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Shuffle,
  Ticket,
  TrendingUp,
  User,
  UserCog,
  Users,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const ROLE_OPTIONS: { role: UserRole; label: string; color: string }[] = [
  { role: "super_admin", label: "Super Admin", color: "text-red-600" },
  { role: "admin", label: "Admin", color: "text-orange-600" },
  { role: "org_admin", label: "Org Admin", color: "text-yellow-600" },
  { role: "member", label: "Member", color: "text-green-600" },
  { role: "activist", label: "Activist", color: "text-blue-600" },
  { role: "guest", label: "Guest", color: "text-gray-500" },
];

interface NavLink {
  to: string;
  label: string;
  icon: React.ReactNode;
  ocid: string;
}

function SidebarContent({
  collapsed,
  onLinkClick,
}: { collapsed: boolean; onLinkClick?: () => void }) {
  const { user } = useAuth();
  const { t } = useI18n();
  const location = useLocation();
  const isAdmin =
    user?.role === "admin" ||
    user?.role === "super_admin" ||
    user?.role === "org_admin";

  const isActive = (to: string) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  const sidebarSections: { title: string; links: NavLink[] }[] = [
    {
      title: t.sidebar.main,
      links: [
        {
          to: "/dashboard",
          label: t.sidebar.dashboard,
          icon: <LayoutDashboard size={16} />,
          ocid: "sidebar.dashboard_link",
        },
        {
          to: "/campaign-hub",
          label: "Campaign Hub",
          icon: <Megaphone size={16} />,
          ocid: "sidebar.campaign_hub_link",
        },
        {
          to: "/organizations",
          label: t.sidebar.organizations,
          icon: <Building2 size={16} />,
          ocid: "sidebar.orgs_link",
        },
        {
          to: "/campaigns",
          label: t.sidebar.campaigns,
          icon: <Megaphone size={16} />,
          ocid: "sidebar.campaigns_link",
        },
        {
          to: "/activism",
          label: t.sidebar.activism,
          icon: <Zap size={16} />,
          ocid: "sidebar.activism_link",
        },
      ],
    },
    {
      title: t.sidebar.community,
      links: [
        {
          to: "/forums",
          label: t.sidebar.forums,
          icon: <MessageSquare size={16} />,
          ocid: "sidebar.forums_link",
        },
        {
          to: "/members",
          label: t.sidebar.members,
          icon: <Users size={16} />,
          ocid: "sidebar.members_link",
        },
        {
          to: "/members",
          label: t.sidebar.directory,
          icon: <BookMarked size={16} />,
          ocid: "sidebar.directory_link",
        },
      ],
    },
    {
      title: t.sidebar.knowledge,
      links: [
        {
          to: "/resources",
          label: t.sidebar.resources,
          icon: <BookOpen size={16} />,
          ocid: "sidebar.resources_link",
        },
        {
          to: "/faq",
          label: t.sidebar.faq,
          icon: <HelpCircle size={16} />,
          ocid: "sidebar.faq_link",
        },
        {
          to: "/docs",
          label: t.sidebar.documentation,
          icon: <FileText size={16} />,
          ocid: "sidebar.docs_link",
        },
      ],
    },
    {
      title: t.sidebar.commerce,
      links: [
        {
          to: "/store",
          label: t.sidebar.store,
          icon: <ShoppingBag size={16} />,
          ocid: "sidebar.store_link",
        },
        {
          to: "/cart",
          label: t.sidebar.orders,
          icon: <ShoppingCart size={16} />,
          ocid: "sidebar.orders_link",
        },
        {
          to: "/wallet",
          label: "Wallet",
          icon: <Wallet size={16} />,
          ocid: "sidebar.wallet_link",
        },
        {
          to: "/tenant",
          label: "My Plan",
          icon: <Server size={16} />,
          ocid: "sidebar.myplan_link",
        },
        {
          to: "/crowdfunding",
          label: "Crowdfunding",
          icon: <DollarSign size={16} />,
          ocid: "sidebar.crowdfunding_link",
        },
        {
          to: "/mlm",
          label: "Rewards & MLM",
          icon: <TrendingUp size={16} />,
          ocid: "sidebar.mlm_link",
        },
        {
          to: "/events",
          label: "Events",
          icon: <Calendar size={16} />,
          ocid: "sidebar.events_link",
        },
        {
          to: "/my-tickets",
          label: "My Tickets",
          icon: <Ticket size={16} />,
          ocid: "sidebar.mytickets_link",
        },
      ],
    },
  ];

  const adminLinks: NavLink[] = [
    {
      to: "/admin",
      label: t.sidebar.users,
      icon: <UserCog size={16} />,
      ocid: "sidebar.admin_link",
    },
    {
      to: "/admin",
      label: t.sidebar.settings,
      icon: <Settings size={16} />,
      ocid: "sidebar.settings_link",
    },
    {
      to: "/admin",
      label: t.sidebar.reports,
      icon: <BarChart3 size={16} />,
      ocid: "sidebar.reports_link",
    },
  ];

  return (
    <ScrollArea className="flex-1 overflow-y-auto">
      <div className="py-3">
        {sidebarSections.map((section) => (
          <div key={section.title} className="mb-1">
            {!collapsed && (
              <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400 font-display">
                {section.title}
              </p>
            )}
            {section.links.map((link) => (
              <Link
                key={link.ocid}
                to={link.to}
                data-ocid={link.ocid}
                onClick={onLinkClick}
                className={cn(
                  "flex items-center gap-3 mx-2 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 group",
                  isActive(link.to)
                    ? "bg-sidebar-accent text-white border-l-[3px] border-sidebar-primary"
                    : "text-slate-300 hover:bg-sidebar-accent/50 hover:text-white",
                  collapsed && "justify-center px-2",
                )}
              >
                <span
                  className={cn(
                    "flex-shrink-0 opacity-80 group-hover:opacity-100",
                    isActive(link.to) && "opacity-100",
                  )}
                >
                  {link.icon}
                </span>
                {!collapsed && <span>{link.label}</span>}
              </Link>
            ))}
            {!collapsed && <div className="my-2 mx-4 opacity-20 civic-rule" />}
          </div>
        ))}

        {isAdmin && (
          <div className="mb-1">
            {!collapsed && (
              <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-amber-300/90 font-display">
                {t.sidebar.admin}
              </p>
            )}
            {adminLinks.map((link) => (
              <Link
                key={link.ocid}
                to={link.to}
                data-ocid={link.ocid}
                onClick={onLinkClick}
                className={cn(
                  "flex items-center gap-3 mx-2 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 group",
                  isActive(link.to)
                    ? "bg-sidebar-primary/20 text-amber-300 border-l-[3px] border-sidebar-primary"
                    : "text-slate-300 hover:bg-sidebar-accent/50 hover:text-white",
                  collapsed && "justify-center px-2",
                )}
              >
                <span className="flex-shrink-0">{link.icon}</span>
                {!collapsed && <span>{link.label}</span>}
              </Link>
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

interface LayoutProps {
  children: React.ReactNode;
  breadcrumb?: string;
  hideFooter?: boolean;
}

interface NotifItem {
  id: bigint;
  title: string;
  message: string;
  isRead: boolean;
  notifType: string;
  createdAt: bigint;
  entityId: string | null;
}
interface NotifBackend {
  getMyNotifications(): Promise<NotifItem[]>;
  getUnreadCount(): Promise<bigint>;
  markNotificationRead(id: bigint): Promise<void>;
  markAllNotificationsRead(): Promise<void>;
}

export function Layout({ children, breadcrumb, hideFooter }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState<NotifItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const { user, logout, switchRole, isAuthenticated } = useAuth();
  const actor = useBackend();
  const { language, setLanguage, t } = useI18n();

  useEffect(() => {
    const handleScroll = () => {
      const mainEl = document.querySelector("main");
      setScrolled(mainEl ? mainEl.scrollTop > 8 : window.scrollY > 8);
    };
    const mainEl = document.querySelector("main");
    if (mainEl) {
      mainEl.addEventListener("scroll", handleScroll, { passive: true });
      return () => mainEl.removeEventListener("scroll", handleScroll);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !actor) return;
    const nb = actor as unknown as NotifBackend;
    const fetchNotifs = async () => {
      try {
        const notifs = await nb.getMyNotifications();
        setNotifications(notifs);
        const count = await nb.getUnreadCount();
        setUnreadCount(Number(count));
      } catch {
        // silently fail
      }
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, actor]);

  const markRead = async (id: bigint) => {
    try {
      const nb = actor as unknown as NotifBackend;
      await nb.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {
      /* ignore */
    }
  };

  const markAllRead = async () => {
    try {
      const nb = actor as unknown as NotifBackend;
      await nb.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      /* ignore */
    }
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "??";

  return (
    <div className="flex min-h-screen bg-background">
      {/* ── Desktop Sidebar (only when authenticated) ── */}
      {isAuthenticated && (
        <aside
          className={cn(
            "hidden lg:flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out flex-shrink-0 relative",
            sidebarCollapsed ? "w-16" : "w-64",
          )}
          style={{ minHeight: "100vh" }}
        >
          {/* Sidebar Header */}
          <div className="flex items-center h-16 px-4 border-b border-sidebar-border flex-shrink-0">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-8 h-8 rounded-md civic-gradient flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-display font-bold text-sm">
                    II
                  </span>
                </div>
                <div className="overflow-hidden">
                  <p className="font-display font-bold text-sidebar-foreground text-sm leading-tight truncate">
                    IIIntl One
                  </p>
                  <p className="text-[9px] text-slate-400 truncate leading-tight">
                    Independent · Interdependent
                  </p>
                </div>
              </div>
            )}
            {sidebarCollapsed && (
              <div className="w-8 h-8 rounded-md civic-gradient flex items-center justify-center mx-auto">
                <span className="text-white font-display font-bold text-sm">
                  II
                </span>
              </div>
            )}
          </div>

          {/* Sidebar Navigation */}
          <SidebarContent collapsed={sidebarCollapsed} />

          {/* Collapse Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-20 h-6 w-6 rounded-full bg-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent border border-sidebar-border p-0 z-10"
            data-ocid="sidebar.collapse_toggle"
          >
            {sidebarCollapsed ? (
              <ChevronRight size={12} />
            ) : (
              <ChevronLeft size={12} />
            )}
          </Button>

          {/* Sidebar Footer */}
          <div className="border-t border-sidebar-border p-3 flex-shrink-0">
            {user && (
              <div
                className={cn(
                  "flex items-center gap-2",
                  sidebarCollapsed && "justify-center",
                )}
              >
                <Avatar className="h-7 w-7 flex-shrink-0">
                  <AvatarImage src={user.avatar ?? undefined} />
                  <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {!sidebarCollapsed && (
                  <div className="overflow-hidden flex-1 min-w-0">
                    <p className="text-xs font-semibold text-sidebar-foreground truncate">
                      {user.name}
                    </p>
                    <Badge
                      variant="outline"
                      className="text-[9px] py-0 px-1 h-4 border-sidebar-primary/40 text-sidebar-primary capitalize"
                    >
                      {user.role.replace("_", " ")}
                    </Badge>
                    <div className="mt-1">
                      <Link
                        to="/profile"
                        className="text-[10px] text-slate-400 hover:text-white transition-colors underline-offset-2 hover:underline"
                        data-ocid="sidebar.view_profile_link"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </aside>
      )}

      {/* ── Main Column ── */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* ── Top Navigation Bar ── */}
        <header
          className={cn(
            "h-16 bg-white border-b border-border flex items-center px-4 lg:px-6 gap-4 flex-shrink-0 z-20 transition-shadow duration-200",
            scrolled ? "shadow-topbar-scrolled" : "shadow-topbar",
          )}
        >
          {/* Mobile menu trigger (only when authenticated) */}
          {isAuthenticated && (
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden h-9 w-9 p-0"
                  data-ocid="nav.mobile_menu_button"
                >
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="p-0 w-72 bg-sidebar border-sidebar-border"
                data-ocid="nav.mobile_sheet"
              >
                {/* Mobile Sheet Header */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-md civic-gradient flex items-center justify-center">
                      <span className="text-white font-display font-bold text-sm">
                        II
                      </span>
                    </div>
                    <div>
                      <p className="font-display font-bold text-sidebar-foreground text-sm">
                        IIIntl One
                      </p>
                      <p className="text-[9px] text-slate-400">
                        Independent · Interdependent
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMobileOpen(false)}
                    className="h-7 w-7 p-0 text-sidebar-foreground hover:bg-sidebar-accent"
                  >
                    <X size={16} />
                  </Button>
                </div>
                {/* Mobile Sidebar Nav */}
                <div
                  className="flex flex-col"
                  style={{ height: "calc(100vh - 4rem)" }}
                >
                  <SidebarContent
                    onLinkClick={() => setMobileOpen(false)}
                    collapsed={false}
                  />
                  {/* Mobile footer */}
                  <div className="border-t border-sidebar-border p-3">
                    {user && (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs font-bold">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-sidebar-foreground truncate">
                            {user.name}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}

          {/* Logo (desktop, visible in topbar) */}
          <Link
            to="/"
            className="hidden lg:flex items-center gap-2 mr-2 group"
            data-ocid="nav.topbar_home_link"
          >
            <div className="w-7 h-7 rounded-md civic-gradient flex items-center justify-center flex-shrink-0 group-hover:opacity-90 transition-opacity">
              <span className="text-white font-display font-bold text-xs">
                II
              </span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-primary text-sm tracking-tight">
                IIIntl One
              </span>
              <span className="text-[9px] text-muted-foreground/70 tracking-wide">
                Independent · Interdependent
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 flex-1">
            {[
              { to: "/", label: t.nav.home, ocid: "nav.home_link" },
              {
                to: "/campaign-hub",
                label: "Campaign Hub",
                ocid: "nav.campaign_hub_link",
              },
              {
                to: "/organizations",
                label: t.nav.organizations,
                ocid: "nav.orgs_link",
              },
              {
                to: "/campaigns",
                label: t.nav.campaigns,
                ocid: "nav.campaigns_link",
              },
              { to: "/forums", label: t.nav.forums, ocid: "nav.forums_link" },
              {
                to: "/resources",
                label: t.nav.resources,
                ocid: "nav.resources_link",
              },
              { to: "/store", label: t.nav.store, ocid: "nav.store_link" },
              { to: "/pricing", label: "Pricing", ocid: "nav.pricing_link" },
              { to: "/wallet", label: "Wallet", ocid: "nav.wallet_link" },
            ].map((link) => (
              <Link
                key={link.ocid}
                to={link.to}
                data-ocid={link.ocid}
                className="px-3 py-1.5 text-sm font-medium text-foreground/70 hover:text-primary hover:bg-secondary rounded-md transition-colors"
                activeProps={{
                  className: "text-primary bg-secondary font-semibold",
                }}
                activeOptions={{ exact: link.to === "/" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile center logo */}
          <div className="lg:hidden flex items-center gap-2 flex-1 justify-center">
            <div className="w-7 h-7 rounded-md civic-gradient flex items-center justify-center">
              <span className="text-white font-display font-bold text-xs">
                II
              </span>
            </div>
            <span className="font-display font-bold text-primary text-sm">
              IIIntl One
            </span>
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Notification Bell (authenticated users only) */}
            {isAuthenticated && (
              <Popover open={notifOpen} onOpenChange={setNotifOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 relative"
                    data-ocid="nav.notifications_button"
                    aria-label="Notifications"
                  >
                    <Bell size={16} className="text-muted-foreground" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 ring-2 ring-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  className="w-80 p-0"
                  data-ocid="nav.notifications_panel"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b">
                    <span className="font-semibold text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs gap-1"
                        onClick={markAllRead}
                        data-ocid="nav.notifications_mark_all_button"
                      >
                        <CheckCheck size={11} /> Mark all read
                      </Button>
                    )}
                  </div>
                  <ScrollArea className="max-h-80">
                    {notifications.length === 0 ? (
                      <div
                        className="flex flex-col items-center py-8 text-muted-foreground gap-2"
                        data-ocid="nav.notifications_empty_state"
                      >
                        <BellOff size={20} />
                        <p className="text-xs">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map((n, i) => (
                        <button
                          key={String(n.id)}
                          type="button"
                          className={cn(
                            "w-full text-left px-4 py-3 hover:bg-secondary/50 border-b last:border-0 transition-colors",
                            !n.isRead && "bg-blue-50/40",
                          )}
                          onClick={() => markRead(n.id)}
                          data-ocid={`nav.notification.item.${i + 1}`}
                        >
                          <div className="flex items-start gap-2">
                            {!n.isRead && (
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium leading-snug">
                                {n.title}
                              </p>
                              <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                                {n.message}
                              </p>
                              <p className="text-[10px] text-muted-foreground/60 mt-1">
                                {new Date(
                                  Number(n.createdAt) / 1_000_000,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </ScrollArea>
                </PopoverContent>
              </Popover>
            )}

            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-semibold border-border"
                  data-ocid="nav.language_select"
                >
                  <Globe size={13} className="text-muted-foreground" />
                  {language}
                  <ChevronDown size={11} className="text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-40"
                data-ocid="nav.language_dropdown_menu"
              >
                {LANGUAGES.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={cn(
                      "text-sm",
                      language === lang.code && "font-semibold text-primary",
                    )}
                    data-ocid={`nav.language_${lang.code.toLowerCase()}`}
                  >
                    <span className="font-mono text-xs text-muted-foreground w-8">
                      {lang.code}
                    </span>
                    {lang.label}
                    {lang.dir === "rtl" && (
                      <span className="ml-auto text-[9px] text-muted-foreground">
                        RTL
                      </span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" className="h-5 hidden sm:block" />

            {/* Unauthenticated: Login + Register CTAs */}
            {!isAuthenticated && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-sm font-medium"
                  asChild
                  data-ocid="nav.login_button"
                >
                  <Link to="/login">{t.nav.signIn}</Link>
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-sm font-semibold bg-primary hover:bg-primary/90"
                  asChild
                  data-ocid="nav.register_button"
                >
                  <Link to="/register">{t.nav.getStarted}</Link>
                </Button>
              </div>
            )}

            {/* Authenticated: User Dropdown */}
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 px-2"
                    data-ocid="nav.user_dropdown_menu"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user?.avatar ?? undefined} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">
                      {user?.name?.split(" ")[0]}
                    </span>
                    <ChevronDown
                      size={12}
                      className="text-muted-foreground hidden sm:block"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                    <Badge
                      variant="outline"
                      className="mt-1 text-[10px] capitalize border-primary/30 text-primary"
                    >
                      {user?.role.replace("_", " ")}
                    </Badge>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 cursor-pointer"
                      data-ocid="nav.profile_link"
                    >
                      <User size={14} /> {t.nav.profile}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 cursor-pointer"
                      data-ocid="nav.dashboard_link"
                    >
                      <LayoutDashboard size={14} /> {t.nav.dashboard}
                    </Link>
                  </DropdownMenuItem>
                  {(user?.role === "admin" || user?.role === "super_admin") && (
                    <DropdownMenuItem asChild>
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 cursor-pointer"
                        data-ocid="nav.admin_link"
                      >
                        <Settings size={14} /> {t.nav.adminPanel}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link
                      to="/tenant"
                      className="flex items-center gap-2 cursor-pointer"
                      data-ocid="nav.myplan_link"
                    >
                      <Server size={14} /> My Plan
                    </Link>
                  </DropdownMenuItem>

                  {/* Role Switcher (Demo) */}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <Shuffle size={11} />
                    {t.nav.switchRole}
                  </DropdownMenuLabel>
                  {ROLE_OPTIONS.map((opt) => (
                    <DropdownMenuItem
                      key={opt.role}
                      onClick={() => switchRole(opt.role)}
                      className={cn(
                        "cursor-pointer text-sm pl-6",
                        user?.role === opt.role && "font-semibold",
                        opt.color,
                      )}
                      data-ocid={`nav.switch_role_${opt.role}`}
                    >
                      {opt.label}
                      {user?.role === opt.role && (
                        <span className="ml-auto text-[10px] text-muted-foreground">
                          current
                        </span>
                      )}
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-destructive focus:text-destructive cursor-pointer"
                    data-ocid="nav.logout_button"
                  >
                    <LogOut size={14} className="mr-2" /> {t.nav.logout}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>

        {/* Breadcrumb bar */}
        {breadcrumb && (
          <div className="bg-secondary/30 border-b border-border px-6 py-2.5 flex items-center gap-1.5">
            <Link
              to="/"
              className="text-xs text-primary/50 hover:text-primary font-medium transition-colors"
              data-ocid="breadcrumb.home_link"
            >
              IIIntl One
            </Link>
            <span className="text-border text-xs">/</span>
            <span className="text-xs text-foreground/70 font-medium">
              {breadcrumb}
            </span>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key="page-content"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Footer */}
        {!hideFooter && (
          <footer className="border-t border-border bg-white px-6 py-4 flex-shrink-0">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded civic-gradient flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-display font-bold text-[9px]">
                    II
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  © {new Date().getFullYear()} IIIntl One — Independent ·
                  Interdependent · International
                </p>
              </div>
              <div className="flex items-center gap-4">
                <nav
                  className="flex items-center gap-3"
                  aria-label="Footer navigation"
                >
                  {[
                    {
                      to: "/campaign-hub",
                      label: "Campaign Hub",
                      ocid: "footer.campaign_hub_link",
                    },
                    { to: "/faq", label: "FAQ", ocid: "footer.faq_link" },
                    { to: "/docs", label: "Docs", ocid: "footer.docs_link" },
                    { to: "/store", label: "Store", ocid: "footer.store_link" },
                    {
                      to: "/organizations",
                      label: "Orgs",
                      ocid: "footer.orgs_link",
                    },
                    {
                      to: "/forums",
                      label: "Forums",
                      ocid: "footer.forums_link",
                    },
                    {
                      to: "/pricing",
                      label: "Pricing",
                      ocid: "footer.pricing_link",
                    },
                    {
                      to: "/legal/privacy",
                      label: "Privacy",
                      ocid: "footer.privacy_link",
                    },
                    {
                      to: "/legal/terms",
                      label: "Terms",
                      ocid: "footer.terms_link",
                    },
                    {
                      to: "/legal/sla",
                      label: "SLA",
                      ocid: "footer.sla_link",
                    },
                  ].map((link) => (
                    <Link
                      key={link.ocid}
                      to={link.to}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                      data-ocid={link.ocid}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <Separator
                  orientation="vertical"
                  className="h-3 hidden sm:block"
                />
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Built with ♥ using{" "}
                  <a
                    href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    caffeine.ai
                  </a>
                </p>
              </div>
            </div>
          </footer>
        )}
      </div>
    </div>
  );
}
