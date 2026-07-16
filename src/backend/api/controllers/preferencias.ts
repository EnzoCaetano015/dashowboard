import { useMutation, useQuery } from "@tanstack/react-query"

import {
    PreferenciasQueryKeys,
    type PreferenciasAplicacao,
    type SalvarPreferencias,
} from "@/backend/api/models/preferencias.types"
import { obterPreferencias, salvarPreferencias } from "@/backend/sql/preferencias.repository"
import { notificacoesDoSistemaPermitidas, obterInicializacaoComSistema } from "@/lib/config/desktop"
import { PREFERENCIAS_PADRAO } from "@/lib/config/preferencias"
import { queryClient } from "@/lib/config/query-client"
import { possuiRuntimeTauri } from "@/lib/utils/tauri"

const CHAVE_PREFERENCIAS = [PreferenciasQueryKeys.ObterPreferencias]

const obterPreferenciasSincronizadas = async () => {
    const preferencias = await obterPreferencias()
    const [iniciarComSistema, notificacoesPermitidas] = await Promise.all([
        obterInicializacaoComSistema(),
        notificacoesDoSistemaPermitidas(),
    ])
    const sincronizadas = {
        ...preferencias,
        iniciarComSistema,
        notificacoesSistema: preferencias.notificacoesSistema && notificacoesPermitidas,
    }

    if (
        sincronizadas.iniciarComSistema !== preferencias.iniciarComSistema ||
        sincronizadas.notificacoesSistema !== preferencias.notificacoesSistema
    ) {
        await salvarPreferencias(sincronizadas)
    }

    return sincronizadas
}

export const useObterPreferencias = () => {
    const runtimeDisponivel = possuiRuntimeTauri()

    return useQuery({
        queryKey: CHAVE_PREFERENCIAS,
        queryFn: obterPreferenciasSincronizadas,
        enabled: runtimeDisponivel,
        placeholderData: PREFERENCIAS_PADRAO,
        staleTime: Number.POSITIVE_INFINITY,
        retry: false,
    })
}

export const useSalvarPreferencias = () => {
    return useMutation({
        mutationFn: (request: SalvarPreferencias.Request) => {
            if (!possuiRuntimeTauri()) return Promise.resolve(request)
            return salvarPreferencias(request)
        },
        onMutate: async (request) => {
            await queryClient.cancelQueries({ queryKey: CHAVE_PREFERENCIAS })
            const anteriores = queryClient.getQueryData<PreferenciasAplicacao>(CHAVE_PREFERENCIAS)
            queryClient.setQueryData(CHAVE_PREFERENCIAS, request)
            return { anteriores }
        },
        onError: (_erro, request, contexto) => {
            const atuais = queryClient.getQueryData<PreferenciasAplicacao>(CHAVE_PREFERENCIAS)
            if (contexto?.anteriores && atuais === request) {
                queryClient.setQueryData(CHAVE_PREFERENCIAS, contexto.anteriores)
            }
        },
        scope: {
            id: "salvar-preferencias-aplicacao",
        },
    })
}
