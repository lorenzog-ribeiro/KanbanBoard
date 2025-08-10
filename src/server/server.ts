import { Hono } from "hono";
import { healthRoutes } from "./health";
import { projectRoutes } from "./project";
import { taskRoutes } from "./task";

const app = new Hono();

app.route("health", healthRoutes);
app.route("project", projectRoutes);
app.route("task", taskRoutes);

export { app };
