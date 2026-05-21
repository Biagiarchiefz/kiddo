import { useBreadcrumb } from '@/contexts/BreadcrumbContext'

const useDashboard = () => {
  useBreadcrumb([{ label: 'Dashboard' }])
  return {}
}

export default useDashboard
