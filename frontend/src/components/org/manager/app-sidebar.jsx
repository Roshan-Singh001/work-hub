"use client"

import * as React from "react"
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link";
import Image from "next/image";
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
  Lightbulb,
} from "lucide-react"
// import WorkHubLogo from "../../../../public/WorkHubLogo.png"
import WorkHubLogo from "../../../../public/WorkHubLogo.png"
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
      url: "/orgs/member/dashboard",
      icon: House,
    },
    {
      title: "My Tasks",
      url: "#",
      icon: Briefcase,
      requiresApproval: true,
      items: [
        { title: "Active Tasks",     url: "/orgs/member/dashboard/tasks/active" },
        { title: "Completed Tasks",  url: "/orgs/member/dashboard/tasks/completed" },
      ],
    },
    // {
    //   title: "Tasks",
    //   url: "#",
    //   icon: ClipboardList,
    //   requiresApproval: true,
    //   items: [
    //     { title: "My Tasks",    url: "/orgs/admin/dashboard/tasks/my" },
    //     { title: "Team Tasks",  url: "/orgs/admin/dashboard/tasks/team" },
    //   ],
    // },
    // {
    //   title: "Team",
    //   url: "#",
    //   icon: Users,
    //   requiresApproval: true,
    //   items: [
    //     { title: "All Members",          url: "/orgs/admin/dashboard/team/members" },
    //   ],
    // },
    // {
    //   title: "Clients",
    //   url: "#",
    //   icon: Handshake,
    //   requiresApproval: true,
    //   items: [
    //     { title: "All Clients",     url: "/orgs/admin/dashboard/clients/all" },
    //     { title: "Active Clients",  url: "/orgs/admin/dashboard/clients/active" },
    //   ],
    // },
    // {
    //   title: "Messages",
    //   url: "#",
    //   icon: MessageSquare,
    //   requiresApproval: true,
    //   items: [
    //     { title: "Team Chat",   url: "/orgs/admin/dashboard/messages/team" },
    //     { title: "Client Chat", url: "/orgs/admin/dashboard/messages/clients" },
    //   ],
    // },
    // {
    //   title: "Opportunities",
    //   url: "#",
    //   icon: Lightbulb,
    //   requiresApproval: true,
    //   items: [
    //     { title: "Browse Projects", url: "/work" },
    //     { title: "My Proposals",  url: "/orgs/admin/dashboard/proposals" },
    //     { title: "Incoming Offers",  url: "/orgs/admin/dashboard/offers" },
    //   ],
    // },
    // {
    //   title: "Finance",
    //   url: "#",
    //   icon: DollarSign,
    //   requiresApproval: true,
    //   items: [
    //     { title: "Earnings",     url: "/orgs/admin/dashboard/finance/earnings" },
    //     { title: "Transactions", url: "/orgs/admin/dashboard/finance/transactions" },
    //     { title: "Invoices",     url: "/orgs/admin/dashboard/finance/invoices" },
    //   ],
    // },
    // {
    //   title: "Analytics",
    //   url: "#",
    //   icon: BarChart2,
    //   requiresApproval: true,
    //   items: [
    //     { title: "Project Reports",  url: "/org/dashboard/analytics/projects" },
    //     { title: "Team Performance", url: "/org/dashboard/analytics/team" },
    //     { title: "Revenue",          url: "/org/dashboard/analytics/revenue" },
    //   ],
    // },
    {
      title: "Announcements",
      url: "#",
      icon: Megaphone,
      requiresApproval: true,
      items: [
        { title: "Admin Updates",    url: "/orgs/member/dashboard/announcements/admin" },
        { title: "Internal Notices", url: "/orgs/member/dashboard/announcements/internal" },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/orgs/member/dashboard/settings/general",
          requiresApproval: true,
        },
      ],
    },
  ],
}

const STATUS_CONFIG = {
  pending: {
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
  Approved: {
    label: "Approved",
    icon: CheckCircle2,
    badgeClass:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    lockTooltip: "",
    hint: "",
  },
}


function isAccessible(item, orgStatus) {
  if (orgStatus === "Active") return true;
  return !item.requiresApproval;
}


export function OrgSidebar({ ...props }) {
  const { userData, loading, logOut } = useAuth();

  if (loading && !userData) {
    return <div>Loading...</div>;
  }

  const orgStatus = userData?.status || "Pending";

  const user = {
    name: userData?.name || "Org Admin",
    email: userData?.email || "Not provided",
    orgName: userData?.orgName || "My Organization",
  }

  return (
    <TooltipProvider delayDuration={200}>
      <Sidebar collapsible="icon" variant="inset" {...props}>

        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem className="flex gap-3 items-center">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg  shrink-0">
                <Image src={WorkHubLogo} alt="Work Hub" width={32} height={32} />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                <span className="truncate font-medium">{user.orgName}</span>
                <span className="truncate text-xs">Manager</span>
                
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <NavMain items={data.navMain} orgStatus={orgStatus} />
        </SidebarContent>

        <SidebarFooter>
          <NavUser user={user} logOut={logOut} />
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>
    </TooltipProvider>
  )
}


function StatusBadge({ orgStatus }) {
  const config = STATUS_CONFIG[orgStatus] ?? STATUS_CONFIG.pending;
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


function NavMain({ items, orgStatus }) {
  const pathname = usePathname();
  const hint = STATUS_CONFIG[orgStatus]?.hint;

  return (
    <SidebarGroup>
      {hint && (
        <SidebarGroupLabel className="flex flex-col gap-2 mb-6 items-start text-[11px] text-muted-foreground whitespace-normal leading-tight px-2 pb-2">
          <StatusBadge orgStatus={orgStatus} />
          {hint}
        </SidebarGroupLabel>
      )}
      <SidebarMenu>
        {items.map((item) => {
          const accessible = isAccessible(item, orgStatus);
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
              orgStatus={orgStatus}
            />
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}


function NavItem({ item, accessible, isActive, pathname, orgStatus }) {
  const lockTooltip = STATUS_CONFIG[orgStatus]?.lockTooltip ?? "";

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

  if (!item.items) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={item.title}
          isActive={pathname === item.url}
        >
          {item.icon && <item.icon />}
          <Link href={item.url}>
            <span>{item.title}</span>
          </Link>
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
              const subAccessible = isAccessible(subItem, orgStatus);

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
                    <Link href={subItem.url}>
                      <span>{subItem.title}</span>
                    </Link>
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