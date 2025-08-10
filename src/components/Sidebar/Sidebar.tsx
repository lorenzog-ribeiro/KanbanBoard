import { useState } from "react";
import { FolderIcon, PlusIcon, Trash2Icon, PencilIcon, RefreshCwIcon } from "lucide-react";
import { DeleteConfirmDialog } from "../DeleteConfirmDialog/DeleteConfirmDialog";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";
import { Task } from "@prisma/client";

interface ProjectWithTaskCount {
    id: number;
    name: string;
    taskCount: number;
    tasks?: Task[];
}

interface SidebarProps {
    activeProject: number | null;
    onProjectChange: (projectId: number) => void;
    projects: ProjectWithTaskCount[];
    onDeleteProject: (projectId: number) => void;
    onAddProject: () => void;
    onEditProject: (projectId: number) => void;
    onRefresh?: () => void;
}

export function Sidebar({
    activeProject,
    onProjectChange,
    projects,
    onDeleteProject,
    onAddProject,
    onEditProject,
    onRefresh,
}: SidebarProps) {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<number | null>(null);

    const handleDeleteClick = (projectId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setProjectToDelete(projectId);
        setDeleteDialogOpen(true);
    };

    const handleEditClick = (projectId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        onEditProject(projectId);
    };

    const handleDeleteConfirm = () => {
        if (projectToDelete) {
            onDeleteProject(projectToDelete);
            setProjectToDelete(null);
        }
    };

    const handleRefreshClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRefresh?.();
    };

    const getTaskCount = (project: ProjectWithTaskCount): number => {
        if (typeof project.taskCount === "number") {
            return project.taskCount;
        }

        if (Array.isArray(project.tasks)) {
            return project.tasks.length;
        }
        return (project as any).tasks || 0;
    };

    return (
        <div className="w-80 h-screen bg-sidebar-bg text-sidebar-text flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-sidebar-accent">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">O</span>
                    </div>
                    <h1 className="text-lg font-semibold">Kanban Board</h1>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-6">
                <div className="space-y-6">
                    {/* Projects Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-2">
                                <FolderIcon className="w-4 h-4" />
                                <h2 className="text-sm font-medium">Projects</h2>
                            </div>
                            <div className="flex items-center space-x-1">
                                {onRefresh && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={handleRefreshClick}
                                        title="Atualizar projetos"
                                    >
                                        <RefreshCwIcon className="w-4 h-4" />
                                    </Button>
                                )}
                                <Button size="sm" variant="ghost" onClick={onAddProject}>
                                    <PlusIcon className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {projects.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <FolderIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Nenhum projeto encontrado</p>
                                    <p className="text-xs">Clique em + para criar um projeto</p>
                                </div>
                            ) : (
                                projects.map((project) => (
                                    <Card
                                        key={project.id}
                                        className={`group p-3 cursor-pointer transition-colors ${
                                            activeProject === project.id
                                                ? "bg-sidebar-hover border-amber-600"
                                                : "bg-sidebar-accent hover:bg-sidebar-hover border-transparent"
                                        }`}
                                        onClick={() => onProjectChange(project.id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2 flex-1">
                                                <span className="text-sm truncate">{project.name}</span>
                                                <Badge variant="secondary" className="text-xs">
                                                    {getTaskCount(project)}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={(e) => handleEditClick(project.id, e)}
                                                    title="Editar projeto"
                                                >
                                                    <PencilIcon className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={(e) => handleDeleteClick(project.id, e)}
                                                    title="Excluir projeto"
                                                >
                                                    <Trash2Icon className="w-3 h-3 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
                title="Excluir Projeto"
                description={
                    projectToDelete
                        ? `Tem certeza que deseja excluir o projeto "${
                              projects.find((p) => p.id === projectToDelete)?.name
                          }"? Esta ação não pode ser desfeita.`
                        : ""
                }
            />
        </div>
    );
}
