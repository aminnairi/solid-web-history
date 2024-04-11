import { createMemo } from "solid-js";
import { webHistorySearchParameters } from "../../web-history.tsx";
import { WebHistoryRouteElementProps } from "../../library/history.tsx";
import { Route } from "../../route.ts";

export default function UserPage({ user }: WebHistoryRouteElementProps<Route.User>) {
  const searchParameters = webHistorySearchParameters();
  const theme = createMemo(() => searchParameters.get("theme"));

  return (
    <h1>User#{user} page with theme {theme()}</h1>
  );
}
