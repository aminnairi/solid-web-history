import { Component, createSignal, createMemo, onCleanup, onMount } from "solid-js";

type DynamicRouteSegments<Route> = Route extends `${infer FirstSegment}/${infer LastSegment}`
  ? [...DynamicRouteSegments<FirstSegment>, ...DynamicRouteSegments<LastSegment>]
  : Route extends ""
  ? []
  : Route extends `:${infer Segment}`
  ? [Segment]
  : []

type PropsFromSegments<Segments extends Array<string>> = {
  [Segment in Segments[number]]: string
}

export type WebHistoryRouteElementProps<Path> = PropsFromSegments<DynamicRouteSegments<Path>>

export type WebHistoryRouteElement<Path> = Component<WebHistoryRouteElementProps<Path>>;

export type WebHistoryRoute<Path> = {
  path: Path,
  element: WebHistoryRouteElement<Path>
}

export type CreateWebHistoryOptions<Path> = {
  routes: Array<WebHistoryRoute<Path>>,
  fallback: Component
}

export type WebHistoryPushOptions<GenericPath, GenericWebHistoryRoutes extends Array<WebHistoryRoute<GenericPath>>> = {
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

export const webHistoryParameters = (routePath: string, path: string): Record<string, string> => {
  const splittedRoutePath = routePath.split(/\/+/);
  const splittedPath = path.split(/\/+/);

  return splittedRoutePath.reduce((parameters, splittedRoutePathPart, index) => {
    const splittedPathPart = splittedPath[index];

    if (splittedPathPart !== undefined && splittedRoutePathPart.startsWith(":")) {
      return {
        ...parameters,
        [splittedRoutePathPart.slice(1)]: splittedPathPart
      }
    }

    return parameters;
  }, {} as Record<string, string>);
};

export const createWebHistoryRoute = <Path extends string>(path: Path, element: WebHistoryRouteElement<Path>): WebHistoryRoute<Path> => {
  return {
    path,
    element
  };
}

export const createWebHistory = <Path extends string>(options: CreateWebHistoryOptions<Path>) => {
  const webHistoryPush = ({ route, parameters = {}, searchParameters = new URLSearchParams(), replace = false }: WebHistoryPushOptions<Path, typeof options["routes"]>) => {
    const routeWithParameters = Object.entries(parameters).reduce((previousRoute, [parameterName, parameterValue]) => {
      return previousRoute.replace(`:${parameterName}`, parameterValue);
    }, route as string);

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
      const normalizedPath = normalizeRoute(webHistoryPath());

      const foundRoute = options.routes.find(route => {
        const normalizedRoutePath = normalizeRoute(route.path as string);
        return webHistoryMatches(normalizedRoutePath, normalizedPath);
      })

      if (foundRoute) {
        const parameters = webHistoryParameters(foundRoute.path, normalizedPath);
        return foundRoute.element(parameters as WebHistoryRouteElementProps<Path>);
      }

      return options.fallback({});
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
