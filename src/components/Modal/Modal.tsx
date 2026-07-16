import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import type {
    ModalActionsProps,
    ModalBodyProps,
    ModalContentProps,
    ModalHeaderProps,
} from "@/components/Modal/Modal.types"

export const Content = ({
    open,
    onClose,
    disableClose = false,
    className,
    children,
}: ModalContentProps) => (
    <Dialog
        open={open}
        onOpenChange={(isOpen) => {
            if (!isOpen && !disableClose) onClose()
        }}
    >
        <DialogContent
            className={className}
            showCloseButton={!disableClose}
        >
            {children}
        </DialogContent>
    </Dialog>
)

export const Header = ({ titulo, subTitulo, className, children }: ModalHeaderProps) => (
    <DialogHeader className={className}>
        <DialogTitle>{titulo}</DialogTitle>
        {subTitulo && <DialogDescription>{subTitulo}</DialogDescription>}
        {children}
    </DialogHeader>
)

export const Body = ({ className, children }: ModalBodyProps) => (
    <div className={cn(className)}>{children}</div>
)

export const Actions = ({ className, children }: ModalActionsProps) => (
    <DialogFooter className={className}>{children}</DialogFooter>
)
