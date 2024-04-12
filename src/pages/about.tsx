import { aboutPage } from "../history/pages/about";
import { InferPageProps } from "../library/history";

export default function About({ }: InferPageProps<typeof aboutPage>) {
  return (
    <h1>This is the about page</h1>
  );
}
