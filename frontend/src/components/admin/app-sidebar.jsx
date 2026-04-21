"use client"

import * as React from "react"
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link";
import Image from "next/image";
import WorkHubLogo from "../../../public/WorkHubLogo.png"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Users,
  ShieldCheck,
  Command,
  Briefcase,
  MessagesSquare,
  Frame,
  ShieldUser,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  ChevronRight,

  CreditCard,
  LogOut,
  Sparkles,
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  LayoutDashboard,
  House,
  Megaphone,
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
  SidebarMenuAction,
} from "@/components/ui/sidebar"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"


import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"

const data = {
  navMain: [
    {
      title: "Overview",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Users",
      url: "#",
      icon: Users,
      isActive: true,
      items: [
        {
          title: "Organizations",
          url: "/admin/dashboard/users/orgs",
        },
        {
          title: "Freelancers",
          url: "/admin/dashboard/users/freelancers",
        },
        {
          title: "Clients",
          url: "/admin/dashboard/users/clients",
        },
        // {
        //   title: "Suspended Users",
        //   url: "/admin/dashboard/users/suspended",
        // },
      ],
    },
    {
      title: "Projects",
      url: "#",
      icon: Briefcase,
      items: [
        {
          title: "Active Projects",
          url: "/admin/dashboard/projects/active",
        },
        {
          title: "Pending Projects",
          url: "/admin/dashboard/projects/pending",
        },
      ],
    },
    // {
    //   title: "Messages",
    //   url: "#",
    //   icon: MessagesSquare,
    //   items: [
    //     {
    //       title: "Announcements",
    //       url: "/admin/dashboard/messages/announcements",
    //     },
    //     // {
    //     //   title: "Messages",
    //     //   url: "/admin/dashboard/messages",
    //     // },
    //   ],
    // },
    {
      title: "Announcements",
      url: "#",
      icon: Megaphone,
      requiresApproval: true,
      items: [
        { title: "All Announcements",    url: "/admin/dashboard/announcement/all" },
        { title: "Create New",    url: "/admin/dashboard/announcement/create" },
      ],
    },
    {
      title: "Moderation",
      url: "#",
      icon: ShieldCheck,
      items: [
        {
          title: "Reports",
          url: "/admin/dashboard/moderation/reports",
        },
        {
          title: "Feedback",
          url: "/admin/dashboard/moderation/feedback",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/admin/dashboard/settings/general",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }) {
  const { userData, loading, logOut } = useAuth();

  if (loading && !userData) {
    return <div>Loading...</div>;
  }


  const user = {
    name: userData?.name || "Admin",
    email: userData?.email || "Not provided",
    avatar: "/avatars/admin.svg",
  }

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className={'flex gap-3'}>
            <div className="flex aspect-square items-center justify-center rounded-lg ">
              <Image src={WorkHubLogo} alt="Work Hub" width={32} height={32} />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Work Hub</span>
              <span className="truncate text-xs">Admin</span>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>

      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />

      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} logOut={logOut} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
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
                <AvatarFallback className="rounded-lg"><ShieldUser className="text-black dark:text-white" /></AvatarFallback>
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
                  <AvatarFallback className="rounded-lg"><ShieldUser className="text-black dark:text-white" /></AvatarFallback>
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
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={()=>logOut()}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

function NavMain({ items }) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isActive =
            pathname === item.url ||
            item.items?.some((subItem) =>
              pathname.startsWith(subItem.url)
            );

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                {item.items ?
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger> :

                  <SidebarMenuButton tooltip={item.title} isActive={pathname === item.url}>
                    {item.icon && <item.icon />}
                    <Link href={item.url}>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                }

                {item.items && <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                          <Link href={subItem.url}>
                            <span>{subItem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>}

              </SidebarMenuItem>
            </Collapsible>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
