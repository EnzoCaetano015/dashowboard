import { useState } from "react"
import { toast } from "sonner"

import {
    useObterConexaoSupabase,
    useRemoverConexaoSupabase,
    useSalvarConexaoSupabase,
    useTestarConexaoSupabase,
} from "@/backend/api/controllers/supabase"
import { Enum } from "@/backend/api/enums/enum"
import { useControlModal } from "@/lib/hooks/useControlModal"
import { normalizarErroSupabase } from "@/lib/utils/supabase"
import { possuiRuntimeTauri } from "@/lib/utils/tauri"

export const useSupabaseIntegrationDialog = () => {
    const { modal, setModal } = useControlModal(["removerConexao"] as const)
    const [token, setToken] = useState("")
    const [formVisible, setFormVisible] = useState(false)
    const {
        data: connection,
        isLoading: connectionIsLoading,
        isError: connectionIsError,
        error: connectionError,
        refetch: retry,
    } = useObterConexaoSupabase()
    const { mutateAsync: saveConnection, isPending: saveConnectionIsPending } =
        useSalvarConexaoSupabase()
    const { mutateAsync: testConnection, isPending: testConnectionIsPending } =
        useTestarConexaoSupabase()
    const { mutateAsync: removeConnection, isPending: removeConnectionIsPending } =
        useRemoverConexaoSupabase()

    const resetForm = () => {
        setToken("")
        setFormVisible(false)
    }

    const save = async () => {
        const tokenNormalizado = token.trim()
        if (!tokenNormalizado) {
            toast.error("Informe o Personal Access Token do Supabase.")
            return
        }
        try {
            await saveConnection({ token: tokenNormalizado })
            resetForm()
            toast.success(connection ? "Token Supabase substituído." : "Supabase conectado.")
        } catch (error) {
            toast.error(normalizarErroSupabase(error).message)
        }
    }

    const test = async () => {
        try {
            const testedConnection = await testConnection()
            if (testedConnection.status === Enum.StatusIntegracao.Erro) {
                toast.error(testedConnection.erro ?? "A conexão Supabase apresentou um erro.")
                return
            }
            toast.success("Conexão Supabase validada.")
        } catch (error) {
            toast.error(normalizarErroSupabase(error).message)
        }
    }

    const remove = async () => {
        try {
            await removeConnection()
            resetForm()
            setModal("removerConexao", { open: false })
            toast.success("Conexão e token Supabase removidos.")
        } catch (error) {
            toast.error(normalizarErroSupabase(error).message)
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
