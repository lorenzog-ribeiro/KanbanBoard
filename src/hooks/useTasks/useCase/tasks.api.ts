import { ROUTES } from "@/constants";
import { api } from "@/lib/axios";
import { GetTasksByProjectResponse, CreateTaskRequest, CreateTaskResponse, UpdateTaskRequest, UpdateTaskResponse, DeleteTaskResponse } from "./tasks.types";

export async function getTasksByProject(projectId: number) {
  const response = await api.get<GetTasksByProjectResponse>(`${ROUTES.TASK}/${projectId}`);
  return response.data;
}

export async function createTask(data: CreateTaskRequest) {
  const response = await api.post<CreateTaskResponse>(ROUTES.TASK, data);
  return response.data;
}

export async function updateTask(id: number, data: UpdateTaskRequest) {
  const response = await api.patch<UpdateTaskResponse>(`${ROUTES.TASK}/${id}`, data);
  return response.data;
}

export async function deleteTask(id: number) {
  const response = await api.delete<DeleteTaskResponse>(`${ROUTES.TASK}/${id}`);
  return response.data;
}