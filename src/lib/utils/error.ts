export const obterMensagemErro = (erro: unknown, fallback: string) => {
    if (typeof erro === "string" && erro.trim()) return erro
    if (erro instanceof Error && erro.message.trim()) return erro.message

    if (typeof erro === "object" && erro !== null && "message" in erro) {
        const mensagem = String(erro.message)
        if (mensagem.trim()) return mensagem
    }

    return fallback
}
