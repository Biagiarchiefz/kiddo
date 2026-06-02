import Home from "@/components/views/Home/Home";
import { createBrowserRouter, Outlet, useLocation } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import { dashboardRoutes } from "@/features/dashboard/dashboard.routes";
import { authRoutes } from "@/features/auth/auth.routes";
import { leaderboardRoutes } from "@/features/leaderboard/leaderboard.routes";
import { challengesRoutes } from "@/features/challenges/challenges.routes";
import { materiRoutes } from "@/features/materi/materi.routes";
import { badgesRoutes } from "@/features/badges/badges.routes";
import { adminRoutes } from "@/features/admin/admin.routes";
import AuthGuard from "@/components/common/AuthGuard";
import AdminGuard from "@/components/common/AdminGuard";
import GuestGuard from "@/components/common/GuestGuard";

const AnimatedOutlet = () => {
  const location = useLocation();

  return (
    <>
      {/* Progress bar sweep */}
      <AnimatePresence>
        <motion.div
          key={`bar-${location.pathname}`}
          className="fixed top-0 left-0 h-0.75 z-100 origin-left"
          style={{ background: "linear-gradient(90deg, #38bdf8, #0ea5e9, #7dd3fc)" }}
          initial={{ scaleX: 0, opacity: 1 }}
          animate={{ scaleX: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        />
      </AnimatePresence>

      {/* Page content transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export const router = createBrowserRouter([
  {
    element: <AnimatedOutlet />,
    children: [
      // Public pages — redirect to /dashboard if already logged in
      {
        element: <GuestGuard />,
        children: [
          { path: "/", element: <Home /> },
          ...authRoutes,
        ],
      },
      // Protected pages — redirect to / if not authenticated
      {
        element: <AuthGuard />,
        children: [
          ...dashboardRoutes,
          ...leaderboardRoutes,
          ...challengesRoutes,
          ...materiRoutes,
          ...badgesRoutes,
        ],
      },
      // Admin pages — redirect to /dashboard if not admin
      {
        element: <AdminGuard />,
        children: [...adminRoutes],
      },
    ],
  },
]);
