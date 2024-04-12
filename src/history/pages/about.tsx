import { Suspense, lazy } from "solid-js";
import { PageLoader } from "../../components/loader";
import { createPage } from "../../library/history";

const AboutPage = lazy(() => import("../../pages/about"));

export const { goToPage: goToAboutPage, page: aboutPage } = createPage("/about", () => (
  <Suspense fallback={< PageLoader />} >
    <AboutPage />
  </Suspense>
));
