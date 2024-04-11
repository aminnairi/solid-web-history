import { Component, createSignal, createMemo, onCleanup, onMount } from "solid-js";

export interface WebHistoryRoute {
  path: string,
  element: Component
}

export interface CreateWebHistoryOptions<GenericWebHistoryRoutes extends Array<WebHistoryRoute>> {
  routes: GenericWebHistoryRoutes,
  fallback: Component
}

export interface WebHistoryPushOptions<GenericWebHistoryRoutes extends Array<WebHistoryRoute>> {
  route: GenericWebHistoryRoutes[number]["path"],
  replace?: boolean,
  parameters?: Record<string, string>,
  searchParameters?: URLSearchParams
}

export const deduplicateSlashes = (text: string): string => {
  return text.split(/\/+/).join("/");
};

export const normalizeRoute = (route: string): string => {
  const regularExpression = /^\/*(<trimmedText>.*?)\/*$/;

  return regularExpression.exec(deduplicateSlashes(route.trim()))?.groups?.trimmedText ?? route;
};

export const webHistoryMatches = (routePath: string, path: string): boolean => {
  const splittedRoutePath = routePath.split(/\/+/);
  const splittedPath = path.split(/\/+/);

  return splittedRoutePath.every((splittedRoutePathPart, index) => {
    const splittedPathPart = splittedPath[index];

    return splittedPathPart !== undefined && splittedRoutePathPart.startsWith(":") || splittedRoutePathPart === splittedPathPart;
  });
};

export const createWebHistory = <GenericWebHistoryRoutes extends Array<WebHistoryRoute>>({ routes, fallback }: CreateWebHistoryOptions<GenericWebHistoryRoutes>) => {
  const webHistoryPush = ({ route, parameters = {}, searchParameters = new URLSearchParams(), replace = false }: WebHistoryPushOptions<GenericWebHistoryRoutes>) => {
    const routeWithParameters = Object.entries(parameters).reduce((previousRoute, [parameterName, parameterValue]) => {
      return previousRoute.replace(`:${parameterName}`, parameterValue);
    }, route);

    const routeWithSearchParameters = searchParameters.size === 0 ? routeWithParameters : `${routeWithParameters}?${searchParameters.toString()}`;

    if (replace) {
      window.history.replaceState(null, "", routeWithSearchParameters);
    } else {
      window.history.pushState(null, "", routeWithSearchParameters);
    }

    window.dispatchEvent(new CustomEvent("popstate"));
  };

  const webHistoryBack = () => {
    window.history.back();
  };

  const webHistoryForward = () => {
    window.history.forward();
  };

  const webHistoryGo = (delta: number) => {
    window.history.go(delta);
  };

  const [webHistoryPath, setWebHistoryPath] = createSignal(window.location.pathname);

  const [webHistorySearchParameters, setWebHistorySearchParameters] = createSignal(new URLSearchParams(window.location.search));

  const WebHistoryView = () => {
    const webHistoryElement = createMemo(() => {
      const foundRoute = routes.find(route => {
        const normalizedRoutePath = normalizeRoute(route.path);
        const normalizedPath = normalizeRoute(webHistoryPath())

        return webHistoryMatches(normalizedRoutePath, normalizedPath);
      })

      if (foundRoute) {
        return foundRoute.element;
      }

      return fallback;
    });

    const onPopstate = () => {
      setWebHistoryPath(window.location.pathname);
      setWebHistorySearchParameters(new URLSearchParams(window.location.search));
    };

    onMount(() => {
      window.addEventListener("popstate", onPopstate);
    });

    onCleanup(() => {
      window.removeEventListener("onPopstate", onPopstate);
    });

    return (
      <>
        {webHistoryElement()}
      </>
    );
  };

  return {
    WebHistoryView,
    webHistorySearchParameters,
    webHistoryPush,
    webHistoryBack,
    webHistoryForward,
    webHistoryGo
  };
}
