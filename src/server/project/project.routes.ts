import { prisma } from "@/lib/prisma";
import { Hono } from "hono";

const projectRoutes = new Hono();

projectRoutes.post("/", async (c) => {
  const { name } = await c.req.json();
  const project = await prisma.project.create({
    data: { name },
  });
  return c.json(project, 201);
});

projectRoutes.get("/", async (c) => {
  const projects = await prisma.project.findMany({
    include: { tasks: true },
  });
  return c.json(projects);
});

projectRoutes.get("/:id", async (c) => {
  const { id } = c.req.param();
  const project = await prisma.project.findUnique({
    where: { id: Number(id) },
    include: { tasks: true },
  });
  return c.json(project);
});

projectRoutes.patch("/:id", async (c) => {
  const { id } = c.req.param();
  const { name } = await c.req.json();
  const project = await prisma.project.update({
    where: { id: Number(id) },
    data: { name },
  });
  return c.json(project);
});

projectRoutes.delete("/:id", async (c) => {
  const { id } = c.req.param();
  await prisma.project.delete({
    where: { id: Number(id) },
  });
  return c.json({ message: "Project deleted" });
});

export { projectRoutes };
