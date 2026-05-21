import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router";
import AppLayout from "@/components/layouts/AppLayout/AppLayout";
import { useChallenge } from "./useChallenge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Lightbulb,
  ChevronRight,
  Zap,
  Trophy,
  RotateCcw,
  Home,
  CheckCircle2,
  XCircle,
  Sparkles,
  Flame,
  Inbox,
  Cat,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ── Topic colors ──────────────────────────────────────────────────────────────

const topicColors = [
  "bg-blue-400",
  "bg-rose-400",
  "bg-amber-400",
  "bg-emerald-400",
  "bg-purple-400",
];

// ── Loading Skeleton ──────────────────────────────────────────────────────────

const ChallengeSkeleton = () => (
  <AppLayout>
    <div className="flex gap-6 items-start">
      <div className="flex-1 space-y-4">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-52 w-full rounded-2xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
      <div className="w-52 shrink-0 space-y-3">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-36 w-full rounded-2xl" />
      </div>
    </div>
  </AppLayout>
);

// ── Result Screen ─────────────────────────────────────────────────────────────

const ChallengeResult = ({
  correctCount,
  totalQuestions,
  totalXpEarned,
  retry,
}: {
  correctCount: number;
  totalQuestions: number;
  totalXpEarned: number;
  retry: () => void;
}) => {
  const pct =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const headline =
    pct >= 80 ? "Luar Biasa!" : pct >= 60 ? "Bagus!" : "Terus Semangat!";

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" as const }}
        className="max-w-xl mx-auto space-y-4 py-6"
      >
        <Card className="shadow-sm overflow-hidden">
          <div className="bg-linear-to-r from-blue-500 to-sky-400 p-6 text-center text-white">
            <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold">{headline}</h2>
            <p className="text-white/75 text-sm mt-1">
              Kamu menjawab{" "}
              <span className="font-bold text-white">{correctCount}</span> dari{" "}
              <span className="font-bold text-white">{totalQuestions}</span>{" "}
              soal dengan benar
            </p>
          </div>

          <CardContent className="p-5 space-y-4">
            {/* Score bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Skor</span>
                <span className="font-bold text-foreground">{pct}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={cn(
                    "h-full rounded-full",
                    pct >= 60 ? "bg-green-500" : "bg-amber-400",
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{
                    duration: 0.7,
                    ease: "easeOut" as const,
                    delay: 0.2,
                  }}
                />
              </div>
            </div>

            {/* XP earned */}
            <div className="flex items-center justify-center gap-2 bg-amber-50 border border-amber-100 rounded-xl p-4">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-400" />
              <div>
                <p className="text-xs text-amber-700 font-semibold">
                  XP Tantangan Diperoleh
                </p>
                <p className="text-2xl font-black text-amber-600">
                  +{totalXpEarned} XP
                </p>
              </div>
            </div>

            {/* Total badge */}
            <div className="flex items-center justify-center gap-2 bg-primary/5 border border-primary/10 rounded-xl p-3">
              <Trophy className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary">
                Tantangan Campuran Selesai!
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2 rounded-xl"
                onClick={retry}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Ulangi
              </Button>
              <Button asChild size="sm" className="flex-1 gap-2 rounded-xl">
                <Link to="/dashboard">
                  <Home className="w-3.5 h-3.5" />
                  Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AppLayout>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

const Challenge = () => {
  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    selectedAnswer,
    showHint,
    phase,
    isLoading,
    isSubmitting,
    correctCount,
    totalXpEarned,
    topicBreakdown,
    selectAnswer,
    toggleHint,
    submitAndNext,
    retry,
  } = useChallenge();

  const [uiPhase, setUiPhase] = useState<"intro" | "countdown" | "playing">("intro");
  const [countdownNum, setCountdownNum] = useState(3);

  useEffect(() => {
    if (uiPhase !== "countdown") return;
    if (countdownNum > 0) {
      const t = setTimeout(() => setCountdownNum((n) => n - 1), 1000);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setUiPhase("playing"), 900);
    return () => clearTimeout(t);
  }, [uiPhase, countdownNum]);

  const handleRetry = () => {
    setUiPhase("intro");
    setCountdownNum(3);
    retry();
  };

  if (isLoading) return <ChallengeSkeleton />;

  if (phase === "result") {
    return (
      <ChallengeResult
        correctCount={correctCount}
        totalQuestions={totalQuestions}
        totalXpEarned={totalXpEarned}
        retry={handleRetry}
      />
    );
  }

  if (totalQuestions === 0) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <span className="text-5xl">📭</span>
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <Inbox className="h-7 w-7 text-muted-foreground" />
          </span>
          <p className="text-sm font-black text-sky-700">
            <span className="inline-flex items-center gap-1">
              <Flame className="h-4 w-4" />
              {currentIndex}
            </span>
          </p>
          <p className="font-bold text-foreground">Belum ada soal tersedia.</p>
          <Button asChild variant="link" size="sm">
            <Link to="/dashboard">Kembali ke Dashboard</Link>
          </Button>
        </div>
      </AppLayout>
    );
  }

  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <AppLayout>
      <div className="relative">
        {/* Blur overlay */}
        <AnimatePresence>
          {uiPhase !== "playing" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl"
            >
              {uiPhase === "intro" ? (
                <motion.button
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setUiPhase("countdown")}
                  className="flex flex-col items-center gap-1 px-10 py-7 cursor-pointer"
                >
             
                  <p className="text-lg font-black text-sky-500">Tekan untuk memulai tantangan</p>
                  <p className="text-xs text-gray-500">Pastikan kamu sudah siap!</p>
                </motion.button>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={countdownNum}
                    initial={{ scale: 1.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.4, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="flex items-center justify-center"
                  >
                    {countdownNum === 0 ? (
                      <span className="text-7xl font-black text-yellow-500 drop-shadow-lg">Mulai!</span>
                    ) : (
                      <span className="text-9xl font-black text-sky-500 drop-shadow-lg">{countdownNum}</span>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Challenge content — blurred until playing */}
        <div className={uiPhase !== "playing" ? "blur-sm pointer-events-none select-none" : ""}>
        <div className="relative overflow-hidden rounded-3xl border border-sky-100 bg-linear-to-br from-sky-50 via-white to-amber-50 p-4 md:p-6">
        <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-12 h-44 w-44 rounded-full bg-sky-200/50 blur-3xl" />

        <div className="flex gap-6 items-start relative">
          {/* ── Main area ── */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" as const }}
              className="flex flex-wrap items-center justify-between gap-2"
            >
              <div>
                <h2 className="text-xl font-black text-foreground">
                  Tantangan Campuran
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Uji pengetahuanmu dari semua materi!
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wide text-sky-600 bg-sky-100/70 px-2 py-1 rounded-full">
                  Mode Ceria
                </span>
                <span className="text-xs text-muted-foreground font-semibold">
                  Soal {currentIndex + 1} / {totalQuestions}
                </span>
              </div>
            </motion.div>

            {/* Progress bar */}
            <div className="h-2 bg-muted/70 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-linear-to-r from-sky-500 via-blue-500 to-emerald-400 rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" as const }}
              />
            </div>

            {/* Question card */}
            <AnimatePresence mode="wait">
              {currentQuestion && (
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.25, ease: "easeOut" as const }}
                >
                  <Card className="shadow-sm border-sky-100">
                    <CardContent className="p-5 space-y-4">
                      {/* Badges */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          <Trophy className="h-3.5 w-3.5" />
                          {currentQuestion.category || 'Umum'}
                        </span>
                        <span className={cn(
                          "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border",
                          currentQuestion.question_type === 'pilihan_ganda' && "bg-sky-50 border-sky-100 text-sky-600",
                          currentQuestion.question_type === 'benar_salah' && "bg-green-50 border-green-100 text-green-600",
                          currentQuestion.question_type === 'isian_singkat' && "bg-purple-50 border-purple-100 text-purple-600",
                        )}>
                          {currentQuestion.question_type === 'pilihan_ganda' ? '📝 Pilihan Ganda'
                            : currentQuestion.question_type === 'benar_salah' ? '✓✗ Benar/Salah'
                            : '✏️ Isian Singkat'}
                        </span>
                      </div>

                      {/* Question text */}
                      <p className="text-base font-semibold text-foreground leading-relaxed">
                        {currentQuestion.question}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-1 rounded-full">
                          <Trophy className="w-3 h-3" />
                          Hadiah kecil setelah ini
                        </span>
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-100 px-2 py-1 rounded-full">
                          <Zap className="w-3 h-3" />
                          {currentQuestion?.xp_reward ?? 10} XP per soal
                        </span>
                      </div>

                      {/* Hint toggle */}
                      {currentQuestion.hint && (
                        <>
                          <Button
                            variant={showHint ? "outline" : "ghost"}
                            size="sm"
                            onClick={toggleHint}
                            className={cn(
                              "gap-2 h-8 text-xs",
                              showHint
                                ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:text-amber-700"
                                : "text-muted-foreground hover:text-foreground",
                            )}
                          >
                            <Lightbulb
                              className={cn(
                                "w-3.5 h-3.5 fill-amber-400 text-amber-400",
                                showHint && "fill-amber-400 text-amber-400",
                              )}
                            />
                            {showHint ? "Sembunyikan hint" : "Lihat Hint"}
                          </Button>

                          <AnimatePresence>
                            {showHint && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-800 leading-relaxed">
                                  {currentQuestion.hint}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      )}

                      {/* Answer options — per question type */}
                      {currentQuestion.question_type === "pilihan_ganda" && (
                        <div className="grid grid-cols-2 gap-2.5">
                          {currentQuestion.question_options.map((opt) => {
                            const isSelected = selectedAnswer === opt.option_key;
                            return (
                              <motion.button
                                key={opt.option_key}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => selectAnswer(opt.option_key)}
                                className={cn(
                                  "flex items-center gap-3 p-3.5 rounded-2xl border-2 text-left text-sm font-medium transition-all duration-150 bg-white/90",
                                  isSelected
                                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                                    : "border-border hover:border-primary/40 hover:bg-sky-50 text-foreground",
                                )}
                              >
                                <span className={cn(
                                  "w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors",
                                  isSelected ? "bg-primary text-white" : "bg-muted text-muted-foreground",
                                )}>
                                  {opt.option_key}
                                </span>
                                {opt.text}
                              </motion.button>
                            );
                          })}
                        </div>
                      )}

                      {currentQuestion.question_type === "benar_salah" && (
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { key: "benar", label: "Benar", icon: "✓", active: "border-green-500 bg-green-50 text-green-700" },
                            { key: "salah", label: "Salah", icon: "✗", active: "border-red-400 bg-red-50 text-red-600" },
                          ].map((opt) => {
                            const isSelected = selectedAnswer === opt.key;
                            return (
                              <motion.button
                                key={opt.key}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => selectAnswer(opt.key)}
                                className={cn(
                                  "flex flex-col items-center justify-center gap-1.5 p-5 rounded-2xl border-2 text-sm font-bold transition-all duration-150",
                                  isSelected ? opt.active : "border-border hover:border-muted-foreground/40 text-foreground",
                                )}
                              >
                                <span className="text-2xl">{opt.icon}</span>
                                {opt.label}
                              </motion.button>
                            );
                          })}
                        </div>
                      )}

                      {currentQuestion.question_type === "isian_singkat" && (
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">Ketik jawabanmu:</p>
                          <Input
                            value={selectedAnswer ?? ""}
                            onChange={(e) => selectAnswer(e.target.value)}
                            placeholder="Tulis jawaban di sini..."
                            className="h-12 rounded-xl text-base"
                            onKeyDown={(e) => e.key === "Enter" && selectedAnswer && submitAndNext()}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next button */}
            <Button
              className="w-full rounded-[10px] gap-2 text-base font-bold py-5"
              onClick={submitAndNext}
              disabled={!selectedAnswer || isSubmitting}
            >
              {isSubmitting
                ? "Menyimpan..."
                : currentIndex === totalQuestions - 1
                  ? "Selesai"
                  : "Lanjut"}
              {!isSubmitting && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>

          {/* ── Sidebar ── */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.15,
              duration: 0.35,
              ease: "easeOut" as const,
            }}
            className="w-52 shrink-0 space-y-3 sticky top-20"
          >
            <Card className="bg-linear-to-br from-sky-50 to-white border-sky-100 shadow-sm">
              <CardContent className="p-4 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-sky-700">
                  Teman Belajar
                </p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                    <Cat className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      Kucing Pintar
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Ayo jawab yang terbaik!
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Seru & aman
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 px-2 py-1">
                    <Lightbulb className="w-3 h-3" />
                    Hint siap
                  </span>
                </div>
              </CardContent>
            </Card>
            {/* XP reward */}
            <Card className="bg-linear-to-br from-amber-50 to-yellow-50 border-amber-100 shadow-sm">
              <CardContent className="p-4 text-center space-y-1.5">
                <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">
                  Extra XP
                </p>
                <div className="flex items-center justify-center gap-1">
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-2xl font-black text-amber-600">
                    +{currentQuestion?.xp_reward ?? 10}/soal
                  </span>
                </div>
                <p className="text-[10px] text-amber-700/70 leading-relaxed">
                  Jawab benar untuk kumpulkan XP!
                </p>
              </CardContent>
            </Card>

            {/* Progress tracker */}
            <Card className="shadow-sm">
              <CardContent className="p-4 space-y-2.5">
                <p className="text-[10px] font-bold text-foreground uppercase tracking-wide">
                  Progres Soal
                </p>
                <div className="grid grid-cols-5 gap-1.5">
                  {Array.from({ length: totalQuestions }).map((_, i) => {
                    const isDone = i < currentIndex;
                    const isCurrent = i === currentIndex;
                    return (
                      <div
                        key={i}
                        className={cn(
                          "h-6 w-6 rounded-md flex items-center justify-center text-[10px] font-bold transition-colors",
                          isDone
                            ? "bg-green-100 text-green-700"
                            : isCurrent
                              ? "bg-primary text-white"
                              : "bg-muted text-muted-foreground",
                        )}
                      >
                        {isDone ? "✓" : i + 1}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex items-center gap-1.5 text-xs text-green-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="font-semibold">
                      {currentIndex} selesai
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{totalQuestions - currentIndex} tersisa</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Topic breakdown */}
            {topicBreakdown.length > 0 && (
              <Card className="shadow-sm">
                <CardContent className="p-4 space-y-2.5">
                  <p className="text-[10px] font-bold text-foreground uppercase tracking-wide">
                    Topik Sesi Ini
                  </p>
                  {topicBreakdown.map((t, i) => (
                    <div key={t.topic} className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full shrink-0",
                          topicColors[i % topicColors.length],
                        )}
                      />
                      <span className="text-xs text-muted-foreground flex-1 truncate">
                        {t.topic}
                      </span>
                      <span className="text-[10px] font-semibold bg-muted text-foreground px-1.5 py-0.5 rounded-full">
                        {t.count}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
        </div>{/* end blur wrapper */}
      </div>{/* end outer relative */}
    </AppLayout>
  );
};

export default Challenge;
