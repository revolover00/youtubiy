import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";

const searchSchema = z.object({
  id: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/channel")({
  validateSearch: zodValidator(searchSchema),
  component: () => null,
});
