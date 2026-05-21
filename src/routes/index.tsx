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
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
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
