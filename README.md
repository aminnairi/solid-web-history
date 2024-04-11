# solid-web-history

Web API History implementation in Solid

## Requirements

- Node
- NPM

## Installation

Coming soon...

## Usage

### Create a web history

```bash
touch src/web-history.tsx
```

```typescript
import { Suspense, lazy } from "solid-js";
import { createWebHistory } from "./library/history";
import { PageLoader } from "./components/loader";
import NotFoundPage from "./pages/not-found";

const HomePage = lazy(() => import("./pages/home"));
const AboutPage = lazy(() => import("./pages/about"));
const UserPage = lazy(() => import("./pages/users/user"));

const { WebHistoryView, webHistoryPush } = createWebHistory({
  fallback: () => <NotFoundPage />,
  routes: [
    {
      path: "/",
      element: () => (
        <Suspense fallback={<PageLoader />}>
          <HomePage />
        </Suspense>
      )
    },
    {
      path: "/about",
      element: () => (
        <Suspense fallback={<PageLoader />}>
          <AboutPage />
        </Suspense>
      )
    },
    {
      path: "/users/:user",
      element: () => (
        <Suspense fallback={<PageLoader />}>
          <UserPage />
        </Suspense>
      )
    }
  ]
} as const);

export {
  WebHistoryView,
  webHistoryPush
}
```

### Use the WebHistoryView

```typescript
import { webHistoryPush, WebHistoryView } from "./web-history";

export function App() {
  return (
    <>
      <ul>
        <li onClick={() => webHistoryPush({ route: "/" })}>
          <button>
            Home
          </button>
        </li>
        <li onClick={() => webHistoryPush({ route: "/about" })}>
          <button>
            About
          </button>
        </li>
        <li onClick={() => webHistoryPush({ route: "/users/:user", parameters: { user: "123" } })}>
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
