import { Hono } from "hono";
import { expect, test, describe, beforeEach, afterAll } from "vitest";
import { prisma } from "@/lib/prisma";
import { projectRoutes } from "../project.routes";
import { cleanDatabase } from "@/utils";

const app = new Hono();
app.route("/projects", projectRoutes);

beforeEach(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await cleanDatabase();
});

describe("Project API", () => {
  test("should create a new project", async () => {
    const mockProject = { name: "Test Project" };

    const res = await app.request("/projects", {
      method: "POST",
      body: JSON.stringify({ name: "Test Project" }),
      headers: { "Content-Type": "application/json" },
    });

    const expectedResponse = { ...mockProject, id: 1 };

    expect(res.status).toBe(201);
    expect(await res.json()).toEqual(expectedResponse);
  });

  test("should return a list of projects", async () => {
    const mockProjects = [
      { id: 1, name: "Project A" },
      { id: 2, name: "Project B" },
    ];

    await prisma.project.createMany({
      data: mockProjects,
    });

    const expectedResponse = mockProjects.map((project) => ({
      ...project,
      tasks: [],
    }));

    const res = await app.request("/projects");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(expectedResponse);
  });

  test("should return a project by id", async () => {
    const mockProject = { id: 1, name: "Project A" };

    await prisma.project.create({
      data: mockProject,
    });

    const res = await app.request(`/projects/${mockProject.id}`);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ...mockProject, tasks: [] });
  });

  test("should update a project by id", async () => {
    const mockProject = { id: 1, name: "Project A" };

    await prisma.project.create({
      data: mockProject,
    });

    const res = await app.request(`/projects/${mockProject.id}`, {
      method: "PATCH",
      body: JSON.stringify({ name: "Updated Project A" }),
      headers: { "Content-Type": "application/json" },
    });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ...mockProject, name: "Updated Project A"});
  });

  test("should delete a project by id", async () => {
    const mockProject = { id: 1, name: "Project A" };

    await prisma.project.create({
      data: mockProject,
    });

    const res = await app.request(`/projects/${mockProject.id}`, {
      method: "DELETE",
    });

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: "Project deleted" });
  });  
});
