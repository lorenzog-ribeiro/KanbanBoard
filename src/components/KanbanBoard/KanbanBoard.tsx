import { useState, useEffect, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { TaskDialog } from "../Task/TaskAddDialog/TaskAdd";
import { TaskEditDialog } from "../Task/TaskEditDialog/TaskEdit";
import { DeleteConfirmDialog } from "../DeleteConfirmDialog";
import { useToast } from "@/hooks/use-toast";
import { getTasksByProject, createTask, updateTask, deleteTask, Task } from "../../hooks/useTasks";

interface Column {
    id: "a_fazer" | "em_progresso" | "concluido";
    title: string;
    tasks: Task[];
}

const priorityColors = {
    baixa: "bg-green-100 text-green-800",
    media: "bg-yellow-100 text-yellow-800",
    alta: "bg-red-100 text-red-800",
};

const columnColors = {
    a_fazer: "bg-kanban-todo",
    em_progresso: "bg-kanban-progress/10 border-kanban-progress/20",
    concluido: "bg-kanban-done/10 border-kanban-done/20",
};

const statusMapping = {
    a_fazer: "a_fazer" as const,
    em_progresso: "em_progresso" as const,
    concluido: "concluido" as const,
};

interface KanbanBoardProps {
    activeProjectId: number | null;
    projectName?: string;
    onTaskCreated?: () => void;
    onTaskDeleted?: () => void;
    onTaskMoved?: (fromProjectId: number, toProjectId?: number) => void;
}

export function KanbanBoard({
    activeProjectId,
    projectName,
    onTaskCreated,
    onTaskDeleted,
    onTaskMoved,
}: KanbanBoardProps) {
    const [columns, setColumns] = useState<Column[]>([
        { id: "a_fazer", title: "A Fazer", tasks: [] },
        { id: "em_progresso", title: "Em Progresso", tasks: [] },
        { id: "concluido", title: "Concluído", tasks: [] },
    ]);
    const [loading, setLoading] = useState(false);
    const [taskDialogOpen, setTaskDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
    const [taskEditOpen, setTaskEditOpen] = useState(false);
    const [taskEditing, setTaskEditing] = useState<Task | null>(null);
    const { toast } = useToast();

    const loadTasks = useCallback(async () => {
        if (!activeProjectId) {
            setColumns([
                { id: "a_fazer", title: "A Fazer", tasks: [] },
                { id: "em_progresso", title: "Em Progresso", tasks: [] },
                { id: "concluido", title: "Concluído", tasks: [] },
            ]);
            return;
        }

        try {
            setLoading(true);
            const tasks = await getTasksByProject(activeProjectId);

            const newColumns: Column[] = [
                {
                    id: "a_fazer",
                    title: "A Fazer",
                    tasks: tasks.filter((task: any) => task.status === "a_fazer" || task.status === null),
                },
                {
                    id: "em_progresso",
                    title: "Em Progresso",
                    tasks: tasks.filter((task: any) => task.status === "em_progresso"),
                },
                {
                    id: "concluido",
                    title: "Concluído",
                    tasks: tasks.filter((task: any) => task.status === "concluido"),
                },
            ];

            setColumns(newColumns);
        } catch (error) {
            toast({
                title: "Erro",
                description: "Não foi possível carregar as tarefas.",
                variant: "destructive",
            });
            console.error("Erro ao carregar tasks:", error);
        } finally {
            setLoading(false);
        }
    }, [activeProjectId, toast]);

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    const onDragEnd = async (result: any) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        const sourceColumn = columns.find((col) => col.id === source.droppableId);
        const destColumn = columns.find((col) => col.id === destination.droppableId);

        if (!sourceColumn || !destColumn) return;

        const task = sourceColumn.tasks.find((task) => task.id.toString() === draggableId);
        if (!task) return;

        const newSourceTasks = sourceColumn.tasks.filter((t) => t.id.toString() !== draggableId);
        const newDestTasks = [...destColumn.tasks];
        newDestTasks.splice(destination.index, 0, task);

        const newColumns = columns.map((col) => {
            if (col.id === source.droppableId) {
                return { ...col, tasks: newSourceTasks };
            }
            if (col.id === destination.droppableId) {
                return { ...col, tasks: newDestTasks };
            }
            return col;
        });

        setColumns(newColumns);

        try {
            await updateTask(task.id, { status: statusMapping[destination.droppableId as keyof typeof statusMapping] });

            if (activeProjectId) {
                onTaskMoved?.(activeProjectId);
            }
        } catch (error) {
            loadTasks();
            toast({
                title: "Erro",
                description: "Não foi possível mover a tarefa.",
                variant: "destructive",
            });
            console.error("Erro ao mover task:", error);
        }
    };

    const handleAddTask = async (taskData: {
        name: string;
        description: string;
        priority: "baixa" | "media" | "alta";
    }) => {
        if (!activeProjectId) {
            toast({
                title: "Erro",
                description: "Selecione um projeto primeiro.",
                variant: "destructive",
            });
            return;
        }

        try {
            const newTask = await createTask({
                name: taskData.name,
                description: taskData.description,
                priority: taskData.priority,
                status: "a_fazer",
                projectId: activeProjectId,
            });

            setColumns((prev) =>
                prev.map((col) => (col.id === "a_fazer" ? { ...col, tasks: [...col.tasks, newTask] } : col))
            );
            setTaskDialogOpen(false);
            onTaskCreated?.();

            toast({
                title: "Tarefa adicionada",
                description: `A tarefa "${taskData.name}" foi criada com sucesso.`,
            });
        } catch (error) {
            toast({
                title: "Erro",
                description: "Não foi possível criar a tarefa.",
                variant: "destructive",
            });
            console.error("Erro ao criar task:", error);
        }
    };

    const handleDeleteTask = (task: Task, e: React.MouseEvent) => {
        e.stopPropagation();
        setTaskToDelete(task);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!taskToDelete) return;

        try {
            await deleteTask(taskToDelete.id);

            setColumns((prev) =>
                prev.map((col) => ({
                    ...col,
                    tasks: col.tasks.filter((task) => task.id !== taskToDelete.id),
                }))
            );
            setTaskToDelete(null);
            onTaskDeleted?.();

            toast({
                title: "Tarefa excluída",
                description: "A tarefa foi removida com sucesso.",
            });
        } catch (error) {
            toast({
                title: "Erro",
                description: "Não foi possível excluir a tarefa.",
                variant: "destructive",
            });
            console.error("Erro ao deletar task:", error);
        }
    };

    const handleEditTask = (task: Task) => {
        setTaskEditing(task);
        setTaskEditOpen(true);
    };

    const handleSaveTask = async (updated: {
        name: string;
        description: string;
        priority: "baixa" | "media" | "alta";
    }) => {
        if (!taskEditing) return;

        try {
            const updatedTask = await updateTask(taskEditing.id, {
                name: updated.name,
                description: updated.description,
                priority: updated.priority,
            });

            setColumns((prev) =>
                prev.map((col) => ({
                    ...col,
                    tasks: col.tasks.map((task) => (task.id === taskEditing.id ? updatedTask : task)),
                }))
            );

            setTaskEditing(null);
            setTaskEditOpen(false);

            toast({
                title: "Tarefa atualizada",
                description: `A tarefa "${updated.name}" foi salva.`,
            });
        } catch (error) {
            toast({
                title: "Erro",
                description: "Não foi possível atualizar a tarefa.",
                variant: "destructive",
            });
            console.error("Erro ao atualizar task:", error);
        }
    };

    return (
        <div className="flex-1 bg-background p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">
                            {projectName || `Projeto ${activeProjectId}`}
                        </h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button className="bg-primary hover:bg-primary/90" onClick={() => setTaskDialogOpen(true)}>
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Adicionar Tarefa
                        </Button>
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2 text-muted-foreground">Carregando tarefas...</span>
                </div>
            )}

            {/* Kanban Board */}
            {!loading && (
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="grid grid-cols-3 gap-6">
                        {columns.map((column) => (
                            <div key={column.id} className="space-y-4">
                                {/* Column Header */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-semibold text-foreground">{column.title}</h3>
                                        <Badge variant="secondary">{column.tasks.length}</Badge>
                                    </div>
                                </div>

                                {/* Column Content */}
                                <Droppable droppableId={column.id}>
                                    {(provided: any, snapshot: any) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.droppableProps}
                                            className={`min-h-[500px] p-4 rounded-lg border-2 border-dashed transition-colors ${
                                                snapshot.isDraggingOver
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border bg-muted/30"
                                            } ${columnColors[column.id]}`}
                                        >
                                            <div className="space-y-3">
                                                {column.tasks.length === 0 ? (
                                                    <div className="text-center py-8 text-muted-foreground">
                                                        <p className="text-sm">Nenhuma tarefa</p>
                                                    </div>
                                                ) : (
                                                    column.tasks.map((task, index) => (
                                                        <Draggable
                                                            key={task.id.toString()}
                                                            draggableId={task.id.toString()}
                                                            index={index}
                                                        >
                                                            {(provided: any, snapshot: any) => (
                                                                <Card
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    onClick={() => handleEditTask(task)}
                                                                    className={`group cursor-pointer transition-all duration-200 ${
                                                                        snapshot.isDragging
                                                                            ? "rotate-3 shadow-lg"
                                                                            : "hover:shadow-md hover:bg-kanban-card-hover"
                                                                    } bg-kanban-card`}
                                                                >
                                                                    <CardHeader className="pb-2">
                                                                        <div className="flex items-center justify-between">
                                                                            <CardTitle className="text-sm font-medium flex-1 mr-2">
                                                                                {task.name}
                                                                            </CardTitle>
                                                                            <div className="flex items-center space-x-2">
                                                                                {task.priority && (
                                                                                    <Badge
                                                                                        className={`text-xs ${
                                                                                            task.priority in
                                                                                            priorityColors
                                                                                                ? priorityColors[
                                                                                                      task.priority as keyof typeof priorityColors
                                                                                                  ]
                                                                                                : ""
                                                                                        }`}
                                                                                    >
                                                                                        {task.priority}
                                                                                    </Badge>
                                                                                )}
                                                                                <Button
                                                                                    size="sm"
                                                                                    variant="ghost"
                                                                                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                                    onClick={(event: any) =>
                                                                                        handleDeleteTask(task, event)
                                                                                    }
                                                                                    title="Excluir tarefa"
                                                                                >
                                                                                    <Trash2Icon className="w-3 h-3 text-destructive" />
                                                                                </Button>
                                                                            </div>
                                                                        </div>
                                                                    </CardHeader>
                                                                    {task.description && (
                                                                        <CardContent className="pt-0">
                                                                            <p className="text-xs text-muted-foreground">
                                                                                {task.description}
                                                                            </p>
                                                                        </CardContent>
                                                                    )}
                                                                </Card>
                                                            )}
                                                        </Draggable>
                                                    ))
                                                )}
                                            </div>
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                </DragDropContext>
            )}

            {/* Dialogs */}
            <TaskDialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen} onAddTask={handleAddTask} />
            <TaskEditDialog
                open={taskEditOpen}
                onOpenChange={setTaskEditOpen}
                task={taskEditing}
                onSave={handleSaveTask}
            />
            <DeleteConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteConfirm}
                title="Excluir Tarefa"
                description={
                    taskToDelete
                        ? `Tem certeza que deseja excluir a tarefa "${taskToDelete.name}"? Esta ação não pode ser desfeita.`
                        : ""
                }
            />
        </div>
    );
}
