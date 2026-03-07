import { Layout } from "@/components/Layout";
import { RoleGate } from "@/components/RoleGate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  Calendar,
  ExternalLink,
  FileText,
  Film,
  Globe,
  Grid3x3,
  Layers,
  LayoutList,
  Package,
  Plus,
  Search,
  Tag,
  Wrench,
} from "lucide-react";
import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ResourceCategory =
  | "Guides & Toolkits"
  | "Research & Reports"
  | "Policy Briefs"
  | "Training Materials"
  | "Multimedia";

type ResourceType = "Article" | "PDF" | "Video" | "Toolkit" | "Template";

type ResourceRegion =
  | "Global"
  | "Americas"
  | "Europe"
  | "Africa"
  | "Asia-Pacific"
  | "Middle East"
  | "Caribbean"
  | "South Asia";

interface Resource {
  id: string;
  title: string;
  description: string;
  category: ResourceCategory;
  type: ResourceType;
  region: ResourceRegion;
  organization: string;
  topic: string;
  dateAdded: string;
  url: string;
  featured?: boolean;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_RESOURCES: Resource[] = [
  {
    id: "r-1",
    title: "Grassroots Coalition Building: A Step-by-Step Field Guide",
    description:
      "A comprehensive 48-page guide covering everything from identifying stakeholders and setting up communication channels to sustaining momentum across diverse coalitions. Includes templates and case studies from successful campaigns in 12 countries.",
    category: "Guides & Toolkits",
    type: "PDF",
    region: "Global",
    organization: "IIIntl Global Council",
    topic: "Organizing",
    dateAdded: "2025-11-10",
    url: "#",
    featured: true,
  },
  {
    id: "r-2",
    title: "Climate Policy Advocacy: Influencing National Legislation",
    description:
      "Detailed research report analyzing successful climate advocacy strategies from 23 countries, including legislative mapping, ally identification, and timing strategies for maximum impact on national climate policy.",
    category: "Research & Reports",
    type: "PDF",
    region: "Global",
    organization: "IIIntl Global Council",
    topic: "Climate & Environment",
    dateAdded: "2025-10-22",
    url: "#",
    featured: true,
  },
  {
    id: "r-3",
    title: "Digital Rights in the Age of AI: A Policy Framework",
    description:
      "Policy brief examining the intersection of artificial intelligence, privacy rights, and democratic participation. Proposes a model framework for civil society organizations to engage with AI governance processes.",
    category: "Policy Briefs",
    type: "Article",
    region: "Europe",
    organization: "European Democracy Network",
    topic: "Digital Rights",
    dateAdded: "2025-12-01",
    url: "#",
    featured: true,
  },
  {
    id: "r-4",
    title: "Community Organizing for Labor Rights: Training Curriculum",
    description:
      "A five-module training curriculum for workplace organizers, covering labor law basics, collective bargaining fundamentals, worker committee formation, and safe communication tactics in hostile environments.",
    category: "Training Materials",
    type: "Toolkit",
    region: "Americas",
    organization: "Americas Chapter",
    topic: "Labor Rights",
    dateAdded: "2025-09-15",
    url: "#",
  },
  {
    id: "r-5",
    title: "Election Integrity Monitoring: Observer Training Video Series",
    description:
      "A 6-part video series (total 4.5 hours) training election observers on documentation protocols, legal rights, digital evidence collection, and real-time incident reporting during election periods.",
    category: "Training Materials",
    type: "Video",
    region: "Africa",
    organization: "Africa Democracy Institute",
    topic: "Democracy & Elections",
    dateAdded: "2025-08-30",
    url: "#",
  },
  {
    id: "r-6",
    title: "Women in Civic Leadership: Breaking Structural Barriers",
    description:
      "Comprehensive research report documenting the structural and cultural barriers women face in civic and political leadership across 40 countries, with data-driven recommendations for organizations and policymakers.",
    category: "Research & Reports",
    type: "PDF",
    region: "Global",
    organization: "IIIntl Women's Network",
    topic: "Women's Rights",
    dateAdded: "2025-11-28",
    url: "#",
  },
  {
    id: "r-7",
    title: "Youth Civic Engagement Toolkit: From School to Ballot Box",
    description:
      "An interactive toolkit designed for youth educators and organizers, with activities, discussion guides, and action plans to build civic literacy and voting participation among 16-25 year-olds.",
    category: "Guides & Toolkits",
    type: "Toolkit",
    region: "Global",
    organization: "Youth Action Network",
    topic: "Youth & Education",
    dateAdded: "2025-10-05",
    url: "#",
  },
  {
    id: "r-8",
    title: "Petition Strategy Playbook: From Signature to Policy Change",
    description:
      "How to design, launch, scale, and convert online petitions into tangible policy outcomes. Includes platform comparison, targeting strategy, media amplification, and legislative handoff templates.",
    category: "Guides & Toolkits",
    type: "PDF",
    region: "Americas",
    organization: "Americas Chapter",
    topic: "Campaigns",
    dateAdded: "2025-07-20",
    url: "#",
  },
  {
    id: "r-9",
    title: "Middle East Civil Society Space: Legal Landscape Analysis",
    description:
      "A detailed policy brief mapping the legal operating environment for civil society organizations across 12 Middle Eastern and North African countries, including registration requirements, foreign funding restrictions, and protest laws.",
    category: "Policy Briefs",
    type: "PDF",
    region: "Middle East",
    organization: "MENA Civil Society Hub",
    topic: "Democracy & Elections",
    dateAdded: "2025-09-03",
    url: "#",
  },
  {
    id: "r-10",
    title: "Digital Security for Activists: Protecting Your Organization",
    description:
      "Practical video tutorial series covering encrypted communications, secure file storage, operational security basics, and how to respond to digital threats. Targeted at organizations in high-risk environments.",
    category: "Training Materials",
    type: "Video",
    region: "Global",
    organization: "IIIntl Global Council",
    topic: "Digital Rights",
    dateAdded: "2025-12-10",
    url: "#",
  },
  {
    id: "r-11",
    title: "Caribbean Environmental Justice: Community Action Templates",
    description:
      "Ready-to-use templates for community meetings, public comment submissions, media releases, and elected official letters, tailored to environmental justice campaigns in Caribbean island nations.",
    category: "Guides & Toolkits",
    type: "Template",
    region: "Caribbean",
    organization: "Caribbean Alliance",
    topic: "Climate & Environment",
    dateAdded: "2025-06-14",
    url: "#",
  },
  {
    id: "r-12",
    title: "South Asia Labour Migration: Rights and Protections Report",
    description:
      "Evidence-based research on the experiences of migrant workers across South and Southeast Asia, covering legal protections, wage theft patterns, recruitment fraud, and successful policy interventions.",
    category: "Research & Reports",
    type: "PDF",
    region: "South Asia",
    organization: "South Asia Workers Coalition",
    topic: "Labor Rights",
    dateAdded: "2025-10-17",
    url: "#",
  },
  {
    id: "r-13",
    title: "Social Media Campaigns for Civic Change: A Documentary",
    description:
      "An 85-minute documentary film examining five social media-driven civic campaigns across three continents, analyzing what made them succeed or fail, with interviews from campaign leaders.",
    category: "Multimedia",
    type: "Video",
    region: "Global",
    organization: "IIIntl Media Hub",
    topic: "Organizing",
    dateAdded: "2025-11-05",
    url: "#",
  },
  {
    id: "r-14",
    title: "Org Admin Quick Reference: IIIntl One Platform",
    description:
      "A concise visual reference card for organization administrators covering member management, campaign creation, resource uploads, and role assignments. Available in 5 languages.",
    category: "Guides & Toolkits",
    type: "Template",
    region: "Global",
    organization: "IIIntl Global Council",
    topic: "Platform",
    dateAdded: "2025-12-15",
    url: "#",
  },
  {
    id: "r-15",
    title: "Asia-Pacific Democracy Index 2025: Findings and Outlook",
    description:
      "Annual research report tracking democratic health indicators across 18 Asia-Pacific nations, including press freedom, electoral integrity, civil liberties, and civil society space scores.",
    category: "Research & Reports",
    type: "Article",
    region: "Asia-Pacific",
    organization: "Asia-Pacific Democracy Network",
    topic: "Democracy & Elections",
    dateAdded: "2025-11-20",
    url: "#",
  },
  {
    id: "r-16",
    title: "Inclusive Meeting Facilitation: Techniques for Diverse Groups",
    description:
      "Training materials for facilitators working with multilingual, multi-cultural civic groups. Covers consensus-building techniques, conflict resolution, language access strategies, and power-dynamics awareness.",
    category: "Training Materials",
    type: "Toolkit",
    region: "Europe",
    organization: "European Democracy Network",
    topic: "Organizing",
    dateAdded: "2025-08-09",
    url: "#",
  },
  {
    id: "r-17",
    title: "Women's Political Participation: Legislative Reform Blueprint",
    description:
      "Policy brief outlining a comprehensive legislative reform package to increase women's political representation, including gender quotas, candidate support mechanisms, and anti-harassment frameworks with comparative analysis.",
    category: "Policy Briefs",
    type: "PDF",
    region: "Africa",
    organization: "Africa Democracy Institute",
    topic: "Women's Rights",
    dateAdded: "2025-07-31",
    url: "#",
  },
  {
    id: "r-18",
    title: "Webinar Replay: Building Resilient Civic Organizations",
    description:
      "Recording of the 2025 IIIntl Global Summit webinar on organizational resilience — covering succession planning, funding diversification, crisis communication, and maintaining mission focus under pressure.",
    category: "Multimedia",
    type: "Video",
    region: "Global",
    organization: "IIIntl Global Council",
    topic: "Organizing",
    dateAdded: "2025-12-08",
    url: "#",
  },
];

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: ResourceCategory[] = [
  "Guides & Toolkits",
  "Research & Reports",
  "Policy Briefs",
  "Training Materials",
  "Multimedia",
];

const RESOURCE_TYPES: ResourceType[] = [
  "Article",
  "PDF",
  "Video",
  "Toolkit",
  "Template",
];

const REGIONS: ResourceRegion[] = [
  "Global",
  "Americas",
  "Europe",
  "Africa",
  "Asia-Pacific",
  "Middle East",
  "Caribbean",
  "South Asia",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getCategoryColor(cat: ResourceCategory): string {
  switch (cat) {
    case "Guides & Toolkits":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Research & Reports":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Policy Briefs":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Training Materials":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Multimedia":
      return "bg-rose-50 text-rose-700 border-rose-200";
    default:
      return "bg-secondary text-muted-foreground border-border";
  }
}

function getTypeIcon(type: ResourceType) {
  switch (type) {
    case "PDF":
      return <FileText size={14} className="text-red-500" />;
    case "Video":
      return <Film size={14} className="text-rose-500" />;
    case "Toolkit":
      return <Wrench size={14} className="text-blue-500" />;
    case "Template":
      return <Package size={14} className="text-emerald-500" />;
    default:
      return <BookOpen size={14} className="text-primary" />;
  }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Motion Variants ──────────────────────────────────────────────────────────

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.26 } },
};

