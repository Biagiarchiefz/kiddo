-- ══════════════════════════════════════════════════════════════════════════════
-- KIDDO — Supabase Database Schema
-- Platform belajar micro-learning untuk anak-anak (Gen Alpha, 7–12 tahun)
--
-- Entitas utama:
--   profiles            → data pengguna (extends auth.users)
--   modules             → modul belajar (Tata Surya, Dunia Hewan, dst.)
--   units               → sub-unit dalam modul, bisa terkunci
--   questions           → soal kuis / flashcard
--   question_options    → pilihan jawaban per soal
--   badges              → definisi lencana prestasi
--   user_unit_progress  → progres per user per unit
--   quiz_sessions       → sesi kuis (unit-quiz atau mixed challenge)
--   quiz_attempts       → jawaban per soal dalam satu sesi
--   xp_log              → audit trail semua perolehan XP
--   user_badges         → lencana yang sudah diraih user
-- ══════════════════════════════════════════════════════════════════════════════

-- ─── Extensions ──────────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";


-- ══════════════════════════════════════════════════════════════════════════════
-- TABLES
-- ══════════════════════════════════════════════════════════════════════════════

-- ─── 1. PROFILES ─────────────────────────────────────────────────────────────
-- Satu baris per user Supabase Auth; dibuat otomatis oleh trigger on_auth_user_created.
-- username  → nama panggilan (dari form register atau user_metadata Google)
-- school    → nama sekolah (dari form register, kosong jika daftar via Google)
-- total_xp  → akumulasi XP, diperbarui otomatis via trigger on_xp_log_insert
-- level     → floor(total_xp / 500) + 1, diperbarui bersamaan dengan total_xp
create table public.profiles (
  id          uuid        primary key references auth.users (id) on delete cascade,
  username    text        not null,
  school      text        not null default '',
  avatar_url  text,
  total_xp    integer     not null default 0,
  level       integer     not null default 1,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ─── 2. MODULES ──────────────────────────────────────────────────────────────
-- Topik belajar level teratas (Tata Surya, Dunia Hewan, Matematika Asyik, dst.)
-- header_bg / progress_color / badge_color → Tailwind class yang dipakai di UI
-- is_published → hanya modul yang published yang terlihat oleh pengguna
create table public.modules (
  id             serial      primary key,
  title          text        not null,
  description    text        not null,
  emoji          text        not null,
  level          integer     not null default 1,
  header_bg      text        not null default 'bg-amber-300',
  progress_color text        not null default 'bg-primary',
  badge_color    text        not null default 'bg-primary text-white',
  is_published   boolean     not null default false,
  sort_order     integer     not null default 0,
  created_at     timestamptz not null default now()
);

-- ─── 3. UNITS ────────────────────────────────────────────────────────────────
-- Sub-unit dalam sebuah modul, ditampilkan secara berurutan (sort_order).
-- unlock_required_correct → jumlah jawaban benar pada unit SEBELUMNYA yang
--   dibutuhkan untuk membuka kunci unit ini (0 = selalu terbuka / unit pertama).
-- xp_reward → XP yang diberikan saat user menyelesaikan unit ini.
create table public.units (
  id                       serial      primary key,
  module_id                integer     not null references public.modules (id) on delete cascade,
  title                    text        not null,
  description              text        not null,
  sort_order               integer     not null default 0,
  xp_reward                integer     not null default 50,
  unlock_required_correct  integer     not null default 0,
  created_at               timestamptz not null default now()
);

-- ─── 4. QUESTIONS ────────────────────────────────────────────────────────────
-- Soal kuis / flashcard.
-- unit_id NULL → soal "tantangan campuran" (mixed challenge), tidak terikat unit tertentu.
-- correct → option_key dari jawaban yang benar ('A' | 'B' | 'C' | 'D').
-- xp_reward → XP per jawaban benar.
create table public.questions (
  id          serial      primary key,
  unit_id     integer     references public.units (id) on delete set null,
  category    text        not null,
  question    text        not null,
  hint        text,
  correct     text        not null,
  xp_reward   integer     not null default 10,
  created_at  timestamptz not null default now()
);

-- ─── 5. QUESTION_OPTIONS ─────────────────────────────────────────────────────
-- Pilihan jawaban untuk setiap soal (maks. 4 pilihan per soal).
-- option_key → 'A' | 'B' | 'C' | 'D'
create table public.question_options (
  id          serial  primary key,
  question_id integer not null references public.questions (id) on delete cascade,
  option_key  text    not null,
  text        text    not null,
  unique (question_id, option_key)
);

-- ─── 6. BADGES ───────────────────────────────────────────────────────────────
-- Definisi lencana prestasi yang bisa diraih pengguna.
-- condition_type  → 'xp_milestone' | 'unit_completed' | 'module_completed' | 'quiz_correct_streak'
-- condition_value → nilai ambang batas (mis. 1000 untuk xp_milestone 1000 XP)
create table public.badges (
  id               serial      primary key,
  name             text        not null unique,
  description      text        not null,
  emoji            text        not null,
  condition_type   text        not null,
  condition_value  integer     not null,
  created_at       timestamptz not null default now()
);

-- ─── 7. USER_UNIT_PROGRESS ───────────────────────────────────────────────────
-- Satu baris per (user, unit) → melacak status dan jawaban benar.
-- status: 'locked' → 'in_progress' → 'completed'
-- correct_answers → dipakai untuk kalkulasi syarat membuka unit berikutnya.
create table public.user_unit_progress (
  id              uuid        primary key default uuid_generate_v4(),
  user_id         uuid        not null references public.profiles (id) on delete cascade,
  unit_id         integer     not null references public.units (id) on delete cascade,
  status          text        not null default 'locked'
                                check (status in ('locked', 'in_progress', 'completed')),
  correct_answers integer     not null default 0,
  completed_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (user_id, unit_id)
);

-- ─── 8. QUIZ_SESSIONS ────────────────────────────────────────────────────────
-- Satu baris per sesi kuis yang dimulai user.
-- session_type: 'unit' (kuis per unit) | 'challenge' (tantangan campuran)
-- unit_id NULL → sesi challenge / mixed.
create table public.quiz_sessions (
  id           uuid        primary key default uuid_generate_v4(),
  user_id      uuid        not null references public.profiles (id) on delete cascade,
  unit_id      integer     references public.units (id) on delete set null,
  session_type text        not null check (session_type in ('unit', 'challenge')),
  total_q      integer     not null,
  correct_q    integer     not null default 0,
  xp_earned    integer     not null default 0,
  started_at   timestamptz not null default now(),
  finished_at  timestamptz
);

-- ─── 9. QUIZ_ATTEMPTS ────────────────────────────────────────────────────────
-- Satu baris per soal yang dijawab dalam satu sesi.
-- xp_earned → diisi otomatis oleh trigger handle_quiz_attempt.
create table public.quiz_attempts (
  id              uuid        primary key default uuid_generate_v4(),
  session_id      uuid        not null references public.quiz_sessions (id) on delete cascade,
  user_id         uuid        not null references public.profiles (id) on delete cascade,
  question_id     integer     not null references public.questions (id),
  selected_option text        not null,
  is_correct      boolean     not null,
  xp_earned       integer     not null default 0,
  answered_at     timestamptz not null default now()
);

-- ─── 10. XP_LOG ──────────────────────────────────────────────────────────────
-- Append-only audit trail setiap perolehan XP.
-- reason: 'quiz_correct' | 'unit_completed' | 'module_completed' | 'badge_bonus'
-- source_id → UUID sesi / unit / badge sebagai teks (flexible reference)
create table public.xp_log (
  id          uuid        primary key default uuid_generate_v4(),
  user_id     uuid        not null references public.profiles (id) on delete cascade,
  amount      integer     not null,
  reason      text        not null,
  source_id   text,
  created_at  timestamptz not null default now()
);

-- ─── 11. UNIT_CONTENTS ───────────────────────────────────────────────────────
-- Konten bacaan (artikel) untuk setiap unit sebelum kuis.
-- intro    → paragraf pengantar singkat yang ditampilkan di atas artikel.
-- sections → array JSONB blok konten:
--              { "type": "paragraph",  "title": "...", "body": "..." }
--              { "type": "info_boxes", "boxes": [{ "title", "icon", "body" }] }
create table public.unit_contents (
  id         serial      primary key,
  unit_id    integer     not null unique references public.units (id) on delete cascade,
  intro      text        not null default '',
  sections   jsonb       not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- ─── 12. USER_BADGES ─────────────────────────────────────────────────────────
-- Lencana yang sudah diraih oleh user.
create table public.user_badges (
  id         uuid        primary key default uuid_generate_v4(),
  user_id    uuid        not null references public.profiles (id) on delete cascade,
  badge_id   integer     not null references public.badges (id),
  earned_at  timestamptz not null default now(),
  unique (user_id, badge_id)
);


-- ══════════════════════════════════════════════════════════════════════════════
-- INDEXES (performa query leaderboard, progress, dan attempts)
-- ══════════════════════════════════════════════════════════════════════════════

create index idx_units_module_id            on public.units (module_id);
create index idx_questions_unit_id          on public.questions (unit_id);
create index idx_qoptions_question_id       on public.question_options (question_id);
create index idx_uup_user_id               on public.user_unit_progress (user_id);
create index idx_uup_unit_id               on public.user_unit_progress (unit_id);
create index idx_quiz_sessions_user_id     on public.quiz_sessions (user_id);
create index idx_quiz_attempts_session_id  on public.quiz_attempts (session_id);
create index idx_quiz_attempts_user_id     on public.quiz_attempts (user_id);
create index idx_xp_log_user_id            on public.xp_log (user_id);
create index idx_user_badges_user_id       on public.user_badges (user_id);
-- Untuk sorting leaderboard cepat
create index idx_profiles_total_xp         on public.profiles (total_xp desc);
create index idx_unit_contents_unit_id     on public.unit_contents (unit_id);


-- ══════════════════════════════════════════════════════════════════════════════
-- VIEWS
-- ══════════════════════════════════════════════════════════════════════════════

-- Leaderboard publik: semua user diurutkan berdasarkan total_xp desc.
-- RLS profiles berlaku secara otomatis karena ini adalah view.
create or replace view public.leaderboard as
select
  p.id         as user_id,
  p.username   as name,
  p.school,
  p.total_xp   as xp,
  p.level,
  row_number() over (order by p.total_xp desc) as rank
from public.profiles p
order by p.total_xp desc;


-- ══════════════════════════════════════════════════════════════════════════════
-- FUNCTIONS & TRIGGERS
-- ══════════════════════════════════════════════════════════════════════════════

-- ─── A. Auto-create profile saat user baru mendaftar ─────────────────────────
-- Membaca username dan school dari user_metadata (diisi saat signUp).
-- Google OAuth tidak menyertakan school, sehingga defaultnya string kosong.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, school, avatar_url)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'username',
      split_part(new.email, '@', 1)   -- fallback: bagian sebelum @ pada email
    ),
    coalesce(new.raw_user_meta_data->>'school', ''),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── B. Update updated_at otomatis ───────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger uup_set_updated_at
  before update on public.user_unit_progress
  for each row execute function public.set_updated_at();

