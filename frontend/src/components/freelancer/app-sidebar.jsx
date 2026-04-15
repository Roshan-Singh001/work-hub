"use client"

import * as React from "react"
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext"
import {
  House,
  Briefcase,
  ClipboardList,
  Users,
  Handshake,
  MessageSquare,
  FolderOpen,
  DollarSign,
  BarChart2,
  Megaphone,
  Settings2,
  ChevronRight,
  ChevronsUpDown,
  BadgeCheck,
  Bell,
  LogOut,
  Building2,
  Lock,
  Clock,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  Star,
  Lightbulb,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const data = {
  navMain: [
    {
      title: "Overview",
      url: "/freelancer/dashboard",
      icon: House,
    },
    {
      title: "Projects",
      url: "#",
      icon: Briefcase,
      requiresApproval: true,
      items: [
        { title: "All Projects",        url: "/freelancer/dashboard/projects/all" },
        { title: "Active Projects",     url: "/freelancer/dashboard/projects/active" },
        { title: "Completed Projects",  url: "/freelancer/dashboard/projects/completed" },
      ],
    },
    {
      title: "Tasks",
      url: "#",
      icon: ClipboardList,
      requiresApproval: true,
      items: [
        { title: "My Tasks",    url: "/freelancer/dashboard/tasks/my" },
        { title: "Completed Tasks",  url: "/freelancer/dashboard/tasks/completed" },
      ],
    },
    {
      title: "Messages",
      url: "#",
      icon: MessageSquare,
      requiresApproval: true,
      items: [
        { title: "Org Chat",   url: "/freelancer/dashboard/messages/team" },
        { title: "Client Chat", url: "/freelancer/dashboard/messages/clients" },
      ],
    },
    {
      title: "Opportunities",
      url: "#",
      icon: Lightbulb,
      requiresApproval: true,
      items: [
        { title: "Browse Opportunities", url: "/work" },
        { title: "My Applications",  url: "/freelancer/dashboard/opportunities/applications" },
        { title: "Incoming Offers",  url: "/freelancer/dashboard/opportunities/offers" },
      ],
    },
    {
      title: "Reviews",
      url: "#",
      icon: Star,
      requiresApproval: true,
      items: [
        { title: "My Ratings", url: "/freelancer/dashboard/reviews/ratings" },
        { title: "Feedback",  url: "/freelancer/dashboard/reviews/feedback" },
      ],
    },
    {
      title: "Announcements",
      url: "#",
      icon: Megaphone,
      requiresApproval: true,
      items: [
        { title: "Admin Updates",    url: "/freelancer/dashboard/announcements" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Your Profile",
          url: "/freelancer/dashboard/settings/profile",
        },
        {
          title: "General",
          url: "/freelancer/dashboard/settings/general",
        },
      ],
    },
  ],
}

const STATUS_CONFIG = {
  Pending: {
    label: "Pending Review",
    icon: Clock,
    badgeClass:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    lockTooltip: "Available after admin approval",
    hint: "Your application is under review. Full access unlocks once approved.",
  },
  Rejected: {
    label: "Not Approved",
    icon: XCircle,
    badgeClass:
      "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    lockTooltip: "Account not approved. Contact support.",
    hint: "Contact support to resubmit.",
  },
  Active: {
    label: "Active",
    icon: CheckCircle2,
    badgeClass:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    lockTooltip: "",
    hint: "",
  },
}


function isAccessible(item, status) {
  if (status === "Active") return true;
  return !item.requiresApproval;
}


export function FreelancerSidebar({ ...props }) {
  const { userData, loading, logOut } = useAuth();

  if (loading && !userData) {
    return <div>Loading...</div>;
  }

  // Expect userData.status: "pending" | "approved" | "rejected"
  const Status = userData?.status ?? "Pending";

  const user = {
    name: userData?.name || "Freelancer",
    email: userData?.email || "Not provided",
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Sidebar collapsible="icon" variant="inset" {...props}>

        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem className="flex gap-3 items-center">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shrink-0">
                <img src="/favicon.ico" alt={user.orgName} className="h-4 w-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                <span className="truncate font-medium">Work Hub</span>
                <span className="truncate text-xs">Freelancer</span>
                
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <NavMain items={data.navMain} status={Status} />
        </SidebarContent>

        <SidebarFooter>
          <NavUser user={user} logOut={logOut} />
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
    </TooltipProvider>
  )
}


function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.Pending;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full w-fit ${config.badgeClass}`}
    >
      <Icon className="size-2.5" />
      {config.label}
    </span>
  );
}


function NavMain({ items, status }) {
  const pathname = usePathname();
  const hint = STATUS_CONFIG[status]?.hint;

  return (
    <SidebarGroup>
      {hint && (
        <SidebarGroupLabel className="flex flex-col gap-2 mb-6 items-start text-[11px] text-muted-foreground whitespace-normal leading-tight px-2 pb-2">
          <StatusBadge status={status} />
          {hint}
        </SidebarGroupLabel>
      )}
      <SidebarMenu>
        {items.map((item) => {
          const accessible = isAccessible(item, status);
          const isActive =
            pathname === item.url ||
            item.items?.some((sub) => pathname.startsWith(sub.url));

          return (
            <NavItem
              key={item.title}
              item={item}
              accessible={accessible}
              isActive={isActive}
              pathname={pathname}
              status={status}
            />
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}


function NavItem({ item, accessible, isActive, pathname, status }) {
  const lockTooltip = STATUS_CONFIG[status]?.lockTooltip ?? "";

  if (!accessible) {
    return (
      <SidebarMenuItem>
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuButton
              tooltip={item.title}
              disabled
              className="opacity-40 cursor-not-allowed select-none pointer-events-auto"
            >
              {item.icon && <item.icon />}
              <span>{item.title}</span>
              <Lock className="ml-auto size-3.5 shrink-0 text-muted-foreground" />
            </SidebarMenuButton>
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-52 text-xs">
            {lockTooltip}
          </TooltipContent>
        </Tooltip>
      </SidebarMenuItem>
    );
  }

  // ── Accessible, no sub-items (e.g. Overview) ─────────────────────────────
  if (!item.items) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={item.title}
          isActive={pathname === item.url}
        >
          {item.icon && <item.icon />}
          <a href={item.url}>
            <span>{item.title}</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible
      asChild
      defaultOpen={isActive}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title} isActive={isActive}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items.map((subItem) => {
              const subAccessible = isAccessible(subItem, status);

              if (!subAccessible) {
                return (
                  <SidebarMenuSubItem key={subItem.title}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuSubButton
                          disabled
                          className="opacity-40 cursor-not-allowed pointer-events-auto"
                        >
                          <span className="flex-1">{subItem.title}</span>
                          <Lock className="size-3 shrink-0 text-muted-foreground" />
                        </SidebarMenuSubButton>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-52 text-xs">
                        {lockTooltip}
                      </TooltipContent>
                    </Tooltip>
                  </SidebarMenuSubItem>
                );
              }

              return (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={pathname === subItem.url}
                  >
                    <a href={subItem.url}>
                      <span>{subItem.title}</span>
                    </a>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

function NavUser({ user, logOut }) {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg">
                  <Building2 className="text-black dark:text-white" />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">
                    <Building2 className="text-black dark:text-white" />
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck className="mr-2 size-4" />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 size-4" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => logOut()}>
              <LogOut className="mr-2 size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}