// ─── Add Resource Dialog ──────────────────────────────────────────────────────

function AddResourceDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [url, setUrl] = useState("");
  const [organization, setOrganization] = useState("");
  const [saving, setSaving] = useState(false);

  function handleSubmit() {
    if (!title.trim() || !category || !type || !description.trim()) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onOpenChange(false);
      setTitle("");
      setDescription("");
      setCategory("");
      setType("");
      setRegion("");
      setUrl("");
      setOrganization("");
    }, 1000);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-2xl max-h-[90vh] overflow-y-auto"
        data-ocid="resources.add_resource.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <BookOpen size={18} className="text-primary" />
            Add New Resource
          </DialogTitle>
          <DialogDescription>
            Share an educational resource, report, or toolkit with the IIIntl
            One community.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="res-title" className="text-sm font-medium">
              Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="res-title"
              placeholder="e.g. Grassroots Coalition Building Field Guide"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              data-ocid="resources.add_resource.input"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="res-description" className="text-sm font-medium">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="res-description"
              placeholder="Provide a clear description of this resource and its intended audience..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-ocid="resources.add_resource.textarea"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger data-ocid="resources.add_resource.select">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">
                Type <span className="text-destructive">*</span>
              </Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger data-ocid="resources.add_resource.select">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {RESOURCE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Region</Label>
              <Select value={region} onValueChange={setRegion}>
                <SelectTrigger data-ocid="resources.add_resource.select">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="res-org" className="text-sm font-medium">
                Organization
              </Label>
              <Input
                id="res-org"
                placeholder="Publishing organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                data-ocid="resources.add_resource.input"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="res-url" className="text-sm font-medium">
              Resource URL
            </Label>
            <Input
              id="res-url"
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              data-ocid="resources.add_resource.input"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-ocid="resources.add_resource.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !title.trim() ||
              !category ||
              !type ||
              !description.trim() ||
              saving
            }
            data-ocid="resources.add_resource.submit_button"
          >
            {saving ? "Adding..." : "Add Resource"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Resource Card ────────────────────────────────────────────────────────────

function ResourceCard({
  resource,
  index,
  gridView,
}: {
  resource: Resource;
  index: number;
  gridView: boolean;
}) {
  const catColor = getCategoryColor(resource.category);

  if (gridView) {
    return (
      <motion.div variants={cardVariants} data-ocid={`resources.item.${index}`}>
        <Card className="border-border hover:shadow-md transition-all duration-200 group h-full flex flex-col overflow-hidden">
          {/* Top accent strip by category */}
          <div
            className={cn(
              "h-1 w-full",
              resource.category === "Guides & Toolkits"
                ? "bg-blue-400"
                : resource.category === "Research & Reports"
                  ? "bg-purple-400"
                  : resource.category === "Policy Briefs"
                    ? "bg-amber-400"
                    : resource.category === "Training Materials"
                      ? "bg-emerald-400"
                      : "bg-rose-400",
            )}
          />
          <CardContent className="flex-1 px-4 pt-4 pb-3">
            <div className="flex items-start justify-between gap-2 mb-2">
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] px-1.5 py-0 h-4 flex-shrink-0",
                  catColor,
                )}
              >
                {resource.category}
              </Badge>
              {resource.featured && (
                <Badge className="text-[10px] px-1.5 py-0 h-4 bg-amber-100 text-amber-700 border-amber-300 border flex-shrink-0">
                  Featured
                </Badge>
              )}
            </div>
            <div className="flex items-start gap-2 mb-2">
              <div className="flex-shrink-0 mt-0.5">
                {getTypeIcon(resource.type)}
              </div>
              <h3 className="font-display font-semibold text-sm text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                {resource.title}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
              {resource.description}
            </p>

            <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Globe size={9} />
                {resource.region}
              </span>
              <span className="text-border">·</span>
              <span className="flex items-center gap-1">
                <Tag size={9} />
                {resource.topic}
              </span>
              <span className="text-border">·</span>
              <span className="flex items-center gap-1">
                <Calendar size={9} />
                {formatDate(resource.dateAdded)}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5 truncate">
              {resource.organization}
            </p>
          </CardContent>
          <CardFooter className="px-4 py-3 border-t border-border bg-secondary/20">
            <Button
              variant="outline"
              size="sm"
              className="w-full h-8 text-xs gap-1.5 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
              asChild
            >
              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={11} />
                View Resource
              </a>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  // List view
  return (
    <motion.div variants={cardVariants} data-ocid={`resources.item.${index}`}>
      <Card className="border-border hover:shadow-sm transition-all duration-200 group overflow-hidden">
        <CardContent className="px-4 py-3.5">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              {getTypeIcon(resource.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <Badge
                  variant="outline"
                  className={cn("text-[10px] px-1.5 py-0 h-4", catColor)}
                >
                  {resource.category}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 h-4 border-border text-muted-foreground"
                >
                  {resource.type}
                </Badge>
                {resource.featured && (
                  <Badge className="text-[10px] px-1.5 py-0 h-4 bg-amber-100 text-amber-700 border-amber-300 border">
                    Featured
                  </Badge>
                )}
              </div>
              <h3 className="font-display font-semibold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {resource.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                {resource.description}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
                <span>{resource.organization}</span>
                <span className="text-border">·</span>
                <span className="flex items-center gap-1">
                  <Globe size={9} />
                  {resource.region}
                </span>
                <span className="text-border">·</span>
                <span className="flex items-center gap-1">
                  <Calendar size={9} />
                  {formatDate(resource.dateAdded)}
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex-shrink-0 h-8 text-xs gap-1 self-center"
              asChild
            >
              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={11} />
                View
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function ResourcesPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [gridView, setGridView] = useState(true);
  const [addOpen, setAddOpen] = useState(false);

  const canAdd =
    user?.role === "super_admin" ||
    user?.role === "admin" ||
    user?.role === "org_admin";

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return MOCK_RESOURCES.filter((r) => {
      const matchesSearch =
        !search ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.topic.toLowerCase().includes(q) ||
        r.organization.toLowerCase().includes(q);
      const matchesCat =
        categoryFilter === "all" || r.category === categoryFilter;
      const matchesType = typeFilter === "all" || r.type === typeFilter;
      const matchesRegion = regionFilter === "all" || r.region === regionFilter;
      return matchesSearch && matchesCat && matchesType && matchesRegion;
    });
  }, [search, categoryFilter, typeFilter, regionFilter]);

  const featuredCount = MOCK_RESOURCES.filter((r) => r.featured).length;

  return (
    <Layout breadcrumb="Knowledge › Resources">
      <div className="p-6 max-w-7xl mx-auto">
        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl font-display font-bold text-primary tracking-tight flex items-center gap-2.5">
              <BookOpen size={22} className="opacity-80" />
              Resource Library
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Guides, reports, policy briefs, and training materials for civic
              leaders worldwide.
            </p>
            <div className="mt-3 civic-rule w-12" />
          </div>

          {canAdd && (
            <Button
              size="sm"
              className="gap-2 h-9 self-start sm:self-auto flex-shrink-0"
              onClick={() => setAddOpen(true)}
              data-ocid="resources.add_resource.open_modal_button"
            >
              <Plus size={14} />
              Add Resource
            </Button>
          )}
        </motion.div>

        {/* ── Stats Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.04 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
        >
          {[
            {
              label: "Total Resources",
              value: MOCK_RESOURCES.length,
              icon: <BookOpen size={15} className="text-primary" />,
              bg: "bg-primary/5",
            },
            {
              label: "Featured",
              value: featuredCount,
              icon: <Layers size={15} className="text-amber-600" />,
              bg: "bg-amber-50",
            },
            {
              label: "Categories",
              value: CATEGORIES.length,
              icon: <Tag size={15} className="text-purple-600" />,
              bg: "bg-purple-50",
            },
            {
              label: "Regions Covered",
              value: REGIONS.length,
              icon: <Globe size={15} className="text-emerald-600" />,
              bg: "bg-emerald-50",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={cn(
                "rounded-lg border border-border p-3 flex items-center gap-3",
                stat.bg,
              )}
            >
              <div className="bg-white rounded-md p-1.5 shadow-xs flex-shrink-0">
                {stat.icon}
              </div>
              <div>
                <p className="font-display font-bold text-lg leading-none text-foreground">
                  {stat.value}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* ── Search + Filters ── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.07 }}
          className="space-y-3 mb-4"
        >
          {/* Search bar */}
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Search resources, topics, organizations..."
              className="pl-8 h-9 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              data-ocid="resources.search_input"
            />
          </div>

          {/* Category tabs + Type + Region + View toggles */}
          <div className="flex flex-wrap gap-2 items-center">
            <Tabs
              value={categoryFilter}
              onValueChange={setCategoryFilter}
              className="flex-shrink-0"
            >
              <TabsList className="h-9 flex-wrap">
                <TabsTrigger
                  value="all"
                  className="text-xs px-3"
                  data-ocid="resources.category_filter.tab"
                >
                  All
                </TabsTrigger>
                {CATEGORIES.map((cat) => (
                  <TabsTrigger
                    key={cat}
                    value={cat}
                    className="text-xs px-3 hidden sm:flex"
                    data-ocid="resources.category_filter.tab"
                  >
                    {cat}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Mobile category filter */}
            <div className="sm:hidden">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger
                  className="w-40 h-9 text-xs"
                  data-ocid="resources.category_mobile.select"
                >
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger
                className="w-36 h-9 text-xs"
                data-ocid="resources.type_filter.select"
              >
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {RESOURCE_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={regionFilter} onValueChange={setRegionFilter}>
              <SelectTrigger
                className="w-36 h-9 text-xs"
                data-ocid="resources.region_filter.select"
              >
                <SelectValue placeholder="All regions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                {REGIONS.map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* View toggle */}
            <div className="ml-auto flex items-center gap-1 bg-secondary rounded-md p-0.5 border border-border">
              <button
                type="button"
                onClick={() => setGridView(true)}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  gridView
                    ? "bg-white shadow-xs text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                data-ocid="resources.grid_view.toggle"
                title="Grid view"
              >
                <Grid3x3 size={14} />
              </button>
              <button
                type="button"
                onClick={() => setGridView(false)}
                className={cn(
                  "p-1.5 rounded transition-colors",
                  !gridView
                    ? "bg-white shadow-xs text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
                data-ocid="resources.list_view.toggle"
                title="List view"
              >
                <LayoutList size={14} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results count */}
        {(search ||
          categoryFilter !== "all" ||
          typeFilter !== "all" ||
          regionFilter !== "all") && (
          <p className="text-xs text-muted-foreground mb-3">
            Showing {filtered.length} of {MOCK_RESOURCES.length} resources
          </p>
        )}

        {/* ── Grid / List ── */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
            data-ocid="resources.empty_state"
          >
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
              <BookOpen size={24} className="text-muted-foreground/50" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-1">
              No resources found
            </h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              {search
                ? `No resources match "${search}". Try different keywords.`
                : "No resources match your current filters."}
            </p>
            {canAdd && (
              <Button
                size="sm"
                className="mt-4 gap-2"
                onClick={() => setAddOpen(true)}
              >
                <Plus size={13} />
                Add the First Resource
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={cn(
              gridView
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                : "space-y-2",
            )}
          >
            {filtered.map((resource, i) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                index={i + 1}
                gridView={gridView}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Add Resource Dialog (admin only) */}
      <RoleGate roles={["super_admin", "admin", "org_admin"]}>
        <AddResourceDialog open={addOpen} onOpenChange={setAddOpen} />
      </RoleGate>
    </Layout>
  );
}
