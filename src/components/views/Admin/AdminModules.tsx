import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router'
import { Plus, Pencil, Trash2, ChevronRight, BookOpen, LayoutGrid } from 'lucide-react'
import AppLayout from '@/components/layouts/AppLayout/AppLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { supabase } from '@/utils/supabase'
import { useBreadcrumb } from '@/contexts/BreadcrumbContext'
import type { Module } from '@/types/database'

// ── Data ─────────────────────────────────────────────────────────────────────

async function fetchModules(): Promise<Module[]> {
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .order('sort_order')
  if (error) throw error
  return data ?? []
}

type ModuleForm = {
  title: string
  description: string
  emoji: string
  level: number
  sort_order: number
  header_bg: string
  progress_color: string
  badge_color: string
  is_published: boolean
}

const emptyForm = (): ModuleForm => ({
  title: '',
  description: '',
  emoji: '📚',
  level: 1,
  sort_order: 0,
  header_bg: 'bg-sky-200',
  progress_color: 'bg-primary',
  badge_color: 'bg-primary text-white',
  is_published: false,
})

// ── Module Form Dialog ────────────────────────────────────────────────────────

interface ModuleDialogProps {
  open: boolean
  onClose: () => void
  initial?: Module | null
  onSave: (form: ModuleForm, id?: number) => void
  saving: boolean
}

const ModuleDialog = ({ open, onClose, initial, onSave, saving }: ModuleDialogProps) => {
  const [form, setForm] = useState<ModuleForm>(
    initial
      ? { title: initial.title, description: initial.description, emoji: initial.emoji,
          level: initial.level, sort_order: initial.sort_order, header_bg: initial.header_bg,
          progress_color: initial.progress_color, badge_color: initial.badge_color,
          is_published: initial.is_published }
      : emptyForm()
  )

  const set = (k: keyof ModuleForm, v: string | number | boolean) =>
    setForm(prev => ({ ...prev, [k]: v }))

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? 'Edit Modul' : 'Tambah Modul'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="grid grid-cols-[1fr_80px] gap-3">
            <div className="space-y-1">
              <Label htmlFor="title">Judul</Label>
              <Input id="title" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Judul modul" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="emoji">Emoji</Label>
              <Input id="emoji" value={form.emoji} onChange={e => set('emoji', e.target.value)} placeholder="📚" className="text-center text-lg" />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="desc">Deskripsi</Label>
            <Input id="desc" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Deskripsi singkat modul" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="level">Level</Label>
              <Input id="level" type="number" min={1} value={form.level} onChange={e => set('level', Number(e.target.value))} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="order">Urutan</Label>
              <Input id="order" type="number" min={0} value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} />
            </div>
            <div className="space-y-1 flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2">
                <input type="checkbox" checked={form.is_published} onChange={e => set('is_published', e.target.checked)} className="w-4 h-4 rounded" />
                <span className="text-sm font-medium">Published</span>
              </label>
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="header_bg">Header BG class</Label>
            <Input id="header_bg" value={form.header_bg} onChange={e => set('header_bg', e.target.value)} placeholder="bg-sky-200" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>Batal</Button>
          <Button onClick={() => onSave(form, initial?.id)} disabled={saving || !form.title}>
            {saving ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────

const AdminModules = () => {
  useBreadcrumb([{ label: 'Admin', href: '/admin' }, { label: 'Modul' }])
  const qc = useQueryClient()

  const { data: modules = [], isLoading } = useQuery({
    queryKey: ['admin-modules'],
    queryFn: fetchModules,
    staleTime: 30_000,
  })

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Module | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Module | null>(null)

  const upsert = useMutation({
    mutationFn: async ({ form, id }: { form: ModuleForm; id?: number }) => {
      if (id) {
        const { error } = await supabase.from('modules').update(form).eq('id', id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('modules').insert(form)
        if (error) throw error
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-modules'] })
      setDialogOpen(false)
      setEditTarget(null)
    },
  })

  const del = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('modules').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-modules'] })
      setDeleteTarget(null)
    },
  })

  const openCreate = () => { setEditTarget(null); setDialogOpen(true) }
  const openEdit = (m: Module) => { setEditTarget(m); setDialogOpen(true) }

  return (
    <AppLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center">
              <LayoutGrid className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Modul</h1>
              <p className="text-xs text-muted-foreground">{modules.length} modul terdaftar</p>
            </div>
          </div>
          <Button onClick={openCreate} className="gap-2 rounded-lg">
            <Plus className="w-4 h-4" /> Tambah Modul
          </Button>
        </div>

        {/* Table */}
        <Card className="border border-border overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 bg-muted/50 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wide">
            <span className="w-8">#</span>
            <span className="w-10">Emoji</span>
            <span className="flex-1">Judul</span>
            <span className="w-14 text-center">Level</span>
            <span className="w-20 text-center">Status</span>
            <span className="w-28 text-center">Aksi</span>
          </div>
          <CardContent className="p-0">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3.5 border-b border-border last:border-0">
                    <Skeleton className="w-8 h-4" />
                    <Skeleton className="w-8 h-8 rounded" />
                    <Skeleton className="flex-1 h-4" />
                    <Skeleton className="w-14 h-6 rounded-full" />
                    <Skeleton className="w-20 h-6 rounded-full" />
                    <Skeleton className="w-28 h-8 rounded-lg" />
                  </div>
                ))
              : modules.map((m, i) => (
                  <div key={m.id} className={`flex items-center gap-3 px-5 py-3.5 ${i < modules.length - 1 ? 'border-b border-border' : ''} hover:bg-muted/20 transition-colors`}>
                    <span className="w-8 text-sm text-muted-foreground font-mono">{m.sort_order}</span>
                    <span className="w-10 text-2xl text-center">{m.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{m.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{m.description}</p>
                    </div>
                    <span className="w-14 text-center text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      Lv.{m.level}
                    </span>
                    <span className={`w-20 text-center text-[10px] font-bold px-2 py-0.5 rounded-full ${m.is_published ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}`}>
                      {m.is_published ? 'Published' : 'Draft'}
                    </span>
                    <div className="w-28 flex items-center justify-center gap-1">
                      <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1 text-sky-600 hover:text-sky-700 hover:bg-sky-50">
                        <Link to={`/admin/modules/${m.id}/units`}>
                          <BookOpen className="w-3 h-3" /> Unit
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground" onClick={() => openEdit(m)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive/60 hover:text-destructive hover:bg-destructive/10" onClick={() => setDeleteTarget(m)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))
            }
          </CardContent>
        </Card>
      </div>

      {/* Create / Edit dialog */}
      {dialogOpen && (
        <ModuleDialog
          open={dialogOpen}
          onClose={() => { setDialogOpen(false); setEditTarget(null) }}
          initial={editTarget}
          onSave={(form, id) => upsert.mutate({ form, id })}
          saving={upsert.isPending}
        />
      )}

      {/* Delete confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={v => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus modul "{deleteTarget?.title}"?</AlertDialogTitle>
            <AlertDialogDescription>
              Semua unit dan soal di dalam modul ini juga akan terhapus. Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && del.mutate(deleteTarget.id)}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {del.isPending ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  )
}

export default AdminModules