import { useParams } from "react-router-dom"
import { toast } from "sonner"

import { useObterProjetoPorId } from "@/backend/api/controllers/projeto"
import { useControlModal } from "@/lib/hooks/useControlModal"

export const useDetalhesProjeto = () => {
    const { modal, setModal } = useControlModal(["excluirProjeto"] as const)
    const { id } = useParams<{ id: string }>()
    const {
        data: projeto,
        isLoading: projetoIsLoading,
        isFetching: projetoIsFetching,
        refetch: atualizarProjeto,
    } = useObterProjetoPorId({ id })

    const atualizar = () => {
        toast.promise(atualizarProjeto({ throwOnError: true }), {
            id: `atualizar-projeto-${id}`,
            loading: "Atualizando projeto...",
            success: "Projeto atualizado com dados mockados.",
            error: "Não foi possível atualizar o projeto.",
        })
    }

    return {
        modal,
        setModal,
        projeto,
        isLoading: projetoIsLoading,
        isFetching: projetoIsFetching,
        atualizar,
    }
}
