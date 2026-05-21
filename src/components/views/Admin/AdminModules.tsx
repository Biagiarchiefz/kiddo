import { useState, useMemo, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router'
import { Plus, Pencil, Trash2, ChevronRight, BookOpen, LayoutGrid, Search, Upload, X } from 'lucide-react'
import imageCompression from 'browser-image-compression'
import { toast } from 'sonner'
import AdminLayout from '@/components/layouts/AdminLayout/AdminLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import Pagination from '@/components/common/Pagination'
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

async function uploadModuleImage(file: File): Promise<string> {
  const compressed = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 1080,
    fileType: 'image/webp',
    useWebWorker: true,
  })
  const ext = 'webp'
  const path = `modules/${Date.now()}.${ext}`
  const { error: uploadError } = await supabase.storage
    .from('module-images')
    .upload(path, compressed, { contentType: 'image/webp', upsert: false })
  if (uploadError) throw uploadError
  const { data } = supabase.storage.from('module-images').getPublicUrl(path)
  return data.publicUrl
}

type ModuleForm = {
  title: string
  description: string
  level: number
  sort_order: number
  header_bg: string
  progress_color: string
  badge_color: string
  is_published: boolean
  image_url: string | null
}

const emptyForm = (): ModuleForm => ({
  title: '',
  description: '',
  level: 1,
  sort_order: 0,
  header_bg: 'bg-sky-200',
  progress_color: 'bg-primary',
  badge_color: 'bg-primary text-white',
  is_published: false,
  image_url: null,
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
      ? {
          title: initial.title,
          description: initial.description,
          level: initial.level,
          sort_order: initial.sort_order,
          header_bg: initial.header_bg,
          progress_color: initial.progress_color,
          badge_color: initial.badge_color,
          is_published: initial.is_published,
          image_url: initial.image_url ?? null,
        }
      : emptyForm()
  )
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(initial?.image_url ?? null)
  const fileRef = useRef<HTMLInputElement>(null)

  const set = (k: keyof ModuleForm, v: string | number | boolean | null) =>
    setForm(prev => ({ ...prev, [k]: v }))

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadModuleImage(file)
      setPreview(url)
      set('image_url', url)
    } catch (err) {
      console.error('Upload gagal:', err)
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const removeImage = () => {
    setPreview(null)
    set('image_url', null)
  }

  const isBusy = saving || uploading

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? 'Edit Modul' : 'Tambah Modul'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1">
            <Label htmlFor="title">Judul</Label>
            <Input id="title" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Judul modul" />
          </div>

          {/* Image upload */}
          <div className="space-y-1">
            <Label>Gambar Modul</Label>
            {preview ? (
              <div className="relative w-full h-36 rounded-xl overflow-hidden border border-border">
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="w-full h-24 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
              >
                <Upload className="w-5 h-5" />
                <span className="text-xs font-medium">
                  {uploading ? 'Mengupload...' : 'Klik untuk upload gambar'}
                </span>
                <span className="text-[10px]">JPG, PNG, WebP — maks. 5MB</span>
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
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
          <Button variant="outline" onClick={onClose} disabled={isBusy}>Batal</Button>
          <Button onClick={() => onSave(form, initial?.id)} disabled={isBusy || !form.title}>
            {uploading ? 'Mengupload...' : saving ? 'Menyimpan...' : 'Simpan'}
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
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const PER_PAGE = 10

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return q
      ? modules.filter(m => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q))
      : modules
  }, [modules, search])

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const handleSearch = (v: string) => { setSearch(v); setPage(1) }

  const upsert = useMutation({
    mutationFn: async ({ form, id }: { form: ModuleForm; id?: number }) => {
      const payload = { ...form, emoji: '' }
      if (id) {
        const { error } = await supabase.from('modules').update(payload).eq('id', id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('modules').insert(payload)
        if (error) throw error
      }
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['admin-modules'] })
      qc.invalidateQueries({ queryKey: ['admin-sidebar-modules'] })
      toast.success(id ? 'Modul berhasil diperbarui.' : 'Modul berhasil ditambahkan.')
      setDialogOpen(false)
      setEditTarget(null)
    },
    onError: () => toast.error('Gagal menyimpan modul.'),
  })

  const del = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('modules').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-modules'] })
      toast.success('Modul berhasil dihapus.')
      setDeleteTarget(null)
    },
    onError: () => toast.error('Gagal menghapus modul.'),
  })

  const openCreate = () => { setEditTarget(null); setDialogOpen(true) }
  const openEdit = (m: Module) => { setEditTarget(m); setDialogOpen(true) }

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center">
            <LayoutGrid className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Modul</h1>
            <p className="text-xs text-muted-foreground">{modules.length} modul terdaftar</p>
          </div>
        </div>

        {/* Search + Add */}
        <div className="flex items-center justify-between gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari modul..."
              value={search}
              onChange={e => handleSearch(e.target.value)}
              className="pl-9 h-9 w-64 rounded-lg"
            />
          </div>
          <Button onClick={openCreate} className="gap-2 rounded-lg shrink-0">
            <Plus className="w-4 h-4" /> Tambah Modul
          </Button>
        </div>

        {/* Table */}
        <Card className="border border-border overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 bg-muted/50 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wide">
            <span className="w-8">#</span>
            <span className="w-14">Gambar</span>
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
                    <Skeleton className="w-10 h-10 rounded-lg" />
                    <Skeleton className="flex-1 h-4" />
                    <Skeleton className="w-14 h-6 rounded-full" />
                    <Skeleton className="w-20 h-6 rounded-full" />
                    <Skeleton className="w-28 h-8 rounded-lg" />
                  </div>
                ))
              : paginated.map((m, i) => (
                  <div key={m.id} className={`flex items-center gap-3 px-5 py-3.5 ${i < paginated.length - 1 ? 'border-b border-border' : ''} hover:bg-muted/20 transition-colors`}>
                    <span className="w-8 text-sm text-muted-foreground font-mono">{m.sort_order}</span>
                    <div className="w-14 shrink-0">
                      {m.image_url ? (
                        <img
                          src={m.image_url}
                          alt={m.title}
                          className="w-10 h-10 rounded-lg object-cover border border-border"
                        />
                      ) : (
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${m.header_bg}`}>
                          {m.emoji || '📚'}
                        </div>
                      )}
                    </div>
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

        <Pagination page={page} total={filtered.length} perPage={PER_PAGE} onChange={setPage} />
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
    </AdminLayout>
  )
}

export default AdminModules
