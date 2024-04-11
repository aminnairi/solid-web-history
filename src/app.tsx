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
