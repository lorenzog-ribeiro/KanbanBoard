import { Task } from "@prisma/client";

export interface Project {
  id: number;
  name: string;
  tasks?: Task[];
}

export interface CreateProjectRequest {
  name: string;
}

export interface UpdateProjectRequest {
  name: string;
}

export type GetProjectsResponse = Project[];
export type GetProjectResponse = Project;
export type CreateProjectResponse = Project;
export type UpdateProjectResponse = Project;
export type DeleteProjectResponse = { message: string };
