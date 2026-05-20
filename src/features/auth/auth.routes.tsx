import Register from "@/components/views/Register/Register"
import Login from "@/components/views/Login/Login"

export const authRoutes = [
  {
    path: "daftar",
    element: <Register />,
  },
  {
    path: "login",
    element: <Login />,
  },
]
