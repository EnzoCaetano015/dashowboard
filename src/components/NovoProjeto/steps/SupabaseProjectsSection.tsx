import { Database, ExternalLink, RefreshCw } from "lucide-react"
import { Link } from "react-router-dom"

import { Enum } from "@/backend/api/enums/enum"
import type { SupabaseProjectsSectionProps } from "@/components/NovoProjeto/NovoProjeto.types"
import { ProviderIcon } from "@/components/ProviderIcon/ProviderIcon"
import { StatusBadge } from "@/components/StatusBadge/StatusBadge"
import { TemplateEstado } from "@/components/TemplateEstado"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { abrirUrlExterna } from "@/lib/utils/tauri"

export const SupabaseProjectsSection = ({
    projetos,
    selecionados,
    runtimeDisponivel,
    configurada,
    isLoading,
    isFetching,
    falhas,
    alternar,
    atualizar,
}: SupabaseProjectsSectionProps) => (
    <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
            <div>
                <h3 className="text-sm font-medium">Projetos Supabase</h3>
                <p className="text-xs text-muted-foreground">
                    Selecione bancos acessíveis ao Personal Access Token.
                </p>
            </div>
            {runtimeDisponivel && configurada && !isLoading && (
                <Button
                    size="sm"
                    variant="outline"
                    disabled={isFetching}
                    onClick={atualizar}
                >
                    <RefreshCw className={isFetching ? "animate-spin" : undefined} /> Atualizar
                </Button>
            )}
        </div>

        {!runtimeDisponivel ? (
            <EstadoSupabase descricao="A integração Supabase está disponível no aplicativo desktop." />
        ) : !isLoading && !configurada ? (
            <EstadoSupabase descricao="Conecte sua conta Supabase para listar os projetos." />
        ) : isLoading ? (
            <TemplateEstado.Carregando
                skeleton={{ quantidade: 3, orientacao: "vertical" }}
                className="[&_[data-slot=skeleton]]:h-32"
            />
        ) : projetos.length === 0 ? (
            <div className="space-y-3">
                <TemplateEstado.Vazio
                    titulo="Nenhum projeto Supabase encontrado"
                    subtitulo="Nenhum projeto acessível foi encontrado nas organizações configuradas."
                    Icon={Database}
                />
                {falhas.length > 0 && <FalhasSupabase falhas={falhas} />}
            </div>
        ) : (
            <>
                {falhas.length > 0 && <FalhasSupabase falhas={falhas} />}
                {projetos.map((projeto) => {
                    const selecionado = selecionados.some(
                        (value) =>
                            value.provider === Enum.Provider.Supabase &&
                            value.externalProjectId === projeto.ref &&
                            value.scopeId === projeto.organizacaoSlug
                    )
                    const inativo = projeto.statusOriginal === "INACTIVE"
                    return (
                        <div
                            key={projeto.ref}
                            className="flex items-start gap-3 rounded-md border border-border bg-surface-2 p-3 hover:border-primary/50"
                        >
                            <Checkbox
                                checked={selecionado}
                                onCheckedChange={() => alternar(projeto)}
                                aria-label={`Selecionar ${projeto.nome}`}
                            />
                            <ProviderIcon provider={Enum.Provider.Supabase} />
                            <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <b className="truncate text-sm font-medium">{projeto.nome}</b>
                                    <StatusBadge status={projeto.status} />
                                    <Badge variant={inativo ? "destructive" : "outline"}>
                                        {inativo
                                            ? "Pausado"
                                            : projeto.statusOriginal === "ACTIVE_HEALTHY"
                                              ? "Ativo"
                                              : projeto.statusOriginal || "Desconhecido"}
                                    </Badge>
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    {projeto.organizacaoNome} ·{" "}
                                    {projeto.regiao || "Região não informada"}
                                    {" · "}
                                    {projeto.cloudProvider || "Cloud não informada"}
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Banco: {projeto.banco?.statusOriginal || "Não informado"} · Compute:{" "}
                                    {projeto.banco?.computeSize || "Não informado"}
                                </p>
                            </div>
                            {inativo && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => void abrirUrlExterna(projeto.dashboardUrl)}
                                >
                                    Abrir no Supabase <ExternalLink />
                                </Button>
                            )}
                        </div>
                    )
                })}
            </>
        )}
    </section>
)

const FalhasSupabase = ({ falhas }: Pick<SupabaseProjectsSectionProps, "falhas">) => (
    <div className="rounded-md border border-warning/40 bg-warning/10 p-3 text-xs text-warning">
        {falhas.map((falha) => (
            <p
                key={`${falha.organizacaoId}-${falha.code}`}
                className="text-xs"
            >
                <b>{falha.organizacaoNome}:</b> {falha.message}
            </p>
        ))}
    </div>
)

const EstadoSupabase = ({ descricao }: { descricao: string }) => (
    <div className="rounded-lg border border-dashed p-8 text-center">
        <ProviderIcon
            provider={Enum.Provider.Supabase}
            className="mx-auto size-8"
        />
        <p className="mt-3 text-sm text-muted-foreground">{descricao}</p>
        <Button
            render={<Link to="/integracoes" />}
            nativeButton={false}
            className="mt-4"
        >
            Ir para Integrações
        </Button>
    </div>
)
