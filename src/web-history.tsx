import { Suspense, lazy } from "solid-js";
import { createWebHistory, createWebHistoryRoute } from "./library/history";
import { PageLoader } from "./components/loader";
import NotFoundPage from "./pages/not-found";

const HomePage = lazy(() => import("./pages/home"));
const AboutPage = lazy(() => import("./pages/about"));
const UserPage = lazy(() => import("./pages/users/user"));

const { WebHistoryView, webHistoryPush, webHistorySearchParameters } = createWebHistory({
  fallback: NotFoundPage,
  routes: [
    createWebHistoryRoute("/", () => (
      <Suspense fallback={<PageLoader />}>
        <HomePage />
      </Suspense>
    )),
    createWebHistoryRoute("/about", () => (
      <Suspense fallback={<PageLoader />}>
        <AboutPage />
      </Suspense>
    )),
    createWebHistoryRoute("/users/:user", ({ user }) => (
      <Suspense fallback={<PageLoader />}>
        <UserPage user={user} />
      </Suspense>
    ))
  ]
} as const);

export {
  WebHistoryView,
  webHistoryPush,
  webHistorySearchParameters
}
