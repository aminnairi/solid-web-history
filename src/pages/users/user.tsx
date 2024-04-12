import { createMemo } from "solid-js";
import { InferPageProps } from "../../library/history";
import { webHistorySearchParameters } from "../../history";
import { userPage } from "../../history/pages/users/user";

export default function UserPage({ user }: InferPageProps<typeof userPage>) {
  const theme = createMemo(() => webHistorySearchParameters().get("theme"));

  return (
    <h1>User#{user} page with theme {theme()}</h1>
  );
}
