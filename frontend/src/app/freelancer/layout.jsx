import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { FreelancerSidebar } from "@/components/freelancer/app-sidebar"

export const metadata = {
  title: "WorkHub - Freelancer Dashboard",
};

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <FreelancerSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">

            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <main className="px-4 pb-4">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}