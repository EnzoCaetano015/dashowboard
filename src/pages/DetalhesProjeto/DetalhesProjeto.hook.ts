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
        isError: projetoIsError,
        isFetching: projetoIsFetching,
        refetch: atualizarProjeto,
    } = useObterProjetoPorId({ id })

    const atualizar = async () => {
        await atualizarProjeto()
        toast.success("Projeto atualizado com dados mockados.")
    }

    return {
        modal,
        setModal,
        projeto,
        isLoading: projetoIsLoading,
        isError: projetoIsError,
        isFetching: projetoIsFetching,
        atualizar,
        tentarNovamente: atualizarProjeto,
    }
}
