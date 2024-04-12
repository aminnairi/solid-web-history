import { createWebHistory } from "../library/history";
import NotFoundPage from "../pages/not-found";
import { homePage } from "./pages/home";
import { aboutPage } from "./pages/about";
import { userPage } from "./pages/users/user";

export const { WebHistoryView, webHistorySearchParameters } = createWebHistory({
  fallback: NotFoundPage,
  pages: [
    homePage,
    aboutPage,
    userPage
  ]
});
