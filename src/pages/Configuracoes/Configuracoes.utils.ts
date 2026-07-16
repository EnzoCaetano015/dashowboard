import { Enum } from "@/backend/api/enums/enum"
import type { InformacoesConfiguracoes } from "@/pages/Configuracoes/Configuracoes.types"

export const INFORMACOES_INICIAIS: InformacoesConfiguracoes = {
    caminhoBanco: "Carregando...",
    versao: "—",
    runtime: "—",
    build: "—",
}

export const OPCOES_INTERVALO_ATUALIZACAO = [
    { valor: Enum.IntervaloAtualizacao.TrintaSegundos, titulo: "30 s" },
    { valor: Enum.IntervaloAtualizacao.UmMinuto, titulo: "1 min" },
    { valor: Enum.IntervaloAtualizacao.CincoMinutos, titulo: "5 min" },
] as const

export const OPCOES_TEMA = [
    { valor: Enum.TemaAplicacao.Escuro, titulo: "Escuro" },
    { valor: Enum.TemaAplicacao.Claro, titulo: "Claro" },
    { valor: Enum.TemaAplicacao.Sistema, titulo: "Sistema" },
] as const

export const OPCOES_DENSIDADE = [
    { valor: Enum.DensidadeAplicacao.Confortavel, titulo: "Confortável" },
    { valor: Enum.DensidadeAplicacao.Compacta, titulo: "Compacto" },
] as const

export const converterIntervaloAtualizacao = (valor: string) => {
    return OPCOES_INTERVALO_ATUALIZACAO.find((opcao) => String(opcao.valor) === valor)?.valor
}

export const converterTema = (valor: string) => {
    return OPCOES_TEMA.find((opcao) => opcao.valor === valor)?.valor
}

export const converterDensidade = (valor: string) => {
    return OPCOES_DENSIDADE.find((opcao) => opcao.valor === valor)?.valor
}

export const obterMensagemErroConfiguracoes = (erro: unknown) => {
    if (erro instanceof Error) return erro.message

    if (typeof erro === "object" && erro !== null) {
        const mensagem = Reflect.get(erro, "message")
        if (typeof mensagem === "string") return mensagem
    }

    return "Não foi possível concluir a operação."
}