-- ─── C. Akumulasi XP ke profiles.total_xp dan recalc level ──────────────────
-- Dijalankan setiap kali baris baru masuk ke xp_log.
-- level = floor(total_xp / 500) + 1
create or replace function public.accumulate_xp()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.profiles
  set
    total_xp = total_xp + new.amount,
    level    = floor((total_xp + new.amount) / 500) + 1
  where id = new.user_id;
  return new;
end;
$$;

create trigger on_xp_log_insert
  after insert on public.xp_log
  for each row execute function public.accumulate_xp();

-- ─── D. Catat XP dan update progress saat jawaban kuis disimpan ──────────────
-- Dijalankan BEFORE INSERT pada quiz_attempts.
-- Jika jawaban benar:
--   1. Set xp_earned pada baris attempts.
--   2. Insert ke xp_log (yang kemudian memicu accumulate_xp).
--   3. Increment correct_answers pada user_unit_progress (jika ada unit).
-- Juga update quiz_sessions.correct_q dan xp_earned.
create or replace function public.handle_quiz_attempt()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_xp        integer;
  v_unit_id   integer;
begin
  -- Ambil xp_reward dari soal
  select xp_reward, unit_id
    into v_xp, v_unit_id
    from public.questions
   where id = new.question_id;

  if new.is_correct then
    new.xp_earned := v_xp;

    -- Catat ke xp_log (akan memicu accumulate_xp)
    insert into public.xp_log (user_id, amount, reason, source_id)
    values (new.user_id, v_xp, 'quiz_correct', new.session_id::text);

    -- Update progres unit jika soal terkait unit tertentu
    if v_unit_id is not null then
      insert into public.user_unit_progress (user_id, unit_id, status, correct_answers)
      values (new.user_id, v_unit_id, 'in_progress', 1)
      on conflict (user_id, unit_id) do update
        set correct_answers = user_unit_progress.correct_answers + 1;
    end if;

    -- Update sesi: tambah correct_q dan xp_earned
    update public.quiz_sessions
    set
      correct_q = correct_q + 1,
      xp_earned = xp_earned + v_xp
    where id = new.session_id;
  end if;

  return new;
