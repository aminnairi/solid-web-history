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

export type PageProps<Path> = PropsFromSegments<DynamicRouteSegments<Path>>

export type PageView<Path> = Component<PageProps<Path>>;

export type InferPageProps<GenericPage> = GenericPage extends Page<infer Path> ? PageProps<Path> : never

export type Page<Path> = {
  path: Path,
  view: PageView<Path>
}

export type CreatePagesOptions<Path> = {
  pages: Array<Page<Path>>,
  fallback: Component
}

export type GoToPage<Path> = (parameters: PageProps<Path>, searchParameters?: URLSearchParams, replace?: boolean) => void

export type CreatePageOutput<Path> = {
  page: Page<Path>,
  goToPage: GoToPage<Path>
}

export const deduplicateSlashes = (text: string): string => {
  return text.split(/\/+/).join("/");
};

export const normalizeRoute = (route: string): string => {
  const regularExpression = /^\/*(<trimmedText>.*?)\/*$/;

  return regularExpression.exec(deduplicateSlashes(route.trim()))?.groups?.trimmedText ?? route;
};

export const matches = (routePath: string, path: string): boolean => {
  const splittedRoutePath = normalizeRoute(routePath).split(/\/+/);
  const splittedPath = normalizeRoute(path).split(/\/+/);

  return splittedRoutePath.length === splittedPath.length && splittedRoutePath.every((splittedRoutePathPart, index) => {
    const splittedPathPart = splittedPath[index];

    return splittedPathPart !== undefined && splittedRoutePathPart.startsWith(":") || splittedRoutePathPart === splittedPathPart;
  });
};

export const matchParameters = (routePath: string, path: string): Record<string, string> => {
  const splittedRoutePath = normalizeRoute(routePath).split(/\/+/);
  const splittedPath = normalizeRoute(path).split(/\/+/);

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

export const createPage = <Path extends string>(path: Path, view: PageView<Path>): CreatePageOutput<Path> => {
  const goToPage = (parameters: PageProps<Path>, searchParameters?: URLSearchParams, replace?: boolean) => {
    const routeWithParameters = Object.entries(parameters).reduce((previousRoute, [parameterName, parameterValue]) => {
      return previousRoute.replace(`:${parameterName}`, `${parameterValue}`);
    }, path as string);

    const routeWithSearchParameters = searchParameters?.size ?? 0 === 0 ? routeWithParameters : `${routeWithParameters}?${searchParameters?.toString()}`;

    if (replace) {
      window.history.replaceState(null, "", routeWithSearchParameters);
    } else {
      window.history.pushState(null, "", routeWithSearchParameters);
    }

    window.dispatchEvent(new CustomEvent("popstate"));
  };

  return {
    page: {
      path,
      view
    },
    goToPage
  };
};

export const createPages = <Path extends string>(options: CreatePagesOptions<Path>) => {
  const goToPreviousPage = () => {
    window.history.back();
  };

  const goToNextPage = () => {
    window.history.forward();
  };

  const goToPageAtOffset = (delta: number) => {
    window.history.go(delta);
  };

  const [path, setPath] = createSignal(window.location.pathname);

  const [searchParameters, setSearchParameters] = createSignal(new URLSearchParams(window.location.search));

  const PageView = () => {
    const webHistoryElement = createMemo(() => {
      const normalizedPath = normalizeRoute(path());

      const foundRoute = options.pages.find(route => {
        const normalizedRoutePath = normalizeRoute(route.path as string);
        return matches(normalizedRoutePath, normalizedPath);
      })

      if (foundRoute) {
        const parameters = matchParameters(foundRoute.path, normalizedPath);
        return foundRoute.view(parameters as PageProps<Path>);
      }

      return options.fallback({});
    });

    const onPopstate = () => {
      setPath(window.location.pathname);
      setSearchParameters(new URLSearchParams(window.location.search));
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
    PageView,
    searchParameters,
    goToPreviousPage,
    goToNextPage,
    goToPageAtOffset
  };
}
