import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../ui/dialog";
import { CheckIcon } from "lucide-react";

interface ProjectEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialName: string;
    onSaveProject: (name: string) => void;
}

export function ProjectEditDialog({ open, onOpenChange, initialName, onSaveProject }: ProjectEditDialogProps) {
    const [name, setName] = useState("");

    useEffect(() => {
        if (open) setName(initialName || "");
    }, [initialName, open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        onSaveProject(name.trim());
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Editar Projeto</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input
                            placeholder="Nome do projeto"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={!name.trim()}>
                            <CheckIcon className="w-4 h-4 mr-2" />
                            Salvar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
