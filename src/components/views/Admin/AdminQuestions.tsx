import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { Plus, Pencil, Trash2, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
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
import type { Question, QuestionOption, Unit } from '@/types/database'

// ── Data ─────────────────────────────────────────────────────────────────────

async function fetchUnit(id: number): Promise<Unit> {
  const { data, error } = await supabase.from('units').select('*').eq('id', id).single()
  if (error) throw error
  return data
}

interface QuestionWithOptions extends Question {
  question_options: QuestionOption[]
}

async function fetchQuestions(unitId: number): Promise<QuestionWithOptions[]> {
  const { data, error } = await supabase
    .from('questions')
    .select('*, question_options(*)')
    .eq('unit_id', unitId)
    .order('id')
  if (error) throw error
  return (data ?? []) as QuestionWithOptions[]
}

// ── Question Form ─────────────────────────────────────────────────────────────

type OptionDraft = { key: string; text: string }

type QuestionForm = {
  category: string
  question: string
  hint: string
  correct: string
  xp_reward: number
  options: OptionDraft[]
}

const emptyForm = (): QuestionForm => ({
  category: 'pilihan_ganda',
  question: '',
  hint: '',
  correct: 'a',
  xp_reward: 10,
  options: [
    { key: 'a', text: '' },
    { key: 'b', text: '' },
    { key: 'c', text: '' },
    { key: 'd', text: '' },
  ],
})

interface QuestionDialogProps {
  open: boolean
  onClose: () => void
  initial?: QuestionWithOptions | null
  onSave: (form: QuestionForm, id?: number) => void
  saving: boolean
}

const QuestionDialog = ({ open, onClose, initial, onSave, saving }: QuestionDialogProps) => {
  const [form, setForm] = useState<QuestionForm>(
    initial
      ? {
          category: initial.category,
          question: initial.question,
          hint: initial.hint ?? '',
          correct: initial.correct,
          xp_reward: initial.xp_reward,
          options: initial.question_options.length > 0
            ? initial.question_options.map(o => ({ key: o.option_key, text: o.text }))
            : emptyForm().options,
        }
      : emptyForm()
  )

  const set = (k: keyof QuestionForm, v: string | number | OptionDraft[]) =>
    setForm(prev => ({ ...prev, [k]: v }))

  const setOption = (idx: number, text: string) =>
    setForm(prev => ({ ...prev, options: prev.options.map((o, i) => i === idx ? { ...o, text } : o) }))

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? 'Edit Soal' : 'Tambah Soal'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Kategori</Label>
              <Input value={form.category} onChange={e => set('category', e.target.value)} placeholder="pilihan_ganda" />
            </div>
            <div className="space-y-1">
              <Label>XP Reward</Label>
              <Input type="number" min={0} value={form.xp_reward} onChange={e => set('xp_reward', Number(e.target.value))} />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Pertanyaan</Label>
            <Input value={form.question} onChange={e => set('question', e.target.value)} placeholder="Teks pertanyaan..." />
          </div>
          <div className="space-y-1">
            <Label>Hint (opsional)</Label>
            <Input value={form.hint} onChange={e => set('hint', e.target.value)} placeholder="Petunjuk untuk siswa..." />
          </div>

          {/* Options */}
          <div className="space-y-2">
            <Label>Pilihan Jawaban</Label>
            {form.options.map((opt, i) => (
              <div key={opt.key} className="flex items-center gap-2">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${form.correct === opt.key ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                  {opt.key.toUpperCase()}
                </span>
                <Input
                  value={opt.text}
                  onChange={e => setOption(i, e.target.value)}
                  placeholder={`Opsi ${opt.key.toUpperCase()}`}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => set('correct', opt.key)}
                  className={`text-xs px-2 py-1 rounded-md font-semibold shrink-0 transition-colors ${form.correct === opt.key ? 'bg-green-100 text-green-700' : 'text-muted-foreground hover:bg-muted'}`}
                >
                  {form.correct === opt.key ? '✓ Benar' : 'Benar?'}
                </button>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>Batal</Button>
          <Button onClick={() => onSave(form, initial?.id)} disabled={saving || !form.question}>
            {saving ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Question Row ──────────────────────────────────────────────────────────────

const QuestionRow = ({
  q, idx, total, onEdit, onDelete,
}: {
  q: QuestionWithOptions; idx: number; total: number
  onEdit: (q: QuestionWithOptions) => void; onDelete: (q: QuestionWithOptions) => void
}) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className={idx < total - 1 ? 'border-b border-border' : ''}>
      <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/20 transition-colors">
        <span className="w-6 text-sm font-mono text-muted-foreground">{idx + 1}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{q.question}</p>
          <p className="text-xs text-muted-foreground">{q.category} · Jawaban: <span className="font-bold text-green-600">{q.correct.toUpperCase()}</span></p>
        </div>
        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">{q.xp_reward} XP</span>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground shrink-0" onClick={() => setExpanded(v => !v)}>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground" onClick={() => onEdit(q)}>
          <Pencil className="w-3.5 h-3.5" />
        </Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-destructive/60 hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(q)}>
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
      {expanded && q.question_options.length > 0 && (
        <div className="px-14 pb-3 grid grid-cols-2 gap-1.5">
          {q.question_options.map(opt => (
            <div key={opt.id} className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg ${opt.option_key === q.correct ? 'bg-green-50 border border-green-200 text-green-700 font-semibold' : 'bg-muted text-muted-foreground'}`}>
              <span className="font-black">{opt.option_key.toUpperCase()}.</span>
              <span className="truncate">{opt.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────

const AdminQuestions = () => {
  const { unitId } = useParams<{ unitId: string }>()
  const uid = Number(unitId)
  const qc = useQueryClient()

  const { data: unit } = useQuery({ queryKey: ['admin-unit', uid], queryFn: () => fetchUnit(uid), staleTime: 60_000 })
  const { data: questions = [], isLoading } = useQuery({ queryKey: ['admin-questions', uid], queryFn: () => fetchQuestions(uid), staleTime: 30_000 })

  useBreadcrumb([
    { label: 'Admin', href: '/admin' },
    { label: 'Modul', href: '/admin/modules' },
    { label: unit?.title ?? '...', href: `/admin/modules/${unit?.module_id}/units` },
    { label: 'Soal' },
  ])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<QuestionWithOptions | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<QuestionWithOptions | null>(null)

  const upsert = useMutation({
    mutationFn: async ({ form, id }: { form: QuestionForm; id?: number }) => {
      let questionId = id
      const payload = {
        unit_id: uid,
        category: form.category,
        question: form.question,
        hint: form.hint || null,
        correct: form.correct,
        xp_reward: form.xp_reward,
      }

      if (id) {
        const { error } = await supabase.from('questions').update(payload).eq('id', id)
        if (error) throw error
        // remove old options then re-insert
        await supabase.from('question_options').delete().eq('question_id', id)
      } else {
        const { data, error } = await supabase.from('questions').insert(payload).select('id').single()
        if (error) throw error
        questionId = data.id
      }

      const opts = form.options
        .filter(o => o.text.trim())
        .map(o => ({ question_id: questionId!, option_key: o.key, text: o.text }))
      if (opts.length > 0) {
        const { error } = await supabase.from('question_options').insert(opts)
        if (error) throw error
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-questions', uid] })
      setDialogOpen(false)
      setEditTarget(null)
    },
  })

  const del = useMutation({
    mutationFn: async (id: number) => {
      await supabase.from('question_options').delete().eq('question_id', id)
      const { error } = await supabase.from('questions').delete().eq('id', id)
      if (error) throw error
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-questions', uid] }); setDeleteTarget(null) },
  })

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Soal — {unit?.title}</h1>
              <p className="text-xs text-muted-foreground">{questions.length} soal terdaftar</p>
            </div>
          </div>
          <Button onClick={() => { setEditTarget(null); setDialogOpen(true) }} className="gap-2 rounded-lg">
            <Plus className="w-4 h-4" /> Tambah Soal
          </Button>
        </div>

        <Card className="border border-border overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 bg-muted/50 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wide">
            <span className="w-6">#</span>
            <span className="flex-1">Pertanyaan</span>
            <span className="w-16 text-center">XP</span>
            <span className="w-28 text-center">Aksi</span>
          </div>
          <CardContent className="p-0">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3.5 border-b border-border last:border-0">
                    <Skeleton className="w-6 h-4" /><Skeleton className="flex-1 h-4" /><Skeleton className="w-16 h-6" /><Skeleton className="w-28 h-8 rounded-lg" />
                  </div>
                ))
              : questions.length === 0
                ? (
                    <div className="py-12 text-center text-muted-foreground text-sm">
                      Belum ada soal. Tambah soal pertama!
                    </div>
                  )
                : questions.map((q, i) => (
                    <QuestionRow key={q.id} q={q} idx={i} total={questions.length} onEdit={q => { setEditTarget(q); setDialogOpen(true) }} onDelete={setDeleteTarget} />
                  ))
            }
          </CardContent>
        </Card>
      </div>

      {dialogOpen && (
        <QuestionDialog
          open={dialogOpen}
          onClose={() => { setDialogOpen(false); setEditTarget(null) }}
          initial={editTarget}
          onSave={(form, id) => upsert.mutate({ form, id })}
          saving={upsert.isPending}
        />
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={v => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus soal ini?</AlertDialogTitle>
            <AlertDialogDescription>"{deleteTarget?.question}" — Tindakan ini tidak bisa dibatalkan.</AlertDialogDescription>
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

export default AdminQuestions
