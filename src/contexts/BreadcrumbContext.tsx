import { createContext, useContext, useState, useLayoutEffect, type ReactNode } from 'react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbContextType {
  items: BreadcrumbItem[]
  setItems: (items: BreadcrumbItem[]) => void
}

const BreadcrumbContext = createContext<BreadcrumbContextType>({
  items: [],
  setItems: () => {},
})

export const BreadcrumbProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<BreadcrumbItem[]>([])
  return (
    <BreadcrumbContext.Provider value={{ items, setItems }}>
      {children}
    </BreadcrumbContext.Provider>
  )
}

export const useBreadcrumbItems = () => useContext(BreadcrumbContext).items

export const useBreadcrumb = (items: BreadcrumbItem[]) => {
  const { setItems } = useContext(BreadcrumbContext)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => { setItems(items) }, [JSON.stringify(items)])
}