export interface RankEntry {
  rank: number
  name: string
  school: string
  xp: number
  isCurrentUser: boolean
  avatarBg: string
  avatarText: string
}

const rankings: RankEntry[] = [
  { rank: 1, name: 'Siti Aminah', school: 'SDN Cendekia Utama', xp: 4300, isCurrentUser: false, avatarBg: 'bg-secondary', avatarText: 'text-white' },
  { rank: 2, name: 'Budi', school: 'SDN Merdeka 1', xp: 3450, isCurrentUser: false, avatarBg: 'bg-slate-300', avatarText: 'text-slate-700' },
  { rank: 3, name: 'Arief', school: 'MI Al-Falah', xp: 3100, isCurrentUser: false, avatarBg: 'bg-amber-300', avatarText: 'text-amber-800' },
  { rank: 4, name: 'Putri Indah', school: 'SDN Pelita Hati 1', xp: 2850, isCurrentUser: false, avatarBg: 'bg-orange-300', avatarText: 'text-orange-800' },
  { rank: 5, name: 'Kevin Pratama', school: 'Sekolah Cita Buana', xp: 2700, isCurrentUser: false, avatarBg: 'bg-amber-400', avatarText: 'text-amber-900' },
  { rank: 6, name: 'Dewi Lestari', school: 'SD Tunas Bangsa', xp: 2500, isCurrentUser: false, avatarBg: 'bg-primary', avatarText: 'text-white' },
  { rank: 42, name: 'You', school: 'SDN Harapan Kita', xp: 1250, isCurrentUser: true, avatarBg: 'bg-primary/20', avatarText: 'text-primary' },
]

export const useLeaderboard = () => {
  return { rankings }
}