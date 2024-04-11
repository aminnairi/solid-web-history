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
