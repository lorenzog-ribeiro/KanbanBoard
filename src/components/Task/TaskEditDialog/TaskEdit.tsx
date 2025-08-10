import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../ui/dialog";
import { CheckIcon } from "lucide-react";

interface Task {
    id: number;
    name: string;
    description: string;
    priority: "baixa" | "media" | "alta" | null;
    status: "a_fazer" | "em_progresso" | "concluido" | null;
    projectId: number;
}

interface TaskEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    task: Task | null;
    onSave: (task: { name: string; description: string; priority: "baixa" | "media" | "alta" }) => void;
}

export function TaskEditDialog({ open, onOpenChange, task, onSave }: TaskEditDialogProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<"baixa" | "media" | "alta">("media");

    useEffect(() => {
        if (task && open) {
            setName(task.name || "");
            setDescription(task.description || "");
            setPriority(task.priority || "media");
        }
    }, [task, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        onSave({
            name: name.trim(),
            description: description.trim(),
            priority,
        });
    };

    const handleClose = () => {
        if (task) {
            setName(task.name || "");
            setDescription(task.description || "");
            setPriority(task.priority || "media");
        }
        onOpenChange(false);
    };

    if (!task) return null;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Editar Tarefa</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Nome da tarefa</label>
                        <Input
                            placeholder="Digite o nome da tarefa"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Descrição</label>
                        <Textarea
                            placeholder="Digite a descrição da tarefa"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Prioridade</label>
                        <Select
                            value={priority}
                            onValueChange={(value: "baixa" | "media" | "alta") => setPriority(value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a prioridade" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="baixa">Baixa</SelectItem>
                                <SelectItem value="media">Média</SelectItem>
                                <SelectItem value="alta">Alta</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={!name.trim()}>
                            <CheckIcon className="w-4 h-4 mr-2" />
                            Salvar Alterações
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
