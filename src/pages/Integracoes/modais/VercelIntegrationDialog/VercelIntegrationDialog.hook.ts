import { useState } from "react"
import { toast } from "sonner"

import {
    useObterConexaoVercel,
    useRemoverConexaoVercel,
    useSalvarConexaoVercel,
    useTestarConexaoVercel,
} from "@/backend/api/controllers/vercel"
import { Enum } from "@/backend/api/enums/enum"
import { useControlModal } from "@/lib/hooks/useControlModal"
import { possuiRuntimeTauri } from "@/lib/utils/tauri"
import { normalizarErroVercel } from "@/lib/utils/vercel"

export const useVercelIntegrationDialog = () => {
    const { modal, setModal } = useControlModal(["removerConexao"] as const)
    const [token, setToken] = useState("")
    const [formVisible, setFormVisible] = useState(false)
    const {
        data: connection,
        isLoading: connectionIsLoading,
        isError: connectionIsError,
        error: connectionError,
        refetch: retry,
    } = useObterConexaoVercel()
    const { mutateAsync: saveConnection, isPending: saveConnectionIsPending } = useSalvarConexaoVercel()
    const { mutateAsync: testConnection, isPending: testConnectionIsPending } = useTestarConexaoVercel()
    const { mutateAsync: removeConnection, isPending: removeConnectionIsPending } =
        useRemoverConexaoVercel()

    const resetForm = () => {
        setToken("")
        setFormVisible(false)
    }

    const save = async () => {
        if (!token.trim()) {
            toast.error("Informe o token da Vercel.")
            return
        }
        try {
            await saveConnection({ token: token.trim() })
            resetForm()
            toast.success(connection ? "Token Vercel substituído." : "Vercel conectada.")
        } catch (error) {
            toast.error(normalizarErroVercel(error).message)
        }
    }

    const test = async () => {
        try {
            const testedConnection = await testConnection()
            if (testedConnection.status === Enum.StatusIntegracao.Erro) {
                toast.error(testedConnection.erro ?? "A conexão Vercel apresentou um erro.")
                return
            }
            toast.success("Conexão Vercel validada.")
        } catch (error) {
            toast.error(normalizarErroVercel(error).message)
        }
    }

    const remove = async () => {
        try {
            await removeConnection()
            resetForm()
            setModal("removerConexao", { open: false })
            toast.success("Conexão e token Vercel removidos.")
        } catch (error) {
            toast.error(normalizarErroVercel(error).message)
        }
    }

    return {
        modal,
        runtimeDisponivel: possuiRuntimeTauri(),
        connection: connection ?? null,
        isLoading: connectionIsLoading,
        isError: connectionIsError,
        error: connectionError,
        isPending: saveConnectionIsPending || testConnectionIsPending || removeConnectionIsPending,
        removeIsPending: removeConnectionIsPending,
        token,
        formVisible,
        setToken,
        showForm: !connection || formVisible,
        startUpdate: () => setFormVisible(true),
        resetForm,
        save,
        test,
        startRemove: () => setModal("removerConexao", { open: true }),
        cancelRemove: () => {
            if (!removeConnectionIsPending) setModal("removerConexao", { open: false })
        },
        remove,
        retry,
    }
}
