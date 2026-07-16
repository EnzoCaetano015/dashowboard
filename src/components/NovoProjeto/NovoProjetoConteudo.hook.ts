import { useEffect, useState } from "react"
import { toast } from "sonner"

import { useObterConexoesGitHub, useObterRepositoriosGitHub } from "@/backend/api/controllers/github"
import { useObterConexaoSupabase, useObterProjetosSupabase } from "@/backend/api/controllers/supabase"
import { useObterConexaoVercel, useObterProjetosVercel } from "@/backend/api/controllers/vercel"
import { Enum } from "@/backend/api/enums/enum"
import type { RepositorioGitHub } from "@/backend/api/models/github.types"
import type { ProjetoSupabase } from "@/backend/api/models/supabase.types"
import type { ProjetoVercel } from "@/backend/api/models/vercel.types"
import type {
    EtapaNovoProjeto,
    RepositorioSelecionado,
    ServicoSelecionado,
} from "@/components/NovoProjeto/NovoProjeto.types"
import { normalizarErroGitHub } from "@/lib/utils/github"
import { normalizarErroSupabase } from "@/lib/utils/supabase"
import { possuiRuntimeTauri } from "@/lib/utils/tauri"
import { normalizarErroVercel } from "@/lib/utils/vercel"

export const useNovoProjetoConteudo = (open: boolean, onClose: () => void) => {
    const [etapa, setEtapa] = useState<EtapaNovoProjeto>(1)
    const [repositoriosSelecionados, setRepositoriosSelecionados] = useState<RepositorioSelecionado[]>(
        []
    )
    const [servicos, setServicos] = useState<ServicoSelecionado[]>([])
    const runtimeDisponivel = possuiRuntimeTauri()

    const {
        data: connections,
        isLoading: connectionsIsLoading,
        isError: connectionsIsError,
        error: connectionsError,
        refetch: refetchConnections,
    } = useObterConexoesGitHub()
    const {
        data: repositoriesData,
        isLoading: repositoriesIsLoading,
        isFetching: repositoriesIsFetching,
        isError: repositoriesIsError,
        error: repositoriesError,
        refetch: refetchRepositories,
    } = useObterRepositoriosGitHub({}, open && (connections?.length ?? 0) > 0)
    const {
        data: vercelConnection,
        isLoading: vercelConnectionIsLoading,
        isError: vercelConnectionIsError,
        error: vercelConnectionError,
        refetch: refetchVercelConnection,
    } = useObterConexaoVercel()
    const {
        data: vercelProjectsData,
        isLoading: vercelProjectsIsLoading,
        isFetching: vercelProjectsIsFetching,
        isError: vercelProjectsIsError,
        error: vercelProjectsError,
        refetch: refetchVercelProjects,
    } = useObterProjetosVercel(open && Boolean(vercelConnection))
    const {
        data: supabaseConnection,
        isLoading: supabaseConnectionIsLoading,
        isError: supabaseConnectionIsError,
        error: supabaseConnectionError,
        refetch: refetchSupabaseConnection,
    } = useObterConexaoSupabase()
    const {
        data: supabaseProjectsData,
        isLoading: supabaseProjectsIsLoading,
        isFetching: supabaseProjectsIsFetching,
        isError: supabaseProjectsIsError,
        error: supabaseProjectsError,
        refetch: refetchSupabaseProjects,
    } = useObterProjetosSupabase(open && runtimeDisponivel && Boolean(supabaseConnection))

    const alternarServico = (servico: ServicoSelecionado) => {
        setServicos((values) => {
            const selecionado = values.some(
                (value) =>
                    value.provider === servico.provider &&
                    value.externalProjectId === servico.externalProjectId &&
                    value.scopeId === servico.scopeId
            )
            return selecionado
                ? values.filter(
                      (value) =>
                          value.provider !== servico.provider ||
                          value.externalProjectId !== servico.externalProjectId ||
                          value.scopeId !== servico.scopeId
                  )
                : [...values, servico]
        })
    }

    const alternarServicoVercel = (project: ProjetoVercel) => {
        alternarServico({
            provider: Enum.Provider.Vercel,
            externalProjectId: project.id,
            scopeId: project.escopo.id,
            tipo: Enum.TipoServico.Frontend,
        })
    }

    const alternarServicoSupabase = (project: ProjetoSupabase) => {
        alternarServico({
            provider: Enum.Provider.Supabase,
            externalProjectId: project.ref,
            scopeId: project.organizacaoSlug,
            tipo: Enum.TipoServico.BancoDados,
        })
    }

    const alternarRepositorio = (repository: RepositorioGitHub) => {
        setRepositoriosSelecionados((values) => {
            const selected = values.some((value) => value.repositoryId === repository.id)
            return selected
                ? values.filter((value) => value.repositoryId !== repository.id)
                : [
                      ...values,
                      {
                          repositoryId: repository.id,
                          connectionId: repository.connectionId,
                          tag: Enum.TagRepositorio.Documentacao,
                      },
                  ]
        })
    }

    const alterarTagRepositorio = (repositoryId: number, tag: Enum.TagRepositorio) => {
        setRepositoriosSelecionados((values) =>
            values.map((value) => (value.repositoryId === repositoryId ? { ...value, tag } : value))
        )
    }

    const voltar = () => setEtapa((valor) => Math.max(1, valor - 1) as EtapaNovoProjeto)
    const continuar = () => setEtapa((valor) => Math.min(5, valor + 1) as EtapaNovoProjeto)
    useEffect(() => {
        if (!open) {
            setEtapa(1)
            setRepositoriosSelecionados([])
            setServicos([])
        }
    }, [open])

    const concluir = () => {
        onClose()
        toast.info("Projeto ainda não persistido nesta etapa.", {
            description: `${repositoriosSelecionados.length} repositório(s) e ${servicos.length} serviço(s) selecionado(s).`,
        })
    }

    return {
        etapa,
        repositorios: repositoriesData?.repositories ?? [],
        repositoriosSelecionados,
        repositoriosRelacionamento: (repositoriesData?.repositories ?? []).filter((repository) =>
            repositoriosSelecionados.some((selected) => selected.repositoryId === repository.id)
        ),
        repositoriosIsLoading: connectionsIsLoading || repositoriesIsLoading,
        repositoriosIsFetching: repositoriesIsFetching,
        repositoriosIsError: connectionsIsError || repositoriesIsError,
        repositoriosErro: normalizarErroGitHub(connectionsError ?? repositoriesError).message,
        repositoriosFalhas: repositoriesData?.failures ?? [],
        quantidadeConexoes: connections?.length ?? 0,
        runtimeDisponivel,
        servicos,
        vercel: {
            projetos: vercelProjectsData?.projects ?? [],
            configurada: Boolean(vercelConnection),
            runtimeDisponivel,
            isLoading:
                vercelConnectionIsLoading || (Boolean(vercelConnection) && vercelProjectsIsLoading),
            isFetching: vercelProjectsIsFetching,
            isError: vercelConnectionIsError || vercelProjectsIsError,
            erro: normalizarErroVercel(vercelConnectionError ?? vercelProjectsError).message,
            falhas: vercelProjectsData?.failures ?? [],
            alternar: alternarServicoVercel,
            tentarNovamente: async () => {
                const connection = await refetchVercelConnection()
                if (connection.data) await refetchVercelProjects()
            },
            atualizar: refetchVercelProjects,
        },
        supabase: {
            projetos: supabaseProjectsData?.projects ?? [],
            configurada: Boolean(supabaseConnection),
            runtimeDisponivel,
            isLoading:
                supabaseConnectionIsLoading ||
                (Boolean(supabaseConnection) && supabaseProjectsIsLoading),
            isFetching: supabaseProjectsIsFetching,
            isError: supabaseConnectionIsError || supabaseProjectsIsError,
            erro: normalizarErroSupabase(supabaseConnectionError ?? supabaseProjectsError).message,
            falhas: supabaseProjectsData?.failures ?? [],
            alternar: alternarServicoSupabase,
            tentarNovamente: async () => {
                const connection = await refetchSupabaseConnection()
                if (connection.data) await refetchSupabaseProjects()
            },
            atualizar: refetchSupabaseProjects,
        },
        voltar,
        continuar,
        concluir,
        alternarRepositorio,
        alterarTagRepositorio,
        tentarNovamenteRepositorios: async () => {
            const connectionsResult = await refetchConnections()
            if ((connectionsResult.data?.length ?? 0) > 0) await refetchRepositories()
        },
        atualizarRepositorios: refetchRepositories,
    }
}
