import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
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
    <SidebarInset className="rounded-l-[30px] overflow-hidden">
      <main className="h-full overflow-y-auto p-6 w-full">
        <AdminBreadcrumb />
        {children}
      </main>
    </SidebarInset>
  </SidebarProvider>
)

export default AdminLayout