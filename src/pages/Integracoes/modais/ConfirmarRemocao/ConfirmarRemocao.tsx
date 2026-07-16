import { Modal } from "@/components/Modal"
import { Button } from "@/components/ui/button"
import type { ConfirmarRemocaoProps } from "@/pages/Integracoes/modais/ConfirmarRemocao/ConfirmarRemocao.types"

export const ConfirmarRemocao = ({
    open,
    onClose,
    titulo,
    descricao,
    isPending,
    onConfirm,
}: ConfirmarRemocaoProps) => (
    <Modal.Content
        open={open}
        onClose={onClose}
        disableClose={isPending}
    >
        <Modal.Header
            titulo={titulo}
            subTitulo={descricao}
        />
        <Modal.Actions>
            <Button
                variant="outline"
                disabled={isPending}
                onClick={onClose}
            >
                Cancelar
            </Button>
            <Button
                variant="destructive"
                disabled={isPending}
                onClick={onConfirm}
            >
                Remover
            </Button>
        </Modal.Actions>
    </Modal.Content>
)
