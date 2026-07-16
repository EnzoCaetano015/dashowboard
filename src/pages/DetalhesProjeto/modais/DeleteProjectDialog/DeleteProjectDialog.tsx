import { toast } from "sonner"

import { Modal } from "@/components/Modal"
import { Button } from "@/components/ui/button"
import type { DeleteProjectDialogProps } from "@/pages/DetalhesProjeto/modais/DeleteProjectDialog/DeleteProjectDialog.types"

export const DeleteProjectDialog = ({ open, onClose, nomeProjeto }: DeleteProjectDialogProps) => (
    <Modal.Content
        open={open}
        onClose={onClose}
        className="border-border bg-card"
    >
        <Modal.Header
            titulo="Excluir projeto"
            subTitulo={`Você vai remover o agrupamento local ${nomeProjeto}.`}
        />
        <Modal.Body>
            <div className="rounded-md border border-warning/40 bg-warning/10 p-3 text-sm text-warning">
                Isso <strong>não</strong> exclui repositórios no GitHub, projetos na Vercel, serviços do
                Railway ou bases no Supabase. Somente o vínculo local no DashwoBoard é removido.
            </div>
        </Modal.Body>
        <Modal.Actions>
            <Button
                variant="outline"
                onClick={onClose}
            >
                Cancelar
            </Button>
            <Button
                variant="destructive"
                onClick={() => {
                    toast.success("Exclusão simulada. Nenhum dado foi removido.")
                    onClose()
                }}
            >
                Excluir agrupamento
            </Button>
        </Modal.Actions>
    </Modal.Content>
)
