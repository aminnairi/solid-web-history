import { lazy, Suspense } from "solid-js"
import { PageLoader } from "../../components/loader"
import { createPage } from "../../library/history"

const HomePage = lazy(() => import("../../pages/home"));

export const { goToPage: goToHomePage, page: homePage } = createPage("/", () => (
  <Suspense fallback= {< PageLoader />}>
    <HomePage />
  </Suspense>
))
