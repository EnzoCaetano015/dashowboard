import { QueryCache, QueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const MENSAGEM_ERRO_CONSULTA = "Não foi possível concluir a consulta. Tente novamente."

const obterMensagemErroConsulta = (erro: unknown) => {
    if (typeof erro === "string" && erro.trim()) return erro
    if (erro instanceof Error && erro.message.trim()) return erro.message

    if (typeof erro === "object" && erro !== null) {
        const mensagem = Reflect.get(erro, "message")
        if (typeof mensagem === "string" && mensagem.trim()) return mensagem
    }

    return MENSAGEM_ERRO_CONSULTA
}

export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (erro, query) => {
            toast.error(obterMensagemErroConsulta(erro), {
                id: `query-error-${query.queryHash}`,
            })
        },
    }),
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        },
    },
})
