import type { ModalControlProps } from "@/lib/types/modal"

export type ConfirmarRemocaoProps = ModalControlProps & {
    titulo: string
    descricao: string
    isPending: boolean
    onConfirm: () => void
}
