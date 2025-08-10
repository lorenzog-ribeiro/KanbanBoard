import { Priority, TaskStatus } from "@prisma/client";

export interface Task {
    id: number;
    name: string;
    description: string;
    priority: Priority| null;
    status: TaskStatus| null;
    projectId: number;
}

export interface CreateTaskRequest {
    name: string;
    description: string;
    priority?: Priority | null;
    status?: TaskStatus | null;
    projectId: number;
}

export interface UpdateTaskRequest {
    name?: string;
    description?: string;
    priority?: Priority | null;
    status?: TaskStatus | null;
}

export type GetTasksResponse = Task[];
export type GetTasksByProjectResponse = Task[];
export type CreateTaskResponse = Task;
export type UpdateTaskResponse = Task;
export type DeleteTaskResponse = { message: string };