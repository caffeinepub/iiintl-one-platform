import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";
import { motion } from "motion/react";
import { Layout } from "./Layout";

interface ShellPageProps {
  title: string;
  description?: string;
  breadcrumb?: string;
  phase?: string;
}

export function ShellPage({
  title,
  description,
  breadcrumb,
  phase,
}: ShellPageProps) {
  return (
    <Layout breadcrumb={breadcrumb ?? title}>
      <div className="p-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-display font-bold text-primary tracking-tight">
                {title}
              </h1>
              <Badge
                variant="outline"
                className="text-xs border-accent text-accent-foreground bg-accent/10"
              >
                {phase ?? "Phase B+"}
              </Badge>
            </div>
            {description && (
              <p className="text-muted-foreground text-base max-w-xl">
                {description}
              </p>
            )}
            <div className="mt-4 civic-rule w-16" />
          </div>

          {/* Coming Soon Card */}
          <Card className="border-2 border-dashed border-border bg-secondary/30">
            <CardContent className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/5 border-2 border-primary/10 flex items-center justify-center">
                <Construction size={28} className="text-primary/40" />
              </div>
              <div className="text-center max-w-sm">
                <p className="font-display font-semibold text-foreground text-lg mb-1">
                  Coming in the next build phase
                </p>
                <p className="text-sm text-muted-foreground">
                  This section is part of the IIIntl One Platform build roadmap
                  and will be fully implemented in an upcoming phase. The
                  navigation and layout are live.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {[
                  "Data models",
                  "API integration",
                  "UI components",
                  "Mock data",
                ].map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}
