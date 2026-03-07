import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import {
  Building2,
  CalendarDays,
  Flag,
  Globe,
  KeyRound,
  Lock,
  LogOut,
  MessageSquare,
  Pencil,
  Save,
  Shield,
  TrendingUp,
  UserCheck,
  Users,
  X,
  Zap,
} from "lucide-react";
import type { Variants } from "motion/react";
import { motion } from "motion/react";
import { useState } from "react";
import { Layout } from "../components/Layout";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const MEMBER_ORGS = [
  {
    name: "IIIntl Global Council",
    role: "Member",
    region: "Global",
    icon: <Globe size={14} />,
    color: "bg-blue-100 text-blue-700",
  },
  {
    name: "Americas Chapter",
    role: "Observer",
    region: "North America",
    icon: <Flag size={14} />,
    color: "bg-green-100 text-green-700",
  },
  {
    name: "Africa Region",
    role: "Active Member",
    region: "Sub-Saharan Africa",
    icon: <Zap size={14} />,
    color: "bg-orange-100 text-orange-700",
  },
];

export function ProfilePage() {
  const { user, logout } = useAuth();

  // Edit mode state
  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState(user?.name?.split(" ")[0] ?? "");
  const [lastName, setLastName] = useState(
    user?.name?.split(" ").slice(1).join(" ") ?? "",
  );
  const [bio, setBio] = useState(
    "Committed to building independent, interdependent, and international civic structures for a better world.",
  );
  const [country, setCountry] = useState("United States");
  const [language, setLanguage] = useState("English");

  // Password section
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Notification prefs
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifCampaigns, setNotifCampaigns] = useState(true);
  const [notifForums, setNotifForums] = useState(false);
  const [notifDigest, setNotifDigest] = useState(true);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "??";

  const handleSaveProfile = () => {
    setEditMode(false);
  };

  const handleCancelEdit = () => {
    setFirstName(user?.name?.split(" ")[0] ?? "");
    setLastName(user?.name?.split(" ").slice(1).join(" ") ?? "");
    setEditMode(false);
  };

  return (
    <Layout breadcrumb="Profile">
      <div className="p-6 max-w-4xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Profile Header Card */}
          <motion.div variants={itemVariants}>
            <Card
              className="border-border overflow-hidden"
              data-ocid="profile.card"
            >
              <div className="h-24 civic-gradient opacity-80" />
              <CardContent className="px-6 pb-6 -mt-12">
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                  <Avatar className="h-20 w-20 border-4 border-background shadow-md flex-shrink-0">
                    <AvatarImage src={user?.avatar ?? undefined} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-display font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 pb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-xl font-display font-bold text-foreground">
                        {user?.name}
                      </h1>
                      <Badge
                        variant="outline"
                        className="capitalize text-xs border-primary/30 text-primary font-semibold"
                        data-ocid="profile.role_badge"
                      >
                        {user?.role.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {user?.email}
                    </p>
                    {user?.organization && (
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                        <Building2 size={12} />
                        {user.organization}
                      </div>
                    )}
                  </div>
                  <Button
                    variant={editMode ? "outline" : "default"}
                    size="sm"
                    className="gap-2 flex-shrink-0"
                    onClick={() => setEditMode(!editMode)}
                    data-ocid="profile.edit_button"
                  >
                    {editMode ? (
                      <>
                        <X size={14} /> Cancel
                      </>
                    ) : (
                      <>
                        <Pencil size={14} /> Edit Profile
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <motion.div variants={itemVariants}>
                <Card
                  className="border-border"
                  data-ocid="profile.personal_info_card"
                >
                  <CardHeader className="pb-3 pt-4 px-5">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <UserCheck size={15} className="text-primary" />
                        Personal Information
                      </CardTitle>
                      {editMode && (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={handleCancelEdit}
                            data-ocid="profile.cancel_button"
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            className="h-7 text-xs gap-1"
                            onClick={handleSaveProfile}
                            data-ocid="profile.save_button"
                          >
                            <Save size={11} /> Save
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="px-5 pb-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          First Name
                        </Label>
                        {editMode ? (
                          <Input
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="h-9 text-sm"
                            data-ocid="profile.first_name_input"
                          />
                        ) : (
                          <p className="text-sm font-medium text-foreground">
                            {firstName}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Last Name
                        </Label>
                        {editMode ? (
                          <Input
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="h-9 text-sm"
                            data-ocid="profile.last_name_input"
                          />
                        ) : (
                          <p className="text-sm font-medium text-foreground">
                            {lastName || "—"}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Email Address
                        </Label>
                        {editMode ? (
                          <Input
                            type="email"
                            value={user?.email ?? ""}
                            className="h-9 text-sm"
                            data-ocid="profile.email_input"
                            readOnly
                          />
                        ) : (
                          <p className="text-sm font-medium text-foreground">
                            {user?.email}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Country
                        </Label>
                        {editMode ? (
                          <Input
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="h-9 text-sm"
                            data-ocid="profile.country_input"
                          />
                        ) : (
                          <p className="text-sm font-medium text-foreground">
                            {country}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Language
                        </Label>
                        {editMode ? (
                          <Input
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="h-9 text-sm"
                            data-ocid="profile.language_input"
                          />
                        ) : (
                          <p className="text-sm font-medium text-foreground">
                            {language}
                          </p>
                        )}
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Bio
                        </Label>
                        {editMode ? (
                          <Textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="text-sm resize-none"
                            rows={3}
                            data-ocid="profile.bio_textarea"
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Organization Memberships */}
              <motion.div variants={itemVariants}>
                <Card className="border-border" data-ocid="profile.orgs_card">
                  <CardHeader className="pb-3 pt-4 px-5">
                    <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Building2 size={15} className="text-blue-600" />
                      Organization Memberships
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-5 space-y-3">
                    {MEMBER_ORGS.map((org, i) => (
                      <div
                        key={org.name}
                        className="flex items-center gap-3 p-3 rounded-lg bg-secondary/40 hover:bg-secondary/60 transition-colors"
                        data-ocid={`profile.orgs.item.${i + 1}`}
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0",
                            org.color,
                          )}
                        >
                          {org.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground">
                            {org.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {org.region} · Role:{" "}
                            <span className="font-medium">{org.role}</span>
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                          data-ocid={`profile.orgs.leave_button.${i + 1}`}
                        >
                          Leave
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Security */}
              <motion.div variants={itemVariants}>
                <Card
                  className="border-border"
                  data-ocid="profile.security_card"
                >
                  <CardHeader className="pb-3 pt-4 px-5">
                    <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Shield size={15} className="text-green-600" />
                      Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Password
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Last changed 30 days ago
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-xs h-8"
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        data-ocid="profile.change_password_button"
                      >
                        <KeyRound size={13} />
                        {showPasswordForm ? "Cancel" : "Change Password"}
                      </Button>
                    </div>

                    {showPasswordForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 pt-2 border-t border-border"
                      >
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium">
                            Current Password
                          </Label>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="h-9 text-sm"
                            data-ocid="profile.current_password_input"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium">
                            New Password
                          </Label>
                          <Input
                            type="password"
                            placeholder="Minimum 8 characters"
                            className="h-9 text-sm"
                            data-ocid="profile.new_password_input"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-medium">
                            Confirm New Password
                          </Label>
                          <Input
                            type="password"
                            placeholder="Repeat new password"
                            className="h-9 text-sm"
                            data-ocid="profile.confirm_new_password_input"
                          />
                        </div>
                        <Button
                          size="sm"
                          className="gap-2 text-xs"
                          data-ocid="profile.save_password_button"
                        >
                          <Lock size={12} /> Update Password
                        </Button>
                      </motion.div>
                    )}

                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          Sign Out
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Log out of your account on this device
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-xs h-8 text-destructive border-destructive/30 hover:bg-destructive/10"
                        onClick={logout}
                        data-ocid="profile.logout_button"
                      >
                        <LogOut size={13} /> Sign Out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Activity Summary */}
              <motion.div variants={itemVariants}>
                <Card
                  className="border-border"
                  data-ocid="profile.activity_card"
                >
                  <CardHeader className="pb-3 pt-4 px-5">
                    <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <TrendingUp size={15} className="text-purple-600" />
                      Activity Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-5">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-secondary/50 rounded-lg text-center">
                        <div className="flex items-center justify-center mb-1">
                          <MessageSquare
                            size={14}
                            className="text-purple-600"
                          />
                        </div>
                        <p className="text-lg font-display font-bold text-foreground">
                          24
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Posts Made
                        </p>
                      </div>
                      <div className="p-3 bg-secondary/50 rounded-lg text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Zap size={14} className="text-green-600" />
                        </div>
                        <p className="text-lg font-display font-bold text-foreground">
                          7
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Campaigns Joined
                        </p>
                      </div>
                      <div className="p-3 bg-secondary/50 rounded-lg text-center">
                        <div className="flex items-center justify-center mb-1">
                          <Building2 size={14} className="text-blue-600" />
                        </div>
                        <p className="text-lg font-display font-bold text-foreground">
                          3
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Organizations
                        </p>
                      </div>
                      <div className="p-3 bg-secondary/50 rounded-lg text-center">
                        <div className="flex items-center justify-center mb-1">
                          <CalendarDays size={14} className="text-orange-600" />
                        </div>
                        <p className="text-lg font-display font-bold text-foreground">
                          Mar
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          Member Since 2024
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Notification Preferences */}
              <motion.div variants={itemVariants}>
                <Card
                  className="border-border"
                  data-ocid="profile.notifications_card"
                >
                  <CardHeader className="pb-3 pt-4 px-5">
                    <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Users size={15} className="text-indigo-600" />
                      Notifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 pb-5 space-y-4">
                    {[
                      {
                        id: "email",
                        label: "Email Notifications",
                        desc: "Receive emails for important updates",
                        checked: notifEmail,
                        onChange: setNotifEmail,
                        ocid: "profile.notif_email_switch",
                      },
                      {
                        id: "campaigns",
                        label: "Campaign Updates",
                        desc: "New campaigns and status changes",
                        checked: notifCampaigns,
                        onChange: setNotifCampaigns,
                        ocid: "profile.notif_campaigns_switch",
                      },
                      {
                        id: "forums",
                        label: "Forum Replies",
                        desc: "When someone replies to your posts",
                        checked: notifForums,
                        onChange: setNotifForums,
                        ocid: "profile.notif_forums_switch",
                      },
                      {
                        id: "digest",
                        label: "Member Digest",
                        desc: "Weekly summary of platform activity",
                        checked: notifDigest,
                        onChange: setNotifDigest,
                        ocid: "profile.notif_digest_switch",
                      },
                    ].map((pref, i, arr) => (
                      <div key={pref.id}>
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1">
                            <Label
                              htmlFor={pref.id}
                              className="text-xs font-semibold cursor-pointer"
                            >
                              {pref.label}
                            </Label>
                            <p className="text-[10px] text-muted-foreground">
                              {pref.desc}
                            </p>
                          </div>
                          <Switch
                            id={pref.id}
                            checked={pref.checked}
                            onCheckedChange={pref.onChange}
                            data-ocid={pref.ocid}
                          />
                        </div>
                        {i < arr.length - 1 && (
                          <Separator className="mt-4 opacity-50" />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
