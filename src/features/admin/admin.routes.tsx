import AdminDashboard from '@/components/views/Admin/AdminDashboard'
import AdminModules from '@/components/views/Admin/AdminModules'
import AdminUnits from '@/components/views/Admin/AdminUnits'
import AdminQuestions from '@/components/views/Admin/AdminQuestions'
import AdminUsers from '@/components/views/Admin/AdminUsers'

export const adminRoutes = [
  { path: 'admin', element: <AdminDashboard /> },
  { path: 'admin/modules', element: <AdminModules /> },
  { path: 'admin/modules/:moduleId/units', element: <AdminUnits /> },
  { path: 'admin/units/:unitId/questions', element: <AdminQuestions /> },
  { path: 'admin/users', element: <AdminUsers /> },
]