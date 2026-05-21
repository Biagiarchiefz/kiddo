import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Users, Plus, Pencil, Trash2, ShieldCheck, User, Search } from 'lucide-react'
import AdminLayout from '@/components/layouts/AdminLayout/AdminLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { supabase } from '@/utils/supabase'
import { useBreadcrumb } from '@/contexts/BreadcrumbContext'
import Pagination from '@/components/common/Pagination'

// ── Types ─────────────────────────────────────────────────────────────────────

interface UserRow {
  id: string
  email: string
  username: string
  school: string
  role: 'user' | 'admin'
  total_xp: number
  level: number
  created_at: string
}

// ── Data ─────────────────────────────────────────────────────────────────────

async function fetchUsers(): Promise<UserRow[]> {
  const { data, error } = await supabase.rpc('admin_list_users')
  if (error) throw error
  return (data ?? []) as UserRow[]
}

// ── Create Dialog ─────────────────────────────────────────────────────────────

type CreateForm = {
  email: string
  password: string
  username: string
  school: string
  role: 'user' | 'admin'
}

const emptyCreate = (): CreateForm => ({
  email: '', password: '', username: '', school: '', role: 'user',
})

interface CreateDialogProps {
  open: boolean
  onClose: () => void
  onSave: (form: CreateForm) => void
  saving: boolean
  error: string | null
}

