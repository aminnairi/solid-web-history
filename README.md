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
touch src/route.ts
```

```typescript
export enum Route {
  Home = "/",
  About = "/about",
  User = "/users/:user"
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
import { Route } from "./route";

const HomePage = lazy(() => import("./pages/home"));
const AboutPage = lazy(() => import("./pages/about"));
const UserPage = lazy(() => import("./pages/users/user"));

const { WebHistoryView, webHistoryPush, webHistorySearchParameters } = createWebHistory({
  fallback: NotFoundPage,
  routes: [
    createWebHistoryRoute<Route.Home>({
      path: Route.Home,
      element: () => (
        <Suspense fallback={<PageLoader />}>
          <HomePage />
        </Suspense>
      )
    }),
    createWebHistoryRoute<Route.About>({
      path: Route.About,
      element: () => (
        <Suspense fallback={<PageLoader />}>
          <AboutPage />
        </Suspense>
      )
    }),
    createWebHistoryRoute<Route.User>({
      path: Route.User,
      element: ({ user }) => (
        <Suspense fallback={<PageLoader />}>
          <UserPage user={user} />
        </Suspense>
      )
    } as const)
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
import { Route } from './route';
import { webHistoryPush, WebHistoryView } from './web-history';

export function App() {
  return (
    <>
      <ul>
        <li onClick={() => webHistoryPush({ route: Route.Home })}>
          <button>
            Home
          </button>
        </li>
        <li onClick={() => webHistoryPush({ route: Route.About })}>
          <button>
            About
          </button>
        </li>
        {/* This will never compile as this route is not defined */}
        <li onClick={() => webHistoryPush({ route: "/terms-and-conditions" })}>
          <button>
            Terms & Conditions
          </button>
        </li>
        <li onClick={() => webHistoryPush({ route: Route.User, parameters: { user: "123" } })}>
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
import { Route } from "../../route.ts";

export default function UserPage({ user }: WebHistoryRouteElementProps<Route.User>) {
  const searchParameters = webHistorySearchParameters();
  const theme = createMemo(() => searchParameters.get("theme"));

  return (
    <h1>User#{user} page with theme {theme()}</h1>
  );
}
```
