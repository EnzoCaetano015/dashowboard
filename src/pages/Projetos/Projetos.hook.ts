import { useObterProjetos } from "@/backend/api/controllers/projeto"
import { useControlModal } from "@/lib/hooks/useControlModal"

export const useProjetos = () => {
    const { modal, setModal } = useControlModal(["novoProjeto"] as const)
    
    const {
        data: projetos = [],
        isLoading: projetosIsLoading,
    } = useObterProjetos()

    return {
        modal,
        setModal,
        projetos,
        isLoading: projetosIsLoading,
    }
}