end;
$$;

create trigger on_quiz_attempt_insert
  before insert on public.quiz_attempts
  for each row execute function public.handle_quiz_attempt();

-- ─── E. Cek apakah unit berikutnya bisa dibuka (dipanggil setelah sesi selesai) ─
-- Fungsi ini dipanggil oleh aplikasi setelah sesi unit selesai.
-- Ia memeriksa apakah correct_answers pada unit ini >= unlock_required_correct
-- unit berikutnya, lalu membuka kunci unit tersebut.
create or replace function public.try_unlock_next_unit(
  p_user_id uuid,
  p_unit_id integer
)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_module_id        integer;
  v_current_order    integer;
  v_next_unit        record;
  v_correct_answers  integer;
  v_current_status   text;
begin
  -- Ambil module_id dan sort_order unit saat ini
  select module_id, sort_order
    into v_module_id, v_current_order
    from public.units
   where id = p_unit_id;

  -- Cari unit berikutnya dalam modul yang sama
  select u.id, u.unlock_required_correct
    into v_next_unit
    from public.units u
   where u.module_id = v_module_id
     and u.sort_order = v_current_order + 1
   limit 1;

  if not found then
    return; -- Tidak ada unit berikutnya
  end if;

  -- Cek status dan correct_answers user pada unit ini
  select status, correct_answers
    into v_current_status, v_correct_answers
    from public.user_unit_progress
   where user_id = p_user_id
     and unit_id = p_unit_id;

  -- Buka unit berikutnya jika unit ini sudah completed ATAU sudah memenuhi syarat jawaban benar
  if v_current_status = 'completed' or coalesce(v_correct_answers, 0) >= v_next_unit.unlock_required_correct then
    insert into public.user_unit_progress (user_id, unit_id, status)
    values (p_user_id, v_next_unit.id, 'in_progress')
    on conflict (user_id, unit_id) do update
      set status = case
        when user_unit_progress.status = 'locked' then 'in_progress'
        else user_unit_progress.status
      end;
  end if;
