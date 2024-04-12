# solid-web-history

Web API History implementation in Solid

## Features

- Written in TypeScript for maximum safety
- Type safety when pushing a new route so that you don't push a removed or unknown route
- Type safety when defining a page so that you don't use an unknown route parameter
- Simple and expressive API 

## Requirements

- Node
- NPM

## Installation

Coming soon...

## Usage

### Create a page definition

```bash
mkdir --parent src/history/pages/users
touch src/history/users/user.tsx
```

```typescript
import { Suspense, lazy } from "solid-js";
import { createWebHistoryRoute } from "../../../library/history";
import { PageLoader } from "../../../components/loader";

const UserPage = lazy(() => import("../../../pages/users/user"));

export const { goToPage: goToUserPage, page: userPage } = createWebHistoryRoute("/users/:user", ({ user }) => (
  <Suspense fallback={< PageLoader />}>
    <UserPage user={user} />
  </Suspense>
))
```

### Create a page view

```bash
mkdir --parent src/pages/users
touch src/pages/users/user.tsx
```

```typescript
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
```

### Create a web history

```bash
touch src/history/index.ts
```

```typescript
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
```

### Use the WebHistoryView

```typescript
import { WebHistoryView } from "./history";
import { goToAboutPage } from "./history/pages/about";
import { goToHomePage } from "./history/pages/home";
import { goToUserPage } from "./history/pages/users/user";

export function App() {
  return (
    <>
      <ul>
        <li onClick={() => goToHomePage({})}>
          <button>
            Home
          </button>
        </li>
        <li onClick={() => goToAboutPage({})}>
          <button>
            About
          </button>
        </li>
        <li onClick={() => goToUserPage({ user: "123" })}>
          <button>
            User#123
          </button>
        </li>
      </ul>
      <WebHistoryView />
    </>
  );
}
```

### Use the search parameters

```typescript
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
```
