import { prisma } from "@/lib/prisma";
import { Hono } from "hono";

const taskRoutes = new Hono();

taskRoutes.post("/", async (c) => {
    const { name, description, projectId } = await c.req.json();
    const task = await prisma.task.create({
        data: { name, description, projectId },
    });
    return c.json(task, 201);
});

taskRoutes.get("/:projectId", async (c) => {
    const { projectId } = c.req.param();
    const tasks = await prisma.task.findMany({
        where: { projectId: Number(projectId) },
    });
    return c.json(tasks);
});

taskRoutes.get("/", async (c) => {
    const tasks = await prisma.task.findMany();
    return c.json(tasks);
});

taskRoutes.patch("/:id", async (c) => {
    const { id } = c.req.param();
    const { name, description, priority, status } = await c.req.json();
    const task = await prisma.task.update({
        where: { id: Number(id) },
        data: { name, description, priority, status },
    });
    return c.json(task);
});

taskRoutes.delete("/:id", async (c) => {
    const { id } = c.req.param();
    await prisma.task.delete({
        where: { id: Number(id) },
    });
    return c.json({ message: "Task deleted" });
});

export { taskRoutes };
