import { Suspense, lazy } from "solid-js";
import { PageLoader } from "../../components/loader";
import { createWebHistoryRoute } from "../../library/history";

const AboutPage = lazy(() => import("../../pages/about"));

export const { goToPage: goToAboutPage, page: aboutPage } = createWebHistoryRoute("/about", () => (
  <Suspense fallback={< PageLoader />} >
    <AboutPage />
  </Suspense>
));
