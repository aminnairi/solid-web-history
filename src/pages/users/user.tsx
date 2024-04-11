import { createMemo } from "solid-js";
import { webHistorySearchParameters } from "../../web-history.tsx";
import { WebHistoryRouteElementProps } from "../../library/history.tsx";

export default function UserPage({ user }: WebHistoryRouteElementProps<"/users/:user">) {
  const theme = createMemo(() => webHistorySearchParameters().get("theme"));

  return (
    <h1>User#{user} page with theme {theme()}</h1>
  );
}
