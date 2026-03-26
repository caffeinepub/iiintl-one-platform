import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { type AuthUser, useAuth } from "@/context/AuthContext";
import { useBackend } from "@/hooks/useBackend";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Fingerprint, Globe, Info, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function RegisterPage() {
  const { login, loginWithII, user } = useAuth();
  const navigate = useNavigate();
  const ii = useInternetIdentity();
  const backend = useBackend();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [sponsorCode, setSponsorCode] = useState<string | null>(null);

  // Read ?ref= from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) setSponsorCode(ref);
  }, []);

  // Auto-login when II identity becomes available
  useEffect(() => {
    if (ii.identity && !user) {
      loginWithII(ii.identity);
      navigate({ to: "/dashboard" });
    }
  }, [ii.identity, user, loginWithII, navigate]);

  // Show error toast on II login failure
  useEffect(() => {
    if (ii.isLoginError) {
      toast.error(
        ii.loginError?.message ??
          "Internet Identity login failed. Please try again.",
      );
    }
  }, [ii.isLoginError, ii.loginError]);

  if (user) {
    navigate({ to: "/dashboard" });
    return null;
  }

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!firstName.trim()) errs.firstName = "First name is required";
    if (!lastName.trim()) errs.lastName = "Last name is required";
    if (!email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = "Enter a valid email address";
    }
    if (!password) {
      errs.password = "Password is required";
    } else if (password.length < 8) {
      errs.password = "Password must be at least 8 characters";
    }
    if (!confirmPassword) {
      errs.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const newUser: AuthUser = {
      id: `new_${Date.now()}`,
      name: `${firstName} ${lastName}`,
      role: "member",
      avatar: null,
      email,
    };
    login(newUser);

    // Initialize MLM record and link sponsor if referral code present
    try {
      if (backend) await backend.initMemberMLM(sponsorCode ?? null);
    } catch {
      // Non-blocking — MLM init failure should not prevent registration
    }

    setIsLoading(false);
    navigate({ to: "/dashboard" });
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
            Join the global civic movement
          </h2>
          <p className="text-white/60 text-base">
            Create your account to connect with organizations and campaigns
            worldwide.
          </p>
        </div>
        <div className="flex items-center gap-2 text-white/40 text-sm">
          <Globe size={14} />
          <span>340+ organizations across 80+ countries</span>
        </div>
      </div>

      {/* Right: Register Form */}
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
            Create your account
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            Join the IIIntl One global platform
          </p>

          {/* Internet Identity — Primary Option */}
          <div className="mb-6">
            <Button
              type="button"
              className="w-full h-12 font-semibold gap-3 text-base bg-primary hover:bg-primary/90 shadow-md"
              data-ocid="register.ii_button"
              onClick={() => ii.login()}
              disabled={ii.isLoggingIn || ii.isInitializing}
            >
              {ii.isLoggingIn ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Connecting to Internet Identity…
                </>
              ) : (
                <>
                  <Fingerprint size={20} />
                  Create account with Internet Identity
                </>
              )}
            </Button>
            <div className="flex items-center justify-center mt-2 gap-1.5">
              <span className="text-[11px] text-muted-foreground/70">
                Powered by
              </span>
              <span className="text-[11px] font-semibold text-muted-foreground/80 tracking-wide">
                Internet Computer · ICP
              </span>
            </div>
          </div>

          {/* Separator */}
          <div className="flex items-center gap-3 mb-6">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">
              or register with email
            </span>
            <Separator className="flex-1" />
          </div>

          {/* Referral notice */}
          {sponsorCode && (
            <div
              className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/60 border border-border/50 rounded-lg px-3 py-2.5 mb-5"
              data-ocid="register.referral_notice"
            >
              <Info size={13} className="mt-0.5 shrink-0 text-primary" />
              <span>
                Referred by a member. Your referral code{" "}
                <code className="font-mono font-bold text-foreground">
                  {sponsorCode}
                </code>{" "}
                will be applied automatically.
              </span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="first_name" className="text-sm font-medium">
                  First name
                </Label>
                <Input
                  id="first_name"
                  placeholder="Alex"
                  className={`h-10 ${errors.firstName ? "border-destructive" : ""}`}
                  data-ocid="register.first_name_input"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                {errors.firstName && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="register.first_name_error"
                  >
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="last_name" className="text-sm font-medium">
                  Last name
                </Label>
                <Input
                  id="last_name"
                  placeholder="Rivera"
                  className={`h-10 ${errors.lastName ? "border-destructive" : ""}`}
                  data-ocid="register.last_name_input"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                {errors.lastName && (
                  <p
                    className="text-xs text-destructive"
                    data-ocid="register.last_name_error"
                  >
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@organization.org"
                className={`h-10 ${errors.email ? "border-destructive" : ""}`}
                data-ocid="register.email_input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              {errors.email && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="register.email_error"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimum 8 characters"
                className={`h-10 ${errors.password ? "border-destructive" : ""}`}
                data-ocid="register.password_input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
              {errors.password && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="register.password_error"
                >
                  {errors.password}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm_password" className="text-sm font-medium">
                Confirm password
              </Label>
              <Input
                id="confirm_password"
                type="password"
                placeholder="Repeat your password"
                className={`h-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                data-ocid="register.confirm_password_input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="register.confirm_password_error"
                >
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-10 bg-primary hover:bg-primary/90 font-semibold gap-2 mt-2"
              data-ocid="register.submit_button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight size={15} />
                </>
              )}
            </Button>
          </form>

          <p className="text-sm text-center text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-semibold hover:underline"
              data-ocid="register.login_link"
            >
              Sign in
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
