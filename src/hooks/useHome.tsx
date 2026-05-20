const categories = [
  { id: 1, title: 'Sains & Alam', modules: 12, emoji: '🔬', color: 'bg-yellow-50 border-yellow-200' },
  { id: 2, title: 'Bahasa & Cerita', modules: 8, emoji: '📚', color: 'bg-blue-50 border-blue-200' },
  { id: 3, title: 'Logika & Angka', modules: 15, emoji: '🔢', color: 'bg-green-50 border-green-200' },
]

const adventureModules = [
  {
    id: 1,
    title: 'Pertemanan dan Kerja Sama',
    category: 'Sosial',
    duration: '10-15 Menit',
    lessons: 3,
    rating: 4.9,
    badge: 'BARU',
    label: null,
  },
  {
    id: 2,
    title: 'Mengenal Emosi Bersama',
    category: 'Psikologi Interaktif',
    duration: null,
    lessons: 5,
    rating: null,
    badge: null,
    label: 'KELUARGA',
  },
  {
    id: 3,
    title: 'Menyelesaikan Masalah',
    category: 'Logika Praktek',
    duration: null,
    lessons: 2,
    rating: 4.8,
    badge: null,
    label: null,
  },
]

export const useHome = () => {
  return { categories, adventureModules }
}
