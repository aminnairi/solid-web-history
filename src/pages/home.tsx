import { homePage } from "../history/pages/home";
import { InferPageProps } from "../library/history";

export default function HomePage({ }: InferPageProps<typeof homePage>) {
  return (
    <h1>This is the home page</h1>
  );
}
