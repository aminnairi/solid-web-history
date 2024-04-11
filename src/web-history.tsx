import { Suspense, lazy } from "solid-js";
import { createWebHistory, createWebHistoryRoute } from "./library/history";
import { PageLoader } from "./components/loader";
import NotFoundPage from "./pages/not-found";
import { Route } from "./route";

const HomePage = lazy(() => import("./pages/home"));
const AboutPage = lazy(() => import("./pages/about"));
const UserPage = lazy(() => import("./pages/users/user"));

const { WebHistoryView, webHistoryPush, webHistorySearchParameters } = createWebHistory({
  fallback: NotFoundPage,
  routes: [
    createWebHistoryRoute<Route.Home>({
      path: Route.Home,
      element: () => (
        <Suspense fallback={<PageLoader />}>
          <HomePage />
        </Suspense>
      )
    }),
    createWebHistoryRoute<Route.About>({
      path: Route.About,
      element: () => (
        <Suspense fallback={<PageLoader />}>
          <AboutPage />
        </Suspense>
      )
    }),
    createWebHistoryRoute<Route.User>({
      path: Route.User,
      element: ({ user }) => (
        <Suspense fallback={<PageLoader />}>
          <UserPage user={user} />
        </Suspense>
      )
    } as const)
  ]
} as const);

export {
  WebHistoryView,
  webHistoryPush,
  webHistorySearchParameters
}
