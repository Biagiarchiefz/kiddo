import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router'
import { Plus, Pencil, Trash2, ChevronRight, Layers, FileText } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import AdminLayout from '@/components/layouts/AdminLayout/AdminLayout'
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
import type { Unit, Module } from '@/types/database'

// ── Data ─────────────────────────────────────────────────────────────────────

async function fetchModule(id: number): Promise<Module> {
  const { data, error } = await supabase.from('modules').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

async function fetchUnits(moduleId: number): Promise<Unit[]> {
  const { data, error } = await supabase
    .from('units')
    .select('*')
    .eq('module_id', moduleId)
    .order('sort_order')
  if (error) throw error
  return data ?? []
}

type UnitForm = {
  title: string
  description: string
  sort_order: number
  xp_reward: number
  unlock_required_correct: number
}

const emptyUnitForm = (): UnitForm => ({
  title: '',
  description: '',
  sort_order: 0,
  xp_reward: 50,
  unlock_required_correct: 0,
})

// ── Content Editor Dialog ─────────────────────────────────────────────────────

interface ContentEditorProps {
  open: boolean
  onClose: () => void
  unit: Unit | null
  onSave: (id: number, content: string) => void
  saving: boolean
}

const ContentEditorDialog = ({ open, onClose, unit, onSave, saving }: ContentEditorProps) => {
  const [text, setText] = useState(unit?.markdown_content ?? '')
  const [tab, setTab] = useState<'edit' | 'preview'>('edit')

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-5xl h-[85vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Konten — {unit?.title}
          </DialogTitle>
        </DialogHeader>

        {/* Tab switcher */}
        <div className="shrink-0 flex gap-1 bg-muted rounded-lg p-1 w-fit">
          <button
            onClick={() => setTab('edit')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${tab === 'edit' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Edit
          </button>
          <button
            onClick={() => setTab('preview')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${tab === 'preview' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Preview
          </button>
        </div>

        {/* Editor / Preview */}
        <div className="flex-1 overflow-hidden min-h-0">
          {tab === 'edit' ? (
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={`# Judul Konten\n\nTulis konten bacaan di sini...\n\n## Sub Judul\n\nParagraf isi materi.`}
              className="w-full h-full resize-none rounded-lg border border-border bg-muted/30 p-4 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          ) : (
            <div className="h-full overflow-y-auto rounded-lg border border-border bg-background p-5">
              {text.trim() ? (
                <div className="prose prose-sm max-w-none
                  prose-headings:font-bold prose-headings:text-foreground
                  prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
                  prose-p:text-muted-foreground prose-p:leading-relaxed
                  prose-strong:text-foreground prose-strong:font-semibold
                  prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-mono
                  prose-pre:bg-muted prose-pre:rounded-lg
                  prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                  prose-blockquote:border-primary/40 prose-blockquote:text-muted-foreground
                  prose-hr:border-border">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">Belum ada konten untuk ditampilkan.</p>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="shrink-0">
          <p className="text-xs text-muted-foreground mr-auto">Gunakan # untuk H1, ## untuk H2, **tebal**, *miring*, dll.</p>
          <Button variant="outline" onClick={onClose} disabled={saving}>Batal</Button>
          <Button onClick={() => unit && onSave(unit.id, text)} disabled={saving}>
            {saving ? 'Menyimpan...' : 'Simpan Konten'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Unit Form Dialog ──────────────────────────────────────────────────────────

interface UnitDialogProps {
  open: boolean
  onClose: () => void
  initial?: Unit | null
  onSave: (form: UnitForm, id?: number) => void
  saving: boolean
}

const UnitDialog = ({ open, onClose, initial, onSave, saving }: UnitDialogProps) => {
  const [form, setForm] = useState<UnitForm>(
    initial
      ? { title: initial.title, description: initial.description, sort_order: initial.sort_order,
          xp_reward: initial.xp_reward, unlock_required_correct: initial.unlock_required_correct }
      : emptyUnitForm()
  )
  const set = (k: keyof UnitForm, v: string | number) => setForm(prev => ({ ...prev, [k]: v }))

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{initial ? 'Edit Unit' : 'Tambah Unit'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="space-y-1">
            <Label>Judul</Label>
            <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Judul unit" />
          </div>
          <div className="space-y-1">
            <Label>Deskripsi</Label>
            <Input value={form.description} onChange={e => set('description', e.target.value)} placeholder="Deskripsi singkat" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label>Urutan</Label>
              <Input type="number" min={0} value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))} />
            </div>
            <div className="space-y-1">
              <Label>XP Reward</Label>
              <Input type="number" min={0} value={form.xp_reward} onChange={e => set('xp_reward', Number(e.target.value))} />
            </div>
            <div className="space-y-1">
              <Label>Min. Benar Unlock</Label>
              <Input type="number" min={0} value={form.unlock_required_correct} onChange={e => set('unlock_required_correct', Number(e.target.value))} />
            </div>
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

const AdminUnits = () => {
  const { moduleId } = useParams<{ moduleId: string }>()
  const mid = Number(moduleId)
  const qc = useQueryClient()

  const { data: mod } = useQuery({ queryKey: ['admin-module', mid], queryFn: () => fetchModule(mid), staleTime: 60_000 })
  const { data: units = [], isLoading } = useQuery({ queryKey: ['admin-units', mid], queryFn: () => fetchUnits(mid), staleTime: 30_000 })

  useBreadcrumb([
    { label: 'Admin', href: '/admin' },
    { label: 'Modul', href: '/admin/modules' },
    { label: mod?.title ?? '...', href: `/admin/modules` },
    { label: 'Unit' },
  ])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Unit | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Unit | null>(null)
  const [contentTarget, setContentTarget] = useState<Unit | null>(null)

  const upsert = useMutation({
    mutationFn: async ({ form, id }: { form: UnitForm; id?: number }) => {
      if (id) {
        const { error } = await supabase.from('units').update(form).eq('id', id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('units').insert({ ...form, module_id: mid })
        if (error) throw error
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-units', mid] }); setDialogOpen(false); setEditTarget(null) },
  })

  const del = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('units').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-units', mid] }); setDeleteTarget(null) },
  })

  const saveContent = useMutation({
    mutationFn: async ({ id, content }: { id: number; content: string }) => {
      const { error } = await supabase.from('units').update({ markdown_content: content }).eq('id', id)
      if (error) throw error
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-units', mid] }); setContentTarget(null) },
  })

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Unit — {mod?.emoji} {mod?.title}</h1>
              <p className="text-xs text-muted-foreground">{units.length} unit terdaftar</p>
            </div>
          </div>
          <Button onClick={() => { setEditTarget(null); setDialogOpen(true) }} className="gap-2 rounded-lg">
            <Plus className="w-4 h-4" /> Tambah Unit
          </Button>
        </div>

        <Card className="border border-border overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 bg-muted/50 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wide">
            <span className="w-8">#</span>
            <span className="flex-1">Judul</span>
            <span className="w-16 text-center">XP</span>
            <span className="w-20 text-center">Min Benar</span>
            <span className="w-36 text-center">Aksi</span>
          </div>
          <CardContent className="p-0">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3.5 border-b border-border last:border-0">
                    <Skeleton className="w-8 h-4" /><Skeleton className="flex-1 h-4" />
                    <Skeleton className="w-16 h-6" /><Skeleton className="w-20 h-6" /><Skeleton className="w-28 h-8 rounded-lg" />
                  </div>
                ))
              : units.map((u, i) => (
                  <div key={u.id} className={`flex items-center gap-3 px-5 py-3.5 ${i < units.length - 1 ? 'border-b border-border' : ''} hover:bg-muted/20 transition-colors`}>
                    <span className="w-8 text-sm text-muted-foreground font-mono">{u.sort_order}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{u.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.description}</p>
                    </div>
                    <span className="w-16 text-center text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">{u.xp_reward} XP</span>
                    <span className="w-20 text-center text-xs text-muted-foreground">{u.unlock_required_correct} soal</span>
                    <div className="w-36 flex items-center justify-center gap-1">
                      <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1 text-sky-600 hover:text-sky-700 hover:bg-sky-50">
                        <Link to={`/admin/units/${u.id}/questions`}>
                          Soal <ChevronRight className="w-3 h-3" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-purple-500 hover:text-purple-700 hover:bg-purple-50" title="Edit Konten" onClick={() => setContentTarget(u)}>
                        <FileText className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground" onClick={() => { setEditTarget(u); setDialogOpen(true) }}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive/60 hover:text-destructive hover:bg-destructive/10" onClick={() => setDeleteTarget(u)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))
            }
          </CardContent>
        </Card>
      </div>

      {dialogOpen && (
        <UnitDialog
          open={dialogOpen}
          onClose={() => { setDialogOpen(false); setEditTarget(null) }}
          initial={editTarget}
          onSave={(form, id) => upsert.mutate({ form, id })}
          saving={upsert.isPending}
        />
      )}

      {contentTarget && (
        <ContentEditorDialog
          open={!!contentTarget}
          onClose={() => setContentTarget(null)}
          unit={contentTarget}
          onSave={(id, content) => saveContent.mutate({ id, content })}
          saving={saveContent.isPending}
        />
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={v => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus unit "{deleteTarget?.title}"?</AlertDialogTitle>
            <AlertDialogDescription>Semua soal di unit ini juga akan terhapus.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteTarget && del.mutate(deleteTarget.id)} className="bg-destructive text-white hover:bg-destructive/90">
              {del.isPending ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  )
}

export default AdminUnits
