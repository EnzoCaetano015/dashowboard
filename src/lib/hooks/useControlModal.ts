import { useCallback, useState } from "react"

export type SetModalOptions = {
    open: boolean
}

export const useControlModal = <TModalName extends string>(modalNames: readonly TModalName[]) => {
    const [modal, setModalState] = useState<Record<TModalName, boolean>>(() =>
        modalNames.reduce(
            (accumulator, modalName) => ({
                ...accumulator,
                [modalName]: false,
            }),
            {} as Record<TModalName, boolean>
        )
    )

    const setModal = useCallback((modalName: TModalName, options: SetModalOptions) => {
        setModalState((currentModal) => ({
            ...currentModal,
            [modalName]: options.open,
        }))
    }, [])

    return {
        modal,
        setModal,
    }
}
