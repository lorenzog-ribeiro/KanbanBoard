import { Hono } from "hono";
import { expect, test, describe, beforeEach, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { taskRoutes } from "../task.routes";
import { cleanDatabase } from "@/utils";
import { Priority, TaskStatus } from "@prisma/client";

const app = new Hono();
app.route("/tasks", taskRoutes);

beforeEach(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await cleanDatabase();
});

describe("Task API", () => {
  test("should create a new task", async () => {
    const project = await prisma.project.create({
      data: { name: "Test Project" }
    });

    const mockTask = {
      name: "Test Task",
      description: "Test Description",
      projectId: project.id
    };

    const res = await app.request("/tasks", {
      method: "POST",
      body: JSON.stringify(mockTask),
      headers: { "Content-Type": "application/json" },
    });

    const expectedResponse = { 
      ...mockTask, 
      id: expect.any(Number),
      priority: null,
      status: null
    };

    expect(res.status).toBe(201);
    expect(await res.json()).toEqual(expectedResponse);
  });

  test("should return a list of tasks for a project", async () => {
    const project = await prisma.project.create({
      data: { name: "Test Project" }
    });

    const mockTasks = [
      {
        name: "Task A",
        description: "Description A",
        projectId: project.id,
        priority: Priority.alta,
        status: TaskStatus.a_fazer
      },
      {
        name: "Task B", 
        description: "Description B",
        projectId: project.id,
        priority: Priority.baixa,
        status: TaskStatus.em_progresso
      },
    ];

    await prisma.task.createMany({
      data: mockTasks,
    });

    const res = await app.request(`/tasks/${project.id}`);
    
    expect(res.status).toBe(200);
    const tasks = await res.json();
    expect(tasks).toHaveLength(2);
    expect(tasks[0]).toMatchObject({
      name: "Task A",
      description: "Description A",
      projectId: project.id,
      priority: "alta",
      status: "a_fazer"
    });
    expect(tasks[1]).toMatchObject({
      name: "Task B",
      description: "Description B", 
      projectId: project.id,
      priority: "baixa",
      status: "em_progresso"
    });
  });

  test("should return a task by id", async () => {
    const project = await prisma.project.create({
      data: { name: "Test Project" }
    });

    const mockTask = {
      name: "Task A",
      description: "Description A",
      priority: Priority.baixa,
      status: TaskStatus.em_progresso
    };

    const createdTask = await prisma.task.create({
      data: {
        ...mockTask,
        project: { connect: { id: project.id } }
      },
    });

    const res = await app.request(`/tasks/${createdTask.id}`);
    expect(res.status).toBe(200);
    
    const response = await res.json();
    const expected = { ...mockTask, projectId: project.id, id: createdTask.id };
    if (Array.isArray(response)) {
      expect(response).toHaveLength(1);
      expect(response[0]).toEqual(expected);
    } else {
      expect(response).toEqual(expected);
    }
  });

  test("should update a task by id", async () => {
    const project = await prisma.project.create({
      data: { name: "Test Project" }
    });

    const mockTask = {
      name: "Task A",
      description: "Description A",
      projectId: project.id,
      priority: Priority.baixa,
      status: TaskStatus.a_fazer
    };

    const createdTask = await prisma.task.create({
      data: mockTask,
    });

    const updateData = {
      name: "Updated Task A",
      description: "Updated Description A",
      priority: Priority.alta,
      status: TaskStatus.em_progresso
    };

    const res = await app.request(`/tasks/${createdTask.id}`, {
      method: "PATCH",
      body: JSON.stringify(updateData),
      headers: { "Content-Type": "application/json" },
    });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ 
      ...mockTask, 
      ...updateData,
      id: createdTask.id 
    });
  });

  test("should delete a task by id", async () => {
    const project = await prisma.project.create({
      data: { name: "Test Project" }
    });

    const mockTask = {
      name: "Task A",
      description: "Description A",
      projectId: project.id
    };

    const createdTask = await prisma.task.create({
      data: mockTask,
    });

    const res = await app.request(`/tasks/${createdTask.id}`, {
      method: "DELETE",
    });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: "Task deleted" });
  });
});