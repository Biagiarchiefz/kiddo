import Materi from "@/components/views/Materi/Materi"
import UnitDetail from "@/components/views/UnitDetail/UnitDetail"
import QuizKilat from "@/components/views/QuizKilat/QuizKilat"

export const materiRoutes = [
  {
    path: "materi/:id",
    element: <Materi />,
  },
  {
    path: "materi/:id/unit/:unitId",
    element: <UnitDetail />,
  },
  {
    path: "materi/:id/unit/:unitId/kuis",
    element: <QuizKilat />,
  },
]