const CreateDialog = ({ open, onClose, onSave, saving, error }: CreateDialogProps) => {
  const [form, setForm] = useState<CreateForm>(emptyCreate())
  const set = (k: keyof CreateForm, v: string) => setForm(p => ({ ...p, [k]: v }))

  const handleClose = () => { setForm(emptyCreate()); onClose() }

  return (
    <Dialog open={open} onOpenChange={v => !v && handleClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tambah Pengguna</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Nama Pengguna</Label>
              <Input value={form.username} onChange={e => set('username', e.target.value)} placeholder="Nama panggilan" />
            </div>
            <div className="space-y-1">
              <Label>Sekolah</Label>
              <Input value={form.school} onChange={e => set('school', e.target.value)} placeholder="Nama sekolah" />
            </div>
          </div>
          <div className="space-y-1">
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@contoh.com" />
          </div>
          <div className="space-y-1">
            <Label>Password</Label>
            <Input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min. 6 karakter" />
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <div className="flex gap-2">
              {(['user', 'admin'] as const).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => set('role', r)}
                  className={`flex-1 flex items-center justify-center gap-2 h-9 rounded-lg border text-sm font-semibold transition-colors ${
                    form.role === r
                      ? r === 'admin'
                        ? 'bg-amber-500 border-amber-500 text-white'
                        : 'bg-primary border-primary text-white'
                      : 'border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {r === 'admin' ? <ShieldCheck className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  {r === 'admin' ? 'Admin' : 'Pengguna'}
                </button>
              ))}
            </div>
          </div>
          {error && (
            <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={saving}>Batal</Button>
          <Button
            onClick={() => onSave(form)}
            disabled={saving || !form.email || !form.password || !form.username}
          >
            {saving ? 'Membuat...' : 'Buat Akun'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Edit Dialog ───────────────────────────────────────────────────────────────

type EditForm = { username: string; school: string; role: 'user' | 'admin' }

interface EditDialogProps {
  open: boolean
  onClose: () => void
  user: UserRow | null
  onSave: (id: string, form: EditForm) => void
  saving: boolean
}

const EditDialog = ({ open, onClose, user, onSave, saving }: EditDialogProps) => {
  const [form, setForm] = useState<EditForm>({
    username: user?.username ?? '',
    school: user?.school ?? '',
    role: user?.role ?? 'user',
  })
  const set = (k: keyof EditForm, v: string) => setForm(p => ({ ...p, [k]: v }))

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Pengguna — {user?.email}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Nama Pengguna</Label>
              <Input value={form.username} onChange={e => set('username', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Sekolah</Label>
              <Input value={form.school} onChange={e => set('school', e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <div className="flex gap-2">
              {(['user', 'admin'] as const).map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => set('role', r)}
                  className={`flex-1 flex items-center justify-center gap-2 h-9 rounded-lg border text-sm font-semibold transition-colors ${
                    form.role === r
                      ? r === 'admin'
                        ? 'bg-amber-500 border-amber-500 text-white'
                        : 'bg-primary border-primary text-white'
                      : 'border-border text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {r === 'admin' ? <ShieldCheck className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  {r === 'admin' ? 'Admin' : 'Pengguna'}
                </button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>Batal</Button>
          <Button onClick={() => user && onSave(user.id, form)} disabled={saving || !form.username}>
            {saving ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────

const AdminUsers = () => {
  useBreadcrumb([{ label: 'Admin', href: '/admin' }, { label: 'Pengguna' }])
  const qc = useQueryClient()

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: fetchUsers,
    staleTime: 30_000,
  })

  const [createOpen, setCreateOpen] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [editTarget, setEditTarget] = useState<UserRow | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const PER_PAGE = 10

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return q
      ? users.filter(u =>
          u.username.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.school ?? '').toLowerCase().includes(q)
        )
      : users
  }, [users, search])

  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const handleSearch = (v: string) => { setSearch(v); setPage(1) }

  const create = useMutation({
    mutationFn: async (form: CreateForm) => {
      const { error } = await supabase.rpc('admin_create_user', {
        p_email: form.email,
        p_password: form.password,
        p_username: form.username,
        p_school: form.school,
        p_role: form.role,
      })
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('Akun pengguna berhasil dibuat.')
      setCreateOpen(false)
      setCreateError(null)
    },
    onError: (e: Error) => setCreateError(e.message),
  })

  const edit = useMutation({
    mutationFn: async ({ id, form }: { id: string; form: EditForm }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ username: form.username, school: form.school, role: form.role })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('Data pengguna berhasil diperbarui.')
      setEditTarget(null)
    },
    onError: () => toast.error('Gagal memperbarui data pengguna.'),
  })

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.rpc('admin_delete_user', { p_user_id: id })
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('Akun pengguna berhasil dihapus.')
      setDeleteTarget(null)
    },
    onError: () => toast.error('Gagal menghapus akun pengguna.'),
  })

  return (
    <AdminLayout>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Pengguna</h1>
            <p className="text-xs text-muted-foreground">{users.length} akun terdaftar</p>
          </div>
        </div>

        {/* Search + Add */}
        <div className="flex items-center justify-between gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cari pengguna..."
              value={search}
              onChange={e => handleSearch(e.target.value)}
              className="pl-9 h-9 w-64 rounded-lg"
            />
          </div>
          <Button onClick={() => { setCreateError(null); setCreateOpen(true) }} className="gap-2 rounded-lg shrink-0">
            <Plus className="w-4 h-4" /> Tambah Pengguna
          </Button>
        </div>

        {/* Table */}
        <Card className="border border-border overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-3 bg-muted/50 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wide">
            <span className="w-8">#</span>
            <span className="flex-1">Pengguna</span>
            <span className="w-28">Email</span>
            <span className="w-16 text-center">XP</span>
            <span className="w-20 text-center">Role</span>
            <span className="w-20 text-center">Aksi</span>
          </div>
          <CardContent className="p-0">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3.5 border-b border-border last:border-0">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="flex-1 h-4" />
                    <Skeleton className="w-28 h-4" />
                    <Skeleton className="w-16 h-5 rounded-full" />
                    <Skeleton className="w-20 h-5 rounded-full" />
                    <Skeleton className="w-20 h-7 rounded-lg" />
                  </div>
                ))
              : paginated.map((u, i) => (
                  <div
                    key={u.id}
                    className={`flex items-center gap-3 px-5 py-3 ${i < paginated.length - 1 ? 'border-b border-border' : ''} hover:bg-muted/20 transition-colors`}
                  >
                    {/* No */}
                    <span className="w-8 text-sm text-muted-foreground font-mono shrink-0">
                      {(page - 1) * PER_PAGE + i + 1}
                    </span>
                    {/* Avatar */}
                    <Avatar className="w-8 h-8 shrink-0">
                      <AvatarFallback className={`text-xs font-bold ${u.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'}`}>
                        {(u.username || u.email).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {/* Name + school */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{u.username || '—'}</p>
                      <p className="text-xs text-muted-foreground truncate">{u.school || '—'}</p>
                    </div>

                    {/* Email */}
                    <p className="w-28 text-xs text-muted-foreground truncate">{u.email}</p>

                    {/* XP */}
                    <span className="w-16 text-center text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                      {u.total_xp} XP
                    </span>

                    {/* Role badge */}
                    <div className="w-20 flex justify-center">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        u.role === 'admin'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-sky-50 text-sky-700'
                      }`}>
                        {u.role === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                        {u.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="w-20 flex items-center justify-center gap-1">
                      <Button
                        variant="ghost" size="sm"
                        className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => setEditTarget(u)}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost" size="sm"
                        className="h-7 w-7 p-0 text-destructive/60 hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteTarget(u)}
                      >
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

      {/* Create dialog */}
      <CreateDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={form => create.mutate(form)}
        saving={create.isPending}
        error={createError}
      />

      {/* Edit dialog */}
      {editTarget && (
        <EditDialog
          open={!!editTarget}
          onClose={() => setEditTarget(null)}
          user={editTarget}
          onSave={(id, form) => edit.mutate({ id, form })}
          saving={edit.isPending}
        />
      )}

      {/* Delete confirm */}
      <AlertDialog open={!!deleteTarget} onOpenChange={v => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus akun "{deleteTarget?.username}"?</AlertDialogTitle>
            <AlertDialogDescription>
              Email: {deleteTarget?.email}. Semua data pengguna ini akan terhapus permanen.
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

export default AdminUsers