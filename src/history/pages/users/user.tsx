import { Suspense, lazy } from "solid-js";
import { createPage } from "../../../library/history";
import { PageLoader } from "../../../components/loader";

const UserPage = lazy(() => import("../../../pages/users/user"));

export const { goToPage: goToUserPage, page: userPage } = createPage("/users/:user", ({ user }) => (
  <Suspense fallback={< PageLoader />}>
    <UserPage user={user} />
  </Suspense>
))
