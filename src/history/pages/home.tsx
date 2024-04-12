import { lazy, Suspense } from "solid-js"
import { PageLoader } from "../../components/loader"
import { createWebHistoryRoute } from "../../library/history"

const HomePage = lazy(() => import("../../pages/home"));

export const { goToPage: goToHomePage, page: homePage } = createWebHistoryRoute("/", () => (
  <Suspense fallback= {< PageLoader />}>
    <HomePage />
  </Suspense>
))
