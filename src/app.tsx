import { PageView } from "./history";
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
      <PageView />
    </>
  );
}