end;
$$;

-- ─── F. Tandai unit selesai dan beri XP bonus completion ─────────────────────
-- Dipanggil oleh aplikasi setelah sesi unit diselesaikan dengan skor penuh / cukup.
create or replace function public.complete_unit(
  p_user_id uuid,
  p_unit_id integer
)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_xp integer;
begin
  select xp_reward into v_xp from public.units where id = p_unit_id;

  update public.user_unit_progress
  set status = 'completed', completed_at = now()
  where user_id = p_user_id and unit_id = p_unit_id;

  -- Beri XP bonus penyelesaian unit
  insert into public.xp_log (user_id, amount, reason, source_id)
  values (p_user_id, v_xp, 'unit_completed', p_unit_id::text);

  -- Coba buka unit berikutnya
  perform public.try_unlock_next_unit(p_user_id, p_unit_id);
end;
$$;


-- ══════════════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ══════════════════════════════════════════════════════════════════════════════

-- ─── profiles ────────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;

-- Semua user yang sudah login bisa membaca semua profil (leaderboard)
create policy "profiles: authenticated can select"
  on public.profiles for select
  using (auth.uid() is not null);

-- Hanya user sendiri yang bisa update profilnya
create policy "profiles: owner can update"
  on public.profiles for update
  using (auth.uid() = id);

-- Insert hanya melalui trigger handle_new_user (security definer), bukan langsung dari client
create policy "profiles: no direct insert"
  on public.profiles for insert
  with check (false);

-- ─── modules ─────────────────────────────────────────────────────────────────
alter table public.modules enable row level security;

-- Semua user yang sudah login bisa membaca modul yang sudah dipublish
create policy "modules: authenticated can select published"
  on public.modules for select
  using (auth.uid() is not null and is_published = true);

-- ─── units ───────────────────────────────────────────────────────────────────
alter table public.units enable row level security;

create policy "units: authenticated can select"
  on public.units for select
  using (auth.uid() is not null);

-- ─── questions ───────────────────────────────────────────────────────────────
alter table public.questions enable row level security;

