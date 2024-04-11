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

const createWebHistory: <GenericWebHistoryRoutes extends WebHistoryRoute[]>(options: CreateWebHistoryOptions<GenericWebHistoryRoutes>) => {
  webHistoryPush: (options: WebHistoryPushOptions) => void,
  webHistorySearchParameters: Accessor<URLSearchParams>,
  WebHistoryView: Component
}
```

```bash
touch src/web-history.tsx
```

```typescript
import { Suspense, lazy } from "solid-js";
import { createWebHistory, createWebHistoryRoute } from "./library/history";
import { PageLoader } from "./components/loader";
import NotFoundPage from "./pages/not-found";

const HomePage = lazy(() => import("./pages/home"));
const AboutPage = lazy(() => import("./pages/about"));
const UserPage = lazy(() => import("./pages/users/user"));

const { WebHistoryView, webHistoryPush, webHistorySearchParameters } = createWebHistory({
  fallback: NotFoundPage,
  routes: [
    createWebHistoryRoute("/", () => (
      <Suspense fallback={<PageLoader />}>
        <HomePage />
      </Suspense>
    )),
    createWebHistoryRoute("/about", () => (
      <Suspense fallback={<PageLoader />}>
        <AboutPage />
      </Suspense>
    )),
    createWebHistoryRoute("/users/:user", ({ user }) => (
      <Suspense fallback={<PageLoader />}>
        <UserPage user={user} />
      </Suspense>
    ))
  ]
} as const);

export {
  WebHistoryView,
  webHistoryPush,
  webHistorySearchParameters
}
```

### Use the WebHistoryView

```typescript
const WebHistoryView: () => JSX.Element
```

```typescript
import { webHistoryPush, WebHistoryView } from './web-history';

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
import { webHistorySearchParameters } from "../../web-history.tsx";
import { WebHistoryRouteElementProps } from "../../library/history.tsx";

export default function UserPage({ user }: WebHistoryRouteElementProps<"/users/:user">) {
  const searchParameters = webHistorySearchParameters();
  const theme = createMemo(() => searchParameters.get("theme"));

  return (
    <h1>User#{user} page with theme {theme()}</h1>
  );
}
```
