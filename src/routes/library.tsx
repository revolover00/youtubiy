import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import App from "../App";

const searchSchema = z.object({
  k: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/library")({
  validateSearch: zodValidator(searchSchema),
  component: () => <App />,
});