create policy "questions: authenticated can select"
  on public.questions for select
  using (auth.uid() is not null);

-- ─── question_options ────────────────────────────────────────────────────────
alter table public.question_options enable row level security;

create policy "question_options: authenticated can select"
  on public.question_options for select
  using (auth.uid() is not null);

-- ─── badges ──────────────────────────────────────────────────────────────────
alter table public.badges enable row level security;

-- Badges bisa dilihat semua orang (termasuk landing page)
create policy "badges: public select"
  on public.badges for select
  using (true);

-- ─── unit_contents ───────────────────────────────────────────────────────────
alter table public.unit_contents enable row level security;

create policy "unit_contents: authenticated can select"
  on public.unit_contents for select
  using (auth.uid() is not null);

-- ─── user_unit_progress ──────────────────────────────────────────────────────
alter table public.user_unit_progress enable row level security;

create policy "uup: owner can select"
  on public.user_unit_progress for select
  using (auth.uid() = user_id);

create policy "uup: owner can insert"
  on public.user_unit_progress for insert
  with check (auth.uid() = user_id);

create policy "uup: owner can update"
  on public.user_unit_progress for update
  using (auth.uid() = user_id);

-- ─── quiz_sessions ───────────────────────────────────────────────────────────
alter table public.quiz_sessions enable row level security;

create policy "quiz_sessions: owner can select"
  on public.quiz_sessions for select
  using (auth.uid() = user_id);

create policy "quiz_sessions: owner can insert"
  on public.quiz_sessions for insert
  with check (auth.uid() = user_id);

-- Update diizinkan untuk update correct_q / xp_earned / finished_at
create policy "quiz_sessions: owner can update"
  on public.quiz_sessions for update
  using (auth.uid() = user_id);

-- ─── quiz_attempts ───────────────────────────────────────────────────────────
alter table public.quiz_attempts enable row level security;

create policy "quiz_attempts: owner can select"
  on public.quiz_attempts for select
  using (auth.uid() = user_id);

create policy "quiz_attempts: owner can insert"
  on public.quiz_attempts for insert
  with check (auth.uid() = user_id);

-- ─── xp_log ──────────────────────────────────────────────────────────────────
alter table public.xp_log enable row level security;

-- User hanya bisa membaca riwayat XP miliknya sendiri
create policy "xp_log: owner can select"
  on public.xp_log for select
  using (auth.uid() = user_id);

-- Insert hanya boleh melalui trigger / fungsi security definer, tidak dari client langsung
create policy "xp_log: no direct insert"
  on public.xp_log for insert
  with check (false);

-- ─── user_badges ─────────────────────────────────────────────────────────────
alter table public.user_badges enable row level security;

create policy "user_badges: owner can select"
  on public.user_badges for select
  using (auth.uid() = user_id);

-- Lencana diberikan via fungsi server-side, bukan insert langsung
create policy "user_badges: no direct insert"
  on public.user_badges for insert
  with check (false);


-- ══════════════════════════════════════════════════════════════════════════════
-- SEED DATA
-- ══════════════════════════════════════════════════════════════════════════════

-- ─── Modules ─────────────────────────────────────────────────────────────────
insert into public.modules
  (title, description, emoji, level, header_bg, progress_color, badge_color, is_published, sort_order)
values
  (
    'Tata Surya',
    'Jelajahi planet-planet dan bintang-bintang di luar angkasa yang menakjubkan.',
    '🌍', 1, 'bg-amber-300', 'bg-primary', 'bg-primary text-white', true, 1
  ),
  (
    'Dunia Hewan',
    'Kenali berbagai macam hewan dan habitat mereka di seluruh penjuru dunia.',
    '🐾', 2, 'bg-rose-200', 'bg-secondary', 'bg-secondary text-white', true, 2
  ),
  (
    'Matematika Asyik',
    'Belajar berhitung dengan cara yang menyenangkan dan penuh tantangan.',
    '➕', 1, 'bg-lime-300', 'bg-primary', 'bg-muted text-muted-foreground', true, 3
  );

-- ─── Units: Modul 1 — Tata Surya ─────────────────────────────────────────────
insert into public.units
  (module_id, title, description, sort_order, xp_reward, unlock_required_correct)
