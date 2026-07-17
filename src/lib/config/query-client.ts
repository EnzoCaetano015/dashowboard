import { QueryCache, QueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { obterMensagemErro } from "@/lib/utils/error"

const MENSAGEM_ERRO_CONSULTA = "Não foi possível concluir a consulta. Tente novamente."

export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (erro, query) => {
            toast.error(obterMensagemErro(erro, MENSAGEM_ERRO_CONSULTA), {
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
