import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  page: number
  total: number
  perPage: number
  onChange: (page: number) => void
}

const Pagination = ({ page, total, perPage, onChange }: PaginationProps) => {
  const totalPages = Math.ceil(total / perPage)
  if (totalPages <= 1) return null

  const from = (page - 1) * perPage + 1
  const to = Math.min(page * perPage, total)

  return (
    <div className="flex items-center justify-between px-1 pt-1">
      <p className="text-xs text-muted-foreground">
        Menampilkan <span className="font-semibold text-foreground">{from}–{to}</span> dari <span className="font-semibold text-foreground">{total}</span> data
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline" size="sm"
          className="h-7 w-7 p-0 rounded-lg"
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </Button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
          .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
            if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('ellipsis')
            acc.push(p)
            return acc
          }, [])
          .map((p, i) =>
            p === 'ellipsis' ? (
              <span key={`e${i}`} className="w-7 text-center text-xs text-muted-foreground">…</span>
            ) : (
              <Button
                key={p}
                variant={p === page ? 'default' : 'outline'}
                size="sm"
                className="h-7 w-7 p-0 rounded-lg text-xs"
                onClick={() => onChange(p as number)}
              >
                {p}
              </Button>
            )
          )
        }

        <Button
          variant="outline" size="sm"
          className="h-7 w-7 p-0 rounded-lg"
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  )
}

export default Pagination
