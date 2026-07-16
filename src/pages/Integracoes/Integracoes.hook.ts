import { useMemo } from "react"

import { useObterConexoesGitHub } from "@/backend/api/controllers/github"
import { useObterIntegracoes } from "@/backend/api/controllers/integracao"
import { useObterConexaoSupabase, useObterProjetosSupabase } from "@/backend/api/controllers/supabase"
import { useObterConexaoVercel } from "@/backend/api/controllers/vercel"
import { Enum } from "@/backend/api/enums/enum"
import {
    montarIntegracaoGitHub,
    montarIntegracaoSupabase,
    montarIntegracaoVercel,
} from "@/pages/Integracoes/Integracoes.utils"
import { possuiRuntimeTauri } from "@/lib/utils/tauri"
import { useControlModal } from "@/lib/hooks/useControlModal"

export const useIntegracoes = () => {
    const { modal, setModal } = useControlModal([
        "integracaoGitHub",
        "integracaoVercel",
        "integracaoSupabase",
    ] as const)
    const {
        data: integracoesBase,
        isLoading: integracoesIsLoading,
        isError: integracoesIsError,
        refetch: tentarNovamente,
    } = useObterIntegracoes()
    const {
        data: conexoesGitHub,
        isLoading: githubIsLoading,
        isError: githubIsError,
        error: githubError,
    } = useObterConexoesGitHub()
    const {
        data: conexaoVercel,
        isLoading: vercelIsLoading,
        isError: vercelIsError,
        error: vercelError,
    } = useObterConexaoVercel()
    const {
        data: conexaoSupabase,
        isLoading: supabaseIsLoading,
        isError: supabaseIsError,
        error: supabaseError,
    } = useObterConexaoSupabase()
    const {
        data: projetosSupabase,
        isError: projetosSupabaseIsError,
        error: projetosSupabaseError,
    } = useObterProjetosSupabase(Boolean(conexaoSupabase))
    const runtimeDisponivel = possuiRuntimeTauri()

    const integracoes = useMemo(
        () => [
            montarIntegracaoGitHub(conexoesGitHub ?? [], {
                runtimeDisponivel,
                isLoading: githubIsLoading,
                isError: githubIsError,
                error: githubError,
            }),
            montarIntegracaoVercel(conexaoVercel ?? null, {
                runtimeDisponivel,
                isLoading: vercelIsLoading,
                isError: vercelIsError,
                error: vercelError,
            }),
            montarIntegracaoSupabase(
                conexaoSupabase ?? null,
                projetosSupabase,
                {
                    runtimeDisponivel,
                    isLoading: supabaseIsLoading,
                    isError: supabaseIsError,
                    error: supabaseError,
                },
                {
                    isError: projetosSupabaseIsError,
                    error: projetosSupabaseError,
                }
            ),
            ...(integracoesBase ?? []),
        ],
        [
            conexaoSupabase,
            conexaoVercel,
            conexoesGitHub,
            githubError,
            githubIsError,
            githubIsLoading,
            integracoesBase,
            projetosSupabase,
            projetosSupabaseError,
            projetosSupabaseIsError,
            runtimeDisponivel,
            supabaseError,
            supabaseIsError,
            supabaseIsLoading,
            vercelError,
            vercelIsError,
            vercelIsLoading,
        ]
    )

    const abrirDialogo = (provider: Enum.Provider) => {
        if (provider === Enum.Provider.GitHub) {
            setModal("integracaoGitHub", { open: true })
        }
        if (provider === Enum.Provider.Vercel) {
            setModal("integracaoVercel", { open: true })
        }
        if (provider === Enum.Provider.Supabase) {
            setModal("integracaoSupabase", { open: true })
        }
    }

    return {
        modal,
        setModal,
        integracoes,
        isLoading: integracoesIsLoading,
        isError: integracoesIsError,
        abrirDialogo,
        tentarNovamente,
    }
}
