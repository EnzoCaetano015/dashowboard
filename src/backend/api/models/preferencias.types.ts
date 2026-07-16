import type { Enum } from "@/backend/api/enums/enum"

export enum PreferenciasQueryKeys {
    ObterPreferencias = "obter-preferencias-aplicacao",
}

export type PreferenciasAplicacao = {
    iniciarComSistema: boolean
    verificacaoSegundoPlano: boolean
    intervaloPadraoSegundos: Enum.IntervaloAtualizacao
    notificacoesSistema: boolean
    somIncidente: boolean
    badgeIcone: boolean
    tema: Enum.TemaAplicacao
    densidade: Enum.DensidadeAplicacao
    nomeDesenvolvedor: string
}

export namespace ObterPreferencias {
    export type Request = void
    export type Response = PreferenciasAplicacao
}

export namespace SalvarPreferencias {
    export type Request = PreferenciasAplicacao
    export type Response = PreferenciasAplicacao
}
