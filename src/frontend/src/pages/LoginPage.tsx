import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MOCK_USERS, useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronDown,
  Globe,
  Loader2,
  Terminal,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export function LoginPage() {
  const { loginWithCredentials, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  // Redirect if already authenticated
  if (user) {
    navigate({ to: "/dashboard" });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    // Small delay to show loading state
    await new Promise((r) => setTimeout(r, 400));
    const success = loginWithCredentials(email, password);
    setIsLoading(false);
    if (success) {
      const authedUser = Object.values(MOCK_USERS).find(
        (u) => u.email === email,
      );
      if (authedUser?.role === "admin" || authedUser?.role === "super_admin") {
        navigate({ to: "/admin" });
      } else {
        navigate({ to: "/dashboard" });
      }
    } else {
      setError("Invalid email or password. Try a demo account below.");
    }
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password");
    setError("");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Branding */}
      <div className="hidden lg:flex flex-col justify-between civic-gradient w-2/5 p-12">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
              <span className="text-white font-display font-bold text-lg">
                II
              </span>
            </div>
            <div>
              <p className="font-display font-bold text-white text-lg">
                IIIntl One
              </p>
              <p className="text-white/50 text-xs">Global Civic Platform</p>
            </div>
          </div>
          <h2 className="text-4xl font-display font-bold text-white leading-tight mb-4">
            Independent.
            <br />
            Interdependent.
            <br />
            International.
          </h2>
          <p className="text-white/60 text-base">
            Sign in to access your organizations, campaigns, and community.
          </p>
        </div>
        <div className="flex items-center gap-2 text-white/40 text-sm">
          <Globe size={14} />
          <span>Available worldwide in 5+ languages</span>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-lg civic-gradient flex items-center justify-center">
              <span className="text-white font-display font-bold">II</span>
            </div>
            <div>
              <p className="font-display font-bold text-primary text-base">
                IIIntl One
              </p>
              <p className="text-muted-foreground text-xs">
                Global Civic Platform
              </p>
            </div>
          </div>

          <h1 className="text-2xl font-display font-bold text-primary mb-1">
            Welcome back
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            Sign in to your account to continue
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@organization.org"
                className="h-10"
                data-ocid="login.input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-10"
                data-ocid="login.password_input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2"
                data-ocid="login.error_state"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full h-10 bg-primary hover:bg-primary/90 font-semibold gap-2"
              data-ocid="login.submit_button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={15} />
                </>
              )}
            </Button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6">
            <Collapsible open={demoOpen} onOpenChange={setDemoOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full gap-2 text-xs h-9 border-dashed"
                  data-ocid="login.demo_toggle"
                >
                  <Terminal size={13} className="text-muted-foreground" />
                  Demo accounts
                  <ChevronDown
                    size={12}
                    className={`ml-auto text-muted-foreground transition-transform duration-200 ${
                      demoOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mt-2 rounded-md border border-border bg-secondary/40 p-3 space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                    All passwords: "password"
                  </p>
                  {Object.values(MOCK_USERS).map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => fillDemo(u.email)}
                      className="w-full flex items-center justify-between rounded-md px-2 py-1.5 text-left hover:bg-background transition-colors group"
                      data-ocid={`login.demo_${u.role}_button`}
                    >
                      <div>
                        <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                          {u.name}
                        </span>
                        <span className="ml-2 text-[10px] text-muted-foreground">
                          {u.email}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-primary/70 capitalize">
                        {u.role.replace("_", " ")}
                      </span>
                    </button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          <div className="flex items-center gap-3 my-6">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or</span>
            <Separator className="flex-1" />
          </div>

          <p className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-semibold hover:underline"
              data-ocid="login.register_link"
            >
              Create account
            </Link>
          </p>

          <p className="text-xs text-center text-muted-foreground mt-8">
            © {new Date().getFullYear()}{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
