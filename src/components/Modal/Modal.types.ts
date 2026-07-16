import type { ReactNode } from "react"

export type ModalContentProps = {
    open: boolean
    onClose: () => void
    disableClose?: boolean
    className?: string
    children: ReactNode
}

export type ModalHeaderProps = {
    titulo: string
    subTitulo?: string
    className?: string
    children?: ReactNode
}

export type ModalBodyProps = {
    className?: string
    children: ReactNode
}

export type ModalActionsProps = {
    className?: string
    children: ReactNode
}
