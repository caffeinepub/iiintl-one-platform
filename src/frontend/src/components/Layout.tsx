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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { type UserRole, useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import {
  BarChart3,
  BookMarked,
  BookOpen,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Globe,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  MessageSquare,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Shuffle,
  User,
  UserCog,
  Users,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const LANGUAGES = [
  { code: "EN", label: "English" },
  { code: "FR", label: "Français" },
  { code: "ES", label: "Español" },
  { code: "AR", label: "العربية" },
  { code: "ZH", label: "中文" },
];

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

const SIDEBAR_SECTIONS: { title: string; links: NavLink[] }[] = [
  {
    title: "Main",
    links: [
      {
        to: "/dashboard",
        label: "Dashboard",
        icon: <LayoutDashboard size={16} />,
        ocid: "sidebar.dashboard_link",
      },
      {
        to: "/organizations",
        label: "Organizations",
        icon: <Building2 size={16} />,
        ocid: "sidebar.orgs_link",
      },
      {
        to: "/campaigns",
        label: "Campaigns",
        icon: <Megaphone size={16} />,
        ocid: "sidebar.campaigns_link",
      },
      {
        to: "/activism",
        label: "Activism",
        icon: <Zap size={16} />,
        ocid: "sidebar.activism_link",
      },
    ],
  },
  {
    title: "Community",
    links: [
      {
        to: "/forums",
        label: "Forums",
        icon: <MessageSquare size={16} />,
        ocid: "sidebar.forums_link",
      },
      {
        to: "/members",
        label: "Members",
        icon: <Users size={16} />,
        ocid: "sidebar.members_link",
      },
      {
        to: "/members",
        label: "Directory",
        icon: <BookMarked size={16} />,
        ocid: "sidebar.directory_link",
      },
    ],
  },
  {
    title: "Knowledge",
    links: [
      {
        to: "/resources",
        label: "Resources",
        icon: <BookOpen size={16} />,
        ocid: "sidebar.resources_link",
      },
      {
        to: "/faq",
        label: "FAQ",
        icon: <HelpCircle size={16} />,
        ocid: "sidebar.faq_link",
      },
      {
        to: "/docs",
        label: "Documentation",
        icon: <FileText size={16} />,
        ocid: "sidebar.docs_link",
      },
    ],
  },
  {
    title: "Commerce",
    links: [
      {
        to: "/store",
        label: "Store",
        icon: <ShoppingBag size={16} />,
        ocid: "sidebar.store_link",
      },
      {
        to: "/cart",
        label: "Orders",
        icon: <ShoppingCart size={16} />,
        ocid: "sidebar.orders_link",
      },
    ],
  },
];

const ADMIN_LINKS: NavLink[] = [
  {
    to: "/admin",
    label: "Users",
    icon: <UserCog size={16} />,
    ocid: "sidebar.admin_link",
  },
  {
    to: "/admin",
    label: "Settings",
    icon: <Settings size={16} />,
    ocid: "sidebar.settings_link",
  },
  {
    to: "/admin",
    label: "Reports",
    icon: <BarChart3 size={16} />,
    ocid: "sidebar.reports_link",
  },
];

const TOP_NAV_LINKS = [
  { to: "/", label: "Home", ocid: "nav.home_link" },
  { to: "/organizations", label: "Organizations", ocid: "nav.orgs_link" },
  { to: "/campaigns", label: "Campaigns", ocid: "nav.campaigns_link" },
  { to: "/forums", label: "Forums", ocid: "nav.forums_link" },
  { to: "/resources", label: "Resources", ocid: "nav.resources_link" },
  { to: "/store", label: "Store", ocid: "nav.store_link" },
];

function SidebarContent({
  collapsed,
  onLinkClick,
}: { collapsed: boolean; onLinkClick?: () => void }) {
  const { user } = useAuth();
  const location = useLocation();
  const isAdmin =
    user?.role === "admin" ||
    user?.role === "super_admin" ||
    user?.role === "org_admin";

  const isActive = (to: string) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  return (
    <ScrollArea className="flex-1 overflow-y-auto">
      <div className="py-3">
        {SIDEBAR_SECTIONS.map((section) => (
          <div key={section.title} className="mb-1">
            {!collapsed && (
              <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40 font-display">
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
                    ? "bg-sidebar-accent text-sidebar-accent-foreground border-l-[3px] border-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
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
              <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-sidebar-primary/80 font-display">
                Admin
              </p>
            )}
            {ADMIN_LINKS.map((link) => (
              <Link
                key={link.ocid}
                to={link.to}
                data-ocid={link.ocid}
                onClick={onLinkClick}
                className={cn(
                  "flex items-center gap-3 mx-2 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 group",
                  isActive(link.to)
                    ? "bg-sidebar-primary/20 text-sidebar-primary border-l-[3px] border-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
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
}

export function Layout({ children, breadcrumb }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeLang, setActiveLang] = useState("EN");
  const { user, logout, switchRole, isAuthenticated } = useAuth();

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
                  <p className="text-[9px] text-sidebar-foreground/50 truncate leading-tight">
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
        <header className="h-16 bg-white border-b border-border flex items-center px-4 lg:px-6 gap-4 flex-shrink-0 shadow-xs z-20">
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
                      <p className="text-[9px] text-sidebar-foreground/50">
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
                          <p className="text-[10px] text-sidebar-foreground/60 truncate">
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
            className="hidden lg:flex items-center gap-2 mr-2"
            data-ocid="nav.topbar_home_link"
          >
            <div className="civic-rule w-6" style={{ height: "2px" }} />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 flex-1">
            {TOP_NAV_LINKS.map((link) => (
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
                  {activeLang}
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
                    onClick={() => setActiveLang(lang.code)}
                    className={cn(
                      "text-sm",
                      activeLang === lang.code && "font-semibold text-primary",
                    )}
                  >
                    <span className="font-mono text-xs text-muted-foreground w-8">
                      {lang.code}
                    </span>
                    {lang.label}
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
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-sm font-semibold bg-primary hover:bg-primary/90"
                  asChild
                  data-ocid="nav.register_button"
                >
                  <Link to="/register">Get Started</Link>
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
                      <User size={14} /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 cursor-pointer"
                      data-ocid="nav.dashboard_link"
                    >
                      <LayoutDashboard size={14} /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {(user?.role === "admin" || user?.role === "super_admin") && (
                    <DropdownMenuItem asChild>
                      <Link
                        to="/admin"
                        className="flex items-center gap-2 cursor-pointer"
                        data-ocid="nav.admin_link"
                      >
                        <Settings size={14} /> Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}

                  {/* Role Switcher (Demo) */}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <Shuffle size={11} />
                    Switch Role (Demo)
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
                    <LogOut size={14} className="mr-2" /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>

        {/* Breadcrumb bar */}
        {breadcrumb && (
          <div className="bg-secondary/40 border-b border-border px-6 py-2">
            <p className="text-xs text-muted-foreground font-medium tracking-wide">
              <span className="text-primary/60">IIIntl One</span>
              <span className="mx-2 text-border">›</span>
              <span>{breadcrumb}</span>
            </p>
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
        <footer className="border-t border-border bg-white px-6 py-3 flex-shrink-0">
          <p className="text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} IIIntl One Platform — Independent ·
            Interdependent · International. Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
