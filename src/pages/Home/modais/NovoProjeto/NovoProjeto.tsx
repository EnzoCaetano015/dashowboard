import { Modal } from "@/components/Modal"
import { NovoProjetoConteudo } from "@/components/NovoProjeto/NovoProjetoConteudo"
import type { ModalControlProps } from "@/lib/types/modal"

export const NovoProjeto = ({ open, onClose }: ModalControlProps) => (
    <Modal.Content
        open={open}
        onClose={onClose}
        className="max-h-[90dvh] gap-0 overflow-hidden border-border bg-card p-0 sm:max-w-3xl"
    >
        <NovoProjetoConteudo
            open={open}
            onClose={onClose}
        />
    </Modal.Content>
)
