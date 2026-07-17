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
    const { data: integracoesBase = [] } = useObterIntegracoes()
    const {
        data: conexoesGitHub = [],
        isLoading: githubIsLoading,
    } = useObterConexoesGitHub()
    const {
        data: conexaoVercel,
        isLoading: vercelIsLoading,
    } = useObterConexaoVercel()
    const {
        data: conexaoSupabase,
        isLoading: supabaseIsLoading,
    } = useObterConexaoSupabase()
    const { data: projetosSupabase } = useObterProjetosSupabase(Boolean(conexaoSupabase))
    const runtimeDisponivel = possuiRuntimeTauri()

    const integracoes = useMemo(
        () => [
            montarIntegracaoGitHub(conexoesGitHub, {
                runtimeDisponivel,
                isLoading: githubIsLoading,
            }),
            montarIntegracaoVercel(conexaoVercel ?? null, {
                runtimeDisponivel,
                isLoading: vercelIsLoading,
            }),
            montarIntegracaoSupabase(conexaoSupabase ?? null, projetosSupabase, {
                runtimeDisponivel,
                isLoading: supabaseIsLoading,
            }),
            ...integracoesBase,
        ],
        [
            conexaoSupabase,
            conexaoVercel,
            conexoesGitHub,
            githubIsLoading,
            integracoesBase,
            projetosSupabase,
            runtimeDisponivel,
            supabaseIsLoading,
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
        abrirDialogo,
    }
}
