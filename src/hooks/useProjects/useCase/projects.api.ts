import { ROUTES } from "@/constants";
import { api } from "@/lib/axios";
import { CreateProjectRequest, CreateProjectResponse, UpdateProjectRequest, UpdateProjectResponse, DeleteProjectResponse, GetProjectsResponse } from "./projects.types";

export async function getProjects() {
  const response = await api.get<GetProjectsResponse>(ROUTES.PROJECT);
  return response.data;
}

export async function createProject(data: CreateProjectRequest) {
  const response = await api.post<CreateProjectResponse>(ROUTES.PROJECT, data);
  return response.data;
}


export async function updateProject(id: number, data: UpdateProjectRequest) {
  const response = await api.patch<UpdateProjectResponse>(`${ROUTES.PROJECT}/${id}`, data);
  return response.data;
}

export async function deleteProject(id: number) {
  const response = await api.delete<DeleteProjectResponse>(`${ROUTES.PROJECT}/${id}`);
  return response.data;
}