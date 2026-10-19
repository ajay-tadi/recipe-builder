import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Layout from "./components/Layout";
import RecipeListPage from "./pages/RecipeListPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import RecipeCreatePage from "./pages/RecipeCreatePage";
import RecipeEditPage from "./pages/RecipeEditPage";
import NotFoundPage from "./pages/NotFoundPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/recipes" replace /> },
      { path: "recipes", element: <RecipeListPage /> },
      { path: "recipes/new", element: <RecipeCreatePage /> },
      { path: "recipes/:id", element: <RecipeDetailPage /> },
      { path: "recipes/:id/edit", element: <RecipeEditPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
export default function AppRouter() {
  return <RouterProvider router={router} />;
}
