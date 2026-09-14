import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import App from "../App";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(searchSchema),
  component: () => <App />,
});
