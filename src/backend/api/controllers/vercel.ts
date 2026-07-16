import { useMutation, useQuery } from "@tanstack/react-query"

import { useObterPreferencias } from "@/backend/api/controllers/preferencias"
import {
    obterConexaoVercel,
    obterProjetosVercel,
    removerConexaoVercel,
    salvarConexaoVercel,
    testarConexaoVercel,
} from "@/backend/api/integrations/vercel"
import { VercelQueryKeys, type SalvarConexaoVercel } from "@/backend/api/models/vercel.types"
import { obterConfiguracaoMonitoramento, TEMPO_CACHE_PROJETOS_VERCEL } from "@/lib/config/monitoring"
import { queryClient } from "@/lib/config/query-client"
import { possuiRuntimeTauri } from "@/lib/utils/tauri"
import { deveTentarNovamenteVercel } from "@/lib/utils/vercel"

export const useObterConexaoVercel = () => {
    return useQuery({
        queryKey: [VercelQueryKeys.Conexao],
        queryFn: obterConexaoVercel,
        enabled: possuiRuntimeTauri(),
        retry: deveTentarNovamenteVercel,
    })
}

export const useSalvarConexaoVercel = () => {
    return useMutation({
        mutationFn: (request: SalvarConexaoVercel.Request) => salvarConexaoVercel(request),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [VercelQueryKeys.Conexao] })
            await queryClient.invalidateQueries({ queryKey: [VercelQueryKeys.Projetos] })
        },
    })
}

export const useTestarConexaoVercel = () => {
    return useMutation({
        mutationFn: testarConexaoVercel,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [VercelQueryKeys.Conexao] })
            await queryClient.invalidateQueries({ queryKey: [VercelQueryKeys.Projetos] })
        },
    })
}

export const useRemoverConexaoVercel = () => {
    return useMutation({
        mutationFn: removerConexaoVercel,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [VercelQueryKeys.Conexao] })
            await queryClient.invalidateQueries({ queryKey: [VercelQueryKeys.Projetos] })
        },
    })
}

export const useObterProjetosVercel = (enabled = true) => {
    const { data: preferencias } = useObterPreferencias()
    const { intervaloAtualizacao, verificacaoSegundoPlano } =
        obterConfiguracaoMonitoramento(preferencias)

    return useQuery({
        queryKey: [VercelQueryKeys.Projetos],
        queryFn: obterProjetosVercel,
        enabled: enabled && possuiRuntimeTauri(),
        staleTime: TEMPO_CACHE_PROJETOS_VERCEL,
        refetchInterval: intervaloAtualizacao,
        refetchIntervalInBackground: verificacaoSegundoPlano,
        refetchOnReconnect: true,
        retry: deveTentarNovamenteVercel,
    })
}
