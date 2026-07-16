import { useEffect, useState } from "react"
import { toast } from "sonner"

import { useObterPreferencias, useSalvarPreferencias } from "@/backend/api/controllers/preferencias"
import type { PreferenciasAplicacao } from "@/backend/api/models/preferencias.types"
import { exportarBackupBancoDados, revelarBancoDados } from "@/backend/sql/database"
import {
    configurarInicializacaoComSistema,
    enviarNotificacaoSistema,
    garantirPermissaoNotificacoes,
    obterInformacoesDesktop,
} from "@/lib/config/desktop"
import { PREFERENCIAS_PADRAO } from "@/lib/config/preferencias"
import { possuiRuntimeTauri } from "@/lib/utils/tauri"
import type { InformacoesConfiguracoes } from "@/pages/Configuracoes/Configuracoes.types"
import {
    INFORMACOES_INICIAIS,
    obterMensagemErroConfiguracoes,
} from "@/pages/Configuracoes/Configuracoes.utils"

export const useConfiguracoes = () => {
    const runtimeDisponivel = possuiRuntimeTauri()
    const {
        data: preferencias = PREFERENCIAS_PADRAO,
        error: preferenciasErro,
        isError: preferenciasIsError,
        isLoading: preferenciasIsLoading,
        isPlaceholderData: preferenciasIsPlaceholderData,
        refetch: tentarObterPreferenciasNovamente,
    } = useObterPreferencias()
    const { mutateAsync: salvarPreferencias, isPending: preferenciasIsPending } = useSalvarPreferencias()
    const [informacoes, setInformacoes] = useState<InformacoesConfiguracoes>(INFORMACOES_INICIAIS)
    const [armazenamentoIsPending, setArmazenamentoIsPending] = useState(false)

    useEffect(() => {
        let ativo = true

        void obterInformacoesDesktop()
            .then((resultado) => {
                if (ativo) setInformacoes(resultado)
            })
            .catch((erro: unknown) => {
                if (!ativo) return
                setInformacoes((atuais) => ({
                    ...atuais,
                    caminhoBanco: obterMensagemErroConfiguracoes(erro),
                }))
            })

        return () => {
            ativo = false
        }
    }, [])

    const alterar = async <Campo extends keyof PreferenciasAplicacao>(
        campo: Campo,
        valor: PreferenciasAplicacao[Campo]
    ) => {
        if (preferencias[campo] === valor) return

        const atualizadas = { ...preferencias, [campo]: valor }
        let inicializacaoAlterada = false

        try {
            if (campo === "iniciarComSistema") {
                await configurarInicializacaoComSistema(Boolean(valor))
                inicializacaoAlterada = true
            }

            if (campo === "notificacoesSistema" && valor === true) {
                await garantirPermissaoNotificacoes()
            }

            await salvarPreferencias(atualizadas)

            if (campo === "notificacoesSistema" && valor === true) {
                void enviarNotificacaoSistema(
                    "DashwoBoard",
                    "Notificações do sistema ativadas.",
                    atualizadas.somIncidente
                ).catch((erro: unknown) => {
                    toast.warning(obterMensagemErroConfiguracoes(erro))
                })
            }
        } catch (erro) {
            if (inicializacaoAlterada) {
                void configurarInicializacaoComSistema(preferencias.iniciarComSistema).catch(
                    () => undefined
                )
            }
            toast.error(obterMensagemErroConfiguracoes(erro))
        }
    }

    const abrirPasta = async () => {
        setArmazenamentoIsPending(true)
        try {
            await revelarBancoDados()
        } catch (erro) {
            toast.error(obterMensagemErroConfiguracoes(erro))
        } finally {
            setArmazenamentoIsPending(false)
        }
    }

    const exportarBackup = async () => {
        setArmazenamentoIsPending(true)
        try {
            await exportarBackupBancoDados()
            toast.success("Backup exportado para a pasta de downloads.")
        } catch (erro) {
            toast.error(obterMensagemErroConfiguracoes(erro))
        } finally {
            setArmazenamentoIsPending(false)
        }
    }

    return {
        preferencias,
        informacoes,
        alterar,
        abrirPasta,
        exportarBackup,
        armazenamentoIsPending,
        preferenciasIsPending,
        preferenciasIsLoading:
            runtimeDisponivel && (preferenciasIsLoading || preferenciasIsPlaceholderData),
        preferenciasIsError,
        preferenciasErro: obterMensagemErroConfiguracoes(preferenciasErro),
        tentarObterPreferenciasNovamente,
    }
}
