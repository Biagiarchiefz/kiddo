import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { ChevronRight, ShieldCheck } from 'lucide-react'
import { useBreadcrumbItems } from '@/contexts/BreadcrumbContext'
import AdminSidebar from './AdminSidebar'

const AdminBreadcrumb = () => {
  const crumbs = useBreadcrumbItems()

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/admin" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
              <ShieldCheck className="w-3.5 h-3.5" />
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1
          return (
            <span key={i} className="flex items-center gap-1.5">
              <BreadcrumbSeparator>
                <ChevronRight className="w-3.5 h-3.5" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {isLast || !crumb.href ? (
                  <BreadcrumbPage className="font-semibold text-foreground max-w-45 truncate">
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={crumb.href} className="text-muted-foreground hover:text-foreground transition-colors max-w-35 truncate block">
                      {crumb.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

const AdminLayout = ({ children }: { children: ReactNode }) => (
  <SidebarProvider className="bg-sidebar h-svh overflow-hidden">
    <AdminSidebar />
    <SidebarInset className="rounded-l-[30px] overflow-hidden flex flex-col">
      <header className="sticky top-0 z-50 flex items-center gap-2 px-4 py-2.5 bg-background border-b border-border shadow-sm shrink-0">
        <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
        <Separator orientation="vertical" className="h-4 mx-1" />
        <span className="text-sm font-bold text-foreground">Panel Admin</span>
      </header>
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 w-full">
        <AdminBreadcrumb />
        {children}
      </main>
    </SidebarInset>
  </SidebarProvider>
)

export default AdminLayout