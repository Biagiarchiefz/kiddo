import { useState } from "react";
import {
  User,
  School,
  Mail,
  KeyRound,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRegister } from "./useRegister";
import heroSection from "@/assets/images/heroSection.webp";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.706 17.64 9.2z"
    />
    <path
      fill="#34A853"
      d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
    />
    <path
      fill="#FBBC05"
      d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
    />
    <path
      fill="#EA4335"
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
    />
  </svg>
);

const Register = () => {
  const {
    form,
    error,
    loading,
    handleChange,
    handleSubmit,
    handleGoogleLogin,
  } = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Left Panel – Form */}
      <div className="flex flex-col w-full lg:max-w-[460px] bg-white px-10 py-10">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="leading-none">
            <h1 className="text-4xl font-bold text-sky-500">kiddo</h1>
            <p className="text-xs font-semibold text-slate-500">
              Belajar dengan seru setiap hari
            </p>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex flex-col justify-center py-10 space-y-6 max-w-[340px] mx-auto w-full">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Buat Akun</h1>
            <p className="text-muted-foreground text-sm mt-1.5">
              Daftar dan mulai petualangan belajarmu bersama Kiddo
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username">Nama Pengguna</Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Masukkan Nama Pengguna"
                  value={form.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  className="pl-10 h-12 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="school">Nama Sekolah</Label>
              <div className="relative">
                <School className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="school"
                  type="text"
                  placeholder="Masukkan Nama Sekolah"
                  value={form.school}
                  onChange={(e) => handleChange("school", e.target.value)}
                  className="pl-10 h-12 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Masukkan Email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="pl-10 h-12 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan Password"
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className="pl-10 pr-10 h-12 rounded-lg"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-lg text-base font-semibold bg-sky-500 hover:bg-sky-600 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Memproses...
                </>
              ) : (
                "Daftar"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex-1 h-px bg-border" />
            <span>atau</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Google OAuth */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-border rounded-lg h-12 text-sm font-semibold text-foreground hover:bg-muted/40 transition-colors disabled:opacity-50"
          >
            <GoogleIcon />
            Daftar dengan Google
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="text-primary font-semibold hover:underline"
            >
              Masuk di sini
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          © 2026 Kiddo Learning Adventure. Hak cipta dilindungi.
        </p>
      </div>

      {/* Right Panel – Hero Image */}
      <div className="flex-1 relative hidden lg:flex flex-col">
        <img
          src={heroSection}
          alt=""
          className="absolute inset-0 w-full h-full object-cover rounded-l-3xl"
        />
        <div className="absolute inset-0 bg-black/55 rounded-l-3xl" />

        {/* Text content */}
        <div className="relative flex flex-col h-full p-12 text-white">
          <div className="mt-4">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/60">
              Platform Pembelajaran Digital
            </p>
            <h2 className="text-4xl font-bold mt-4 leading-snug max-w-xs">
              Belajar yang menyenangkan untuk generasi masa depan
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