values
  (1, 'Bumi Rumah Kita',
   'Belajar tentang benua, lautan, dan lapisan-lapisan bumi tempat kita tinggal.',
   1, 50, 0),                  -- sort_order 1, selalu terbuka
  (1, 'Matahari Bintang Terdekat',
   'Pelajari inti tata surya kita dan bagaimana ia memberi kita cahaya.',
   2, 50, 5);                  -- terbuka setelah 5 jawaban benar di unit 1

-- ─── Units: Modul 2 — Dunia Hewan ────────────────────────────────────────────
insert into public.units
  (module_id, title, description, sort_order, xp_reward, unlock_required_correct)
values
  (2, 'Hewan Darat',
   'Kenali berbagai hewan yang tinggal di darat dan habitatnya.',
   1, 50, 0),
  (2, 'Hewan Laut',
   'Jelajahi keanekaragaman makhluk hidup di lautan.',
   2, 50, 5);

-- ─── Units: Modul 3 — Matematika Asyik ───────────────────────────────────────
insert into public.units
  (module_id, title, description, sort_order, xp_reward, unlock_required_correct)
values
  (3, 'Penjumlahan & Pengurangan',
   'Belajar berhitung dasar dengan cara yang seru dan interaktif.',
   1, 50, 0),
  (3, 'Perkalian & Pembagian',
   'Kuasai operasi perkalian dan pembagian dengan latihan yang menyenangkan.',
   2, 50, 5);

-- ─── Questions: Unit 1 — Bumi Rumah Kita ─────────────────────────────────────
insert into public.questions (unit_id, category, question, hint, correct, xp_reward) values
  (1, 'Sains', 'Berapa banyak benua yang ada di Bumi?',
   'Pikirkan tentang daratan besar yang terpisah oleh lautan.', 'B', 10),
  (1, 'Sains', 'Lapisan terluar Bumi yang kita pijak setiap hari disebut?',
   'Kita berdiri di atas lapisan ini setiap hari.', 'A', 10),
  (1, 'Sains', 'Lautan terluas di Bumi adalah?',
   'Lautan ini memisahkan Asia dari Amerika.', 'C', 10),
  (1, 'Sains', 'Gunung tertinggi di Bumi adalah?',
   'Gunung ini berada di pegunungan Himalaya.', 'D', 10),
  (1, 'Sains', 'Apa bagian terdalam Bumi yang paling panas?',
   'Ini ada di pusat Bumi, sangat panas seperti matahari.', 'B', 10);

-- Pilihan untuk soal 1 (id = 1)
insert into public.question_options (question_id, option_key, text) values
  (1, 'A', '5 benua'), (1, 'B', '7 benua'), (1, 'C', '6 benua'), (1, 'D', '4 benua');

-- Pilihan untuk soal 2 (id = 2)
insert into public.question_options (question_id, option_key, text) values
  (2, 'A', 'Kerak Bumi'), (2, 'B', 'Mantel'), (2, 'C', 'Inti Luar'), (2, 'D', 'Inti Dalam');

-- Pilihan untuk soal 3 (id = 3)
insert into public.question_options (question_id, option_key, text) values
  (3, 'A', 'Samudra Atlantik'), (3, 'B', 'Samudra Hindia'),
  (3, 'C', 'Samudra Pasifik'),  (3, 'D', 'Samudra Arktik');

-- Pilihan untuk soal 4 (id = 4)
insert into public.question_options (question_id, option_key, text) values
  (4, 'A', 'Gunung Kilimanjaro'), (4, 'B', 'Gunung K2'),
  (4, 'C', 'Gunung Aconcagua'),   (4, 'D', 'Gunung Everest');

-- Pilihan untuk soal 5 (id = 5)
insert into public.question_options (question_id, option_key, text) values
  (5, 'A', 'Kerak Bumi'), (5, 'B', 'Inti Dalam'), (5, 'C', 'Mantel'), (5, 'D', 'Inti Luar');

-- ─── Questions: Unit 2 — Matahari Bintang Terdekat ────────────────────────────
insert into public.questions (unit_id, category, question, hint, correct, xp_reward) values
  (2, 'Sains', 'Berapa lama cahaya matahari sampai ke Bumi?',
   'Jaraknya sangat jauh, tapi cahaya bergerak sangat cepat.', 'B', 10),
  (2, 'Sains', 'Lapisan terluar matahari yang terlihat saat gerhana matahari total disebut?',
   'Lapisan ini tampak seperti mahkota bercahaya.', 'C', 10),
  (2, 'Sains', 'Matahari termasuk jenis bintang apa?',
   'Bintang ini berwarna kuning dan berukuran sedang.', 'A', 10);

