import { Suspense, lazy } from "solid-js";
import { createWebHistory } from "./library/history";
import { PageLoader } from "./components/loader";
import NotFoundPage from "./pages/not-found";

const HomePage = lazy(() => import("./pages/home"));
const AboutPage = lazy(() => import("./pages/about"));
const UserPage = lazy(() => import("./pages/users/user"));

const { WebHistoryView, webHistoryPush } = createWebHistory({
  fallback: () => <NotFoundPage />,
  routes: [
    {
      path: "/",
      element: () => (
        <Suspense fallback={<PageLoader />}>
          <HomePage />
        </Suspense>
      )
    },
    {
      path: "/about",
      element: () => (
        <Suspense fallback={<PageLoader />}>
          <AboutPage />
        </Suspense>
      )
    },
    {
      path: "/users/:user",
      element: () => (
        <Suspense fallback={<PageLoader />}>
          <UserPage />
        </Suspense>
      )
    }
  ]
} as const);

export {
  WebHistoryView,
  webHistoryPush
}
