import { createMemo } from "solid-js";
import { webHistorySearchParameters } from "../../web-history.tsx";

export default function UserPage() {
  const searchParameters = webHistorySearchParameters();
  const theme = createMemo(() => searchParameters.get("theme"));

  return (
    <h1>User page with theme {theme()}</h1>
  );
}