-- Pilihan untuk soal 6 (id = 6)
insert into public.question_options (question_id, option_key, text) values
  (6, 'A', '1 menit'), (6, 'B', '8 menit'), (6, 'C', '1 jam'), (6, 'D', '1 detik');

-- Pilihan untuk soal 7 (id = 7)
insert into public.question_options (question_id, option_key, text) values
  (7, 'A', 'Fotosfer'), (7, 'B', 'Kromosfer'), (7, 'C', 'Korona'), (7, 'D', 'Inti');

-- Pilihan untuk soal 8 (id = 8)
insert into public.question_options (question_id, option_key, text) values
  (8, 'A', 'Katai Kuning'), (8, 'B', 'Raksasa Merah'),
  (8, 'C', 'Katai Putih'),  (8, 'D', 'Bintang Neutron');

-- ─── Questions: Mixed Challenge (unit_id = NULL) ─────────────────────────────
insert into public.questions (unit_id, category, question, hint, correct, xp_reward) values
  (null, 'Sains',       'Planet mana yang memiliki cincin terbesar di tata surya?',
   'Planet ini memiliki cincin indah yang bisa dilihat dari Bumi dengan teleskop.', 'B', 10),
  (null, 'Hewan',       'Hewan apa yang dikenal sebagai raja hutan?',
   'Hewan ini punya surai lebat di kepalanya.', 'A', 10),
  (null, 'Matematika',  'Berapakah hasil dari 8 × 7?',
   'Coba kalikan 8 dengan 7.', 'C', 10),
  (null, 'Sains',       'Gas apa yang paling banyak terdapat di atmosfer Bumi?',
   'Gas ini tidak berwarna dan tidak berbau, bukan oksigen.', 'D', 10),
  (null, 'Hewan',       'Hewan apa yang bisa hidup paling lama?',
   'Hewan ini bergerak sangat lambat dan punya cangkang keras.', 'B', 10),
  (null, 'Matematika',  'Berapakah 144 ÷ 12?',
   'Ini adalah kebalikan dari 12 × 12.', 'A', 10);

-- Pilihan soal challenge (id 9–14)
insert into public.question_options (question_id, option_key, text) values
  (9,  'A', 'Jupiter'),   (9,  'B', 'Saturnus'),  (9,  'C', 'Mars'),       (9,  'D', 'Uranus');
insert into public.question_options (question_id, option_key, text) values
  (10, 'A', 'Singa'),     (10, 'B', 'Harimau'),   (10, 'C', 'Gajah'),      (10, 'D', 'Serigala');
insert into public.question_options (question_id, option_key, text) values
  (11, 'A', '54'),        (11, 'B', '48'),         (11, 'C', '56'),         (11, 'D', '63');
insert into public.question_options (question_id, option_key, text) values
  (12, 'A', 'Oksigen'),   (12, 'B', 'Karbon dioksida'), (12, 'C', 'Hidrogen'), (12, 'D', 'Nitrogen');
insert into public.question_options (question_id, option_key, text) values
  (13, 'A', 'Gajah'),     (13, 'B', 'Kura-kura Aldabra'), (13, 'C', 'Paus'), (13, 'D', 'Hiu');
insert into public.question_options (question_id, option_key, text) values
  (14, 'A', '12'),        (14, 'B', '11'),         (14, 'C', '13'),         (14, 'D', '14');

