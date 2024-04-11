# solid-web-history

Web API History implementation in Solid

## Features

- Written in TypeScript for maximum safety
- Type safety when pushing a new route so that you don't push a removed or unknown route
- Simple and expressive API 

## Requirements

- Node
- NPM

## Installation

Coming soon...

## Usage

### Create a web history

```typescript
import { Component } from "solid-js";

interface WebHistoryRoute {
  path: string,
  element: Component
}

interface CreateWebHistoryOptions<GenericWebHistoryRoutes extends Array<WebHistoryRoute>> {
  routes: GenericWebHistoryRoutes,
  fallback: Component
}

export interface WebHistoryPushOptions<GenericWebHistoryRoutes extends Array<WebHistoryRoute>> {
  route: GenericWebHistoryRoutes[number]["path"],
  replace?: boolean,
  parameters?: Record<string, string>,
  searchParameters?: URLSearchParams
}

const createWebHistory: <GenericWebHistoryRoutes extends WebHistoryRoute[]>({
  routes,
  fallback
}: CreateWebHistoryOptions<GenericWebHistoryRoutes>) => {
  webHistoryPush: ({
    route,
    parameters,
    searchParameters,
    replace
  }: WebHistoryPushOptions<GenericWebHistoryRoutes>) => void,
  webHistorySearchParameters: Accessor<URLSearchParams>,
  WebHistoryView: Component
}
```

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
const WebHistoryView: () => JSX.Element
```

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

### Use the search parameters

```typescript
const webHistorySearchParameters: Accessor<URLSearchParams>
```

```typescript
import { createMemo } from "solid-js";
import { webHistorySearchParameters } from "../../web-history";

export default function UserPage() {
  const theme = createMemo(() => webHistorySearchParameters().get("theme"));

  return (
    <h1>User page with theme {theme()}</h1>
  );
}
```
