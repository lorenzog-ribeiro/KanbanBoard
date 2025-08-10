"use client";

import { useCallback, useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { KanbanBoard } from "@/components/KanbanBoard";
import { useToast } from "@/hooks/use-toast";
import { ProjectEditDialog } from "@/components/Project/ProjectEditDialog/ProjectEditDialog";
import { ProjectDialog } from "@/components/Project/ProjectAddDialog/ProjectAddDialog";
import { createProject, deleteProject, getProjects, Project, updateProject } from "../../hooks";

interface ProjectWithTaskCount extends Project {
    taskCount: number;
}

const Home = () => {
    const [activeProjectId, setActiveProjectId] = useState<number | null>(null);
    const [projects, setProjects] = useState<ProjectWithTaskCount[]>([]);
    const [loading, setLoading] = useState(true);
    const [projectDialogOpen, setProjectDialogOpen] = useState(false);
    const [projectEditOpen, setProjectEditOpen] = useState(false);
    const [projectToEditId, setProjectToEditId] = useState<number | null>(null);
    const { toast } = useToast();

    const loadProjects = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getProjects();

            const projectsWithTaskCount: ProjectWithTaskCount[] = data.map((project) => ({
                ...project,
                taskCount: Array.isArray(project.tasks) ? project.tasks.length : 0,
            }));

            setProjects(projectsWithTaskCount);

            if (!activeProjectId && projectsWithTaskCount.length > 0) {
                setActiveProjectId(projectsWithTaskCount[0].id);
            }
        } catch (error) {
            toast({
                title: "Erro",
                description: "Não foi possível carregar os projetos.",
                variant: "destructive",
            });
            console.error("Erro ao carregar projetos:", error);
        } finally {
            setLoading(false);
        }
    }, [activeProjectId, toast]);

    const updateProjectTaskCountLocal = useCallback((projectId: number, delta: number) => {
        setProjects((prev) =>
            prev.map((project) =>
                project.id === projectId ? { ...project, taskCount: Math.max(0, project.taskCount + delta) } : project
            )
        );
    }, []);

    useEffect(() => {
        loadProjects();
    }, []);

    const handleAddProject = async (projectName: string) => {
        try {
            const newProject = await createProject({ name: projectName });
            const projectWithTaskCount: ProjectWithTaskCount = {
                ...newProject,
                taskCount: 0,
            };

            setProjects((prev) => [...prev, projectWithTaskCount]);
            setProjectDialogOpen(false);

            if (projects.length === 0) {
                setActiveProjectId(newProject.id);
            }

            toast({
                title: "Projeto adicionado",
                description: `O projeto "${projectName}" foi criado com sucesso.`,
            });
        } catch (error) {
            toast({
                title: "Erro",
                description: "Não foi possível criar o projeto.",
                variant: "destructive",
            });
            console.error("Erro ao criar projeto:", error);
        }
    };

    const handleDeleteProject = async (projectId: number) => {
        try {
            await deleteProject(projectId);
            setProjects((prev) => prev.filter((p) => p.id !== projectId));

            if (activeProjectId === projectId) {
                const remainingProjects = projects.filter((p) => p.id !== projectId);
                setActiveProjectId(remainingProjects.length > 0 ? remainingProjects[0].id : null);
            }

            toast({
                title: "Projeto excluído",
                description: "O projeto foi removido com sucesso.",
            });
        } catch (error) {
            toast({
                title: "Erro",
                description: "Não foi possível excluir o projeto.",
                variant: "destructive",
            });
            console.error("Erro ao deletar projeto:", error);
        }
    };

    const handleOpenEditProject = (projectId: number) => {
        setProjectToEditId(projectId);
        setProjectEditOpen(true);
    };

    const handleSaveProject = async (name: string) => {
        if (projectToEditId == null) return;

        try {
            const updatedProject = await updateProject(projectToEditId, { name });

            setProjects((prev) =>
                prev.map((p) => (p.id === projectToEditId ? { ...updatedProject, taskCount: p.taskCount } : p))
            );

            setProjectEditOpen(false);
            setProjectToEditId(null);

            toast({
                title: "Projeto atualizado",
                description: `O projeto "${name}" foi salvo.`,
            });
        } catch (error) {
            toast({
                title: "Erro",
                description: "Não foi possível atualizar o projeto.",
                variant: "destructive",
            });
            console.error("Erro ao atualizar projeto:", error);
        }
    };

    const handleTaskCreated = useCallback(() => {
        if (activeProjectId) {
            updateProjectTaskCountLocal(activeProjectId, 1);
        }
    }, [activeProjectId, updateProjectTaskCountLocal]);

    const handleTaskDeleted = useCallback(() => {
        if (activeProjectId) {
            updateProjectTaskCountLocal(activeProjectId, -1);
        }
    }, [activeProjectId, updateProjectTaskCountLocal]);

    const activeProject = projects.find((p) => p.id === activeProjectId);
    const activeProjectName = activeProject?.name;
    
    return (
        <div className="min-h-screen flex bg-background">
            <Sidebar
                activeProject={activeProjectId}
                onProjectChange={setActiveProjectId}
                projects={projects}
                onDeleteProject={handleDeleteProject}
                onAddProject={() => setProjectDialogOpen(true)}
                onEditProject={handleOpenEditProject}
            />
            <KanbanBoard
                activeProjectId={activeProjectId}
                projectName={activeProjectName}
                onTaskCreated={handleTaskCreated}
                onTaskDeleted={handleTaskDeleted}
            />
            <ProjectDialog
                open={projectDialogOpen}
                onOpenChange={setProjectDialogOpen}
                onAddProject={handleAddProject}
            />
            <ProjectEditDialog
                open={projectEditOpen}
                onOpenChange={setProjectEditOpen}
                initialName={projectToEditId ? projects.find((p) => p.id === projectToEditId)?.name || "" : ""}
                onSaveProject={handleSaveProject}
            />
        </div>
    );
};

export default Home;