-- ─── Unit Contents ───────────────────────────────────────────────────────────
insert into public.unit_contents (unit_id, intro, sections) values
(
  1,
  'Bumi adalah satu-satunya planet yang kita ketahui memiliki kehidupan. Mari kita pelajari lebih dalam tentang planet menakjubkan tempat kita tinggal ini!',
  '[
    {"type":"paragraph","title":"Mengenal Bumi","body":"Bumi adalah planet ketiga dari Matahari dan merupakan planet terbesar kelima di tata surya. Bumi terbentuk sekitar 4,5 miliar tahun yang lalu. Dari luar angkasa, Bumi tampak berwarna biru karena sebagian besar permukaannya ditutupi oleh air laut yang luas."},
    {"type":"info_boxes","boxes":[{"title":"Fakta Menarik","icon":"🌊","body":"71% permukaan Bumi ditutupi air — itulah mengapa planet kita tampak berwarna biru cantik dari luar angkasa!"},{"title":"Ukuran Raksasa","icon":"📏","body":"Diameter Bumi sekitar 12.742 km. Jika berjalan mengelilinginya, kamu butuh menempuh jarak sejauh 40.075 km!"}]},
    {"type":"paragraph","title":"Lapisan-lapisan Bumi","body":"Bumi memiliki empat lapisan utama. Kerak bumi adalah lapisan terluar yang tipis, inilah tempat kita berpijak setiap hari. Di bawahnya ada mantel yang sangat tebal terbuat dari batuan panas. Kemudian ada inti luar berupa besi cair yang sangat panas, dan inti dalam berupa bola padat yang suhunya bisa mencapai 5.400°C!"},
    {"type":"paragraph","title":"Benua dan Samudra","body":"Permukaan Bumi terbagi menjadi 7 benua besar: Asia, Afrika, Amerika Utara, Amerika Selatan, Antartika, Eropa, dan Australia. Samudra Pasifik adalah samudra terbesar yang luasnya hampir separuh permukaan Bumi. Semua daratan ini dulunya menyatu dalam satu benua raksasa bernama Pangaea!"}
  ]'::jsonb
),
(
  2,
  'Matahari adalah bintang di pusat tata surya kita. Tanpa Matahari, tidak akan ada kehidupan di Bumi. Mari kita pelajari bintang terdekat kita ini!',
  '[
    {"type":"paragraph","title":"Mengenal Matahari","body":"Matahari adalah bola gas raksasa yang terutama terdiri dari hidrogen (sekitar 70%) dan helium (sekitar 28%). Matahari merupakan sumber cahaya dan panas yang sangat penting bagi seluruh kehidupan di Bumi. Meskipun terlihat kecil dari Bumi, sebenarnya Matahari sangat-sangat besar!"},
    {"type":"info_boxes","boxes":[{"title":"Fakta Menarik","icon":"☀️","body":"Cahaya dari Matahari butuh waktu sekitar 8 menit untuk sampai ke Bumi, meski jaraknya mencapai 150 juta kilometer!"},{"title":"Ukuran Raksasa","icon":"🔭","body":"Matahari 109 kali lebih lebar dari Bumi. Jika Matahari diisi Bumi, bisa muat sekitar 1,3 juta Bumi di dalamnya!"}]},
    {"type":"paragraph","title":"Lapisan Matahari","body":"Matahari memiliki beberapa lapisan. Bagian inti adalah yang paling panas — di sinilah terjadi reaksi nuklir dahsyat yang menghasilkan energi. Lapisan luar yang kita lihat disebut fotosfer. Saat gerhana matahari total, kita bisa melihat lapisan terluar indah yang disebut korona, tampak seperti mahkota bercahaya."},
    {"type":"paragraph","title":"Pentingnya Matahari","body":"Matahari memberikan energi yang dibutuhkan tumbuhan untuk berfotosintesis dan menghasilkan makanan. Tanpa Matahari, tidak ada tumbuhan, tidak ada hewan, dan tidak ada manusia. Matahari juga mengatur musim, cuaca, dan iklim di seluruh penjuru Bumi kita."}
  ]'::jsonb
);

-- ─── Badges ──────────────────────────────────────────────────────────────────
insert into public.badges (name, description, emoji, condition_type, condition_value) values
  ('Penjelajah Pertama', 'Selesaikan unit pertamamu!',                 '🌟', 'unit_completed',  1),
  ('Kolektor XP',        'Kumpulkan 500 XP total.',                    '⚡', 'xp_milestone',    500),
  ('Bintang Rising',     'Kumpulkan 1.000 XP total.',                  '🏆', 'xp_milestone',    1000),
  ('Master Kuis',        'Jawab 50 pertanyaan kuis dengan benar.',     '🎯', 'quiz_correct_streak', 50),
  ('Modul Selesai',      'Selesaikan seluruh unit dalam satu modul.',  '🚀', 'module_completed', 1),
  ('Explorer Muda',      'Kumpulkan 2.500 XP total.',                  '👑', 'xp_milestone',    2500),
  ('Sahabat Hewan',      'Selesaikan semua unit Dunia Hewan.',         '🐾', 'module_completed', 2),
  ('Ahli Matematika',    'Selesaikan semua unit Matematika Asyik.',    '➕', 'module_completed', 3);