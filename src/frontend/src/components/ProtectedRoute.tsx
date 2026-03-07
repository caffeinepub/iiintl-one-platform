import { type UserRole, useAuth } from "@/context/AuthContext";
import { useNavigate } from "@tanstack/react-router";
import { ShieldX } from "lucide-react";
import { useEffect } from "react";
import { Layout } from "./Layout";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
}

export function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole)
      ? requiredRole
      : [requiredRole];
    if (!user || !allowedRoles.includes(user.role)) {
      return (
        <Layout breadcrumb="Access Denied">
          <div
            className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-6"
            data-ocid="auth.error_state"
          >
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
              <ShieldX size={36} className="text-destructive" />
            </div>
            <div className="text-center max-w-sm">
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                Access Denied
              </h2>
              <p className="text-muted-foreground text-sm">
                You don&apos;t have the required permissions to view this page.
                Contact your administrator if you believe this is a mistake.
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Required role:{" "}
              <span className="font-semibold text-primary">
                {Array.isArray(requiredRole)
                  ? requiredRole.join(", ")
                  : requiredRole}
              </span>
              {" · "}Your role:{" "}
              <span className="font-semibold text-primary capitalize">
                {user?.role}
              </span>
            </p>
          </div>
        </Layout>
      );
    }
  }

  return <>{children}</>;
}
