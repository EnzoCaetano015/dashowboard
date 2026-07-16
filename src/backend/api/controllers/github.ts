import { useMutation, useQuery } from "@tanstack/react-query"

import { useObterPreferencias } from "@/backend/api/controllers/preferencias"
import {
    obterConexoesGitHub,
    obterRepositoriosGitHub,
    removerConexaoGitHub,
    salvarConexaoGitHub,
    testarConexaoGitHub,
} from "@/backend/api/integrations/github"
import type {
    ObterRepositoriosGitHub,
    RemoverConexaoGitHub,
    SalvarConexaoGitHub,
    TestarConexaoGitHub,
} from "@/backend/api/models/github.types"
import { GitHubQueryKeys } from "@/backend/api/models/github.types"
import { obterConfiguracaoMonitoramento, TEMPO_CACHE_REPOSITORIOS_GITHUB } from "@/lib/config/monitoring"
import { queryClient } from "@/lib/config/query-client"
import { deveTentarNovamenteGitHub } from "@/lib/utils/github"
import { possuiRuntimeTauri } from "@/lib/utils/tauri"

export const useObterConexoesGitHub = () => {
    return useQuery({
        queryKey: [GitHubQueryKeys.Conexoes],
        queryFn: obterConexoesGitHub,
        enabled: possuiRuntimeTauri(),
        retry: deveTentarNovamenteGitHub,
    })
}

export const useSalvarConexaoGitHub = () => {
    return useMutation({
        mutationFn: (request: SalvarConexaoGitHub.Request) => salvarConexaoGitHub(request),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [GitHubQueryKeys.Conexoes] })
            await queryClient.invalidateQueries({ queryKey: [GitHubQueryKeys.Repositorios] })
        },
    })
}

export const useTestarConexaoGitHub = () => {
    return useMutation({
        mutationFn: (request: TestarConexaoGitHub.Request) => testarConexaoGitHub(request),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [GitHubQueryKeys.Conexoes] })
            await queryClient.invalidateQueries({ queryKey: [GitHubQueryKeys.Repositorios] })
        },
    })
}

export const useRemoverConexaoGitHub = () => {
    return useMutation({
        mutationFn: (request: RemoverConexaoGitHub.Request) => removerConexaoGitHub(request),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: [GitHubQueryKeys.Conexoes] })
            await queryClient.invalidateQueries({ queryKey: [GitHubQueryKeys.Repositorios] })
        },
    })
}

export const useObterRepositoriosGitHub = (
    request: ObterRepositoriosGitHub.Request = {},
    enabled = true
) => {
    const { data: preferencias } = useObterPreferencias()
    const { intervaloAtualizacao, verificacaoSegundoPlano } =
        obterConfiguracaoMonitoramento(preferencias)

    return useQuery({
        queryKey: [GitHubQueryKeys.Repositorios, request.connectionIds ?? []],
        queryFn: () => obterRepositoriosGitHub(request),
        enabled: enabled && possuiRuntimeTauri(),
        staleTime: TEMPO_CACHE_REPOSITORIOS_GITHUB,
        refetchInterval: intervaloAtualizacao,
        refetchIntervalInBackground: verificacaoSegundoPlano,
        refetchOnReconnect: true,
        retry: deveTentarNovamenteGitHub,
    })
}